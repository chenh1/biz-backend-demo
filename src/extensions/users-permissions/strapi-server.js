const { updateMe, emailForgotPassword, myData } = require('./services')

module.exports = (plugin) => {
  plugin.controllers.user.updateMe = async (ctx) => {
    return updateMe(ctx)
  }

  plugin.controllers.user.myData = async (ctx) => {
    return myData(ctx)
  }

  plugin.controllers.user.emailForgotPassword = async(ctx, args) => {
    return emailForgotPassword(ctx, args)
  }

  plugin.routes['content-api'].routes.push({
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateMe'
  });

  plugin.routes['content-api'].routes.push({
    method: 'PUT',
    path: '/users/emailForgotPassword',
    handler: 'user.emailForgotPassword'
  });

  plugin.routes['content-api'].routes.push({
    method: 'GET',
    path: '/users/myData',
    handler: 'user.myData'
  });

  return plugin;
}