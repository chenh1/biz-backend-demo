const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SG_API_KEY);

const getProgressData = async ctx => {
  const res = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: ctx.state.user.id }
  })

  const { progressData } = res || {};

  return progressData || {}
}

const updateCurrentModule = async (ctx, args) => {
  if (!ctx.state.user || !ctx.state.user.id) {
    return ctx.response.status = 401
  }

  const progressData = await getProgressData(ctx)
  const newMergeObj = {
    currentModule: args?.moduleData
  }

  const completedModuleData = args?.completedModuleData

  if (completedModuleData) {
    const { completedModules } = progressData || {}
    let newCompletedModules = [...(completedModules || [])]

    //if already exists, update, otherwise, add
    const index = newCompletedModules.findIndex(module => module.lessonModule === completedModuleData.lessonModule)
    if (index > -1) {
      newCompletedModules[index] = completedModuleData
    }
    else {
      newCompletedModules.push(completedModuleData)
    }

    newMergeObj.completedModules = newCompletedModules
  }

  const newProgressData = Object.assign({}, progressData, newMergeObj);

  const res = await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: ctx.state.user.id },
    data: { progressData: newProgressData }
  }).then(res => true)
  
  return res
}

const addCompletedModulesEntries = async (ctx, args) => {
  if (!ctx.state.user || !ctx.state.user.id) {
    return ctx.response.status = 401
  }

  const progressData = await getProgressData(ctx)
  const { completedModules } = progressData || {}
  let newCompletedModules = [...(completedModules || [])]

  //if already exists, update, otherwise, add
  if (args?.moduleData) {
    args.moduleData.forEach(arg => {
      const index = newCompletedModules.findIndex(module => module.lessonModule === arg.lessonModule)
      if (index > -1) {
        newCompletedModules[index] = arg
      }
      else {
        newCompletedModules.push(arg)
      }
    })
  }

  const newProgressData = Object.assign({}, progressData, { completedModules: newCompletedModules });
  
  const res = await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: ctx.state.user.id }, 
    data: { progressData: newProgressData }
  }).then(res => true)

  return res
}

const deleteCompletedModulesEntries = async (ctx, args) => {
  if (!ctx.state.user || !ctx.state.user.id) {
    return ctx.response.status = 401
  }

  const progressData = await getProgressData(ctx)
  const { completedModules } = progressData || {}
  const newCompletedModules = (completedModules || []).filter(module => {
    return !args?.moduleData.some(arg => {
      return arg.lessonModule === module.lessonModule
    })
  })
  const newProgressData = Object.assign({}, progressData, { completedModules: newCompletedModules });

  const res = await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: ctx.state.user.id },
    data: { progressData: newProgressData }
  }).then(res => true)

  return res
}

const updateCompletedModulesEntries = async (ctx, args) => {
  if (!ctx.state.user || !ctx.state.user.id) {
    return ctx.response.status = 401
  }

  const progressData = await getProgressData(ctx)
  const { completedModules } = progressData || {}
  const newCompletedModules = [...(completedModules || [])].map(module => {
    const arg = args?.moduleData.find(arg => arg.lessonModule === module.lessonModule)
    return arg || module
  })
  const newProgressData = Object.assign({}, progressData, { completedModules: newCompletedModules });

  const res = await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: ctx.state.user.id },
    data: { progressData: newProgressData }
  }).then(res => true)

  return res
}


const updateMe = async (ctx, args) => {
  console.log('updateMe!!!')
  if (!ctx.state.user || !ctx.state.user.id) {
    return ctx.response.status = 401
  }

  const res = await strapi.db.query('plugin::users-permissions.user').update({
    where: { id: ctx.state.user.id },
    data: args || ctx?.request?.body
  }).then(res => {
    return true
  })

  return res
}

const myData = async ctx => {
  if (!ctx.state.user || !ctx.state.user.id) {
    return ctx.response.status = 401
  }

  const res = await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: ctx.state.user.id }
  })

  // specific fields
  const { id, username, email, confirmed, blocked, role, progressData, provider, createdAt } = res;

  return { id, username, email, confirmed, blocked, role, progressData, provider, createdAt }
}


async function sendForgotPasswordLink({ email, link }) {
  const from = 'learn@biz-backend-demo.com'

  const msg = {
    to: email,
    from, // Change to your verified sender
    subject: 'biz-backend-demo: Reset your password',
    html: `We received a request from you to reset your password. If you didn't request a password reset, please ignore this email. Please <a href="${link}">click here to reset your password</a>`
  }

  const res = await sgMail
    .send(msg)
    .then(() => {
      //console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    });

  return res
}

const emailForgotPassword = async (ctx, args) => {
  const { email } = args;

  const user = await strapi.db.query('plugin::users-permissions.user').findOne({ 
    select: [ 'email' ],
    where: { email }
  })

  console.log('user', user)

  if (!user) {
    return {
      isSuccessful: true, // false "TRUE" in case of spam resets
      status: 200,
      statusText: 'if there is an account with that email, we sent a reset link!'
    }
  }

  if (user.provider !== 'local' && typeof user.provider !== 'undefined') {
    return {
      isSuccessful: false,
      status: 400,
      statusText: `Your login provider: ${user.provider}`
    }
  }
  
  // Replace this with whatever cryptographic algorithm(s) you want to use
  const resetPasswordToken = crypto.randomBytes(64).toString('hex');


  const updatedUser = await strapi.db.query('plugin::users-permissions.user').update({
    where: { email: user.email },
    data: { resetPasswordToken }
  });

  // change these to your prod/noprod urls
  const origin = (process.env.TEST_MODE === 'true') ? 'https://biz-backend-demo-web.onrender.com' : 'https://www.biz-backend-demo.com'
  
  const link = `${origin}/reset-password?code=${resetPasswordToken}`
  let res;

  if (updatedUser) {
    res = await sendForgotPasswordLink({
      email,
      link
    })

    return {
      isSuccessful: true,
      status: 200,
      statusText: 'if there is an account with that email, we sent a reset link!'
    }
  } else {
    return {
      isSuccessful: false,
      status: 500,
      statusText: 'could not update reset password token'
    }
  }
}

module.exports = {
  updateMe,
  myData,
  addCompletedModulesEntries,
  deleteCompletedModulesEntries,
  updateCompletedModulesEntries,
  updateCurrentModule,
  emailForgotPassword
}