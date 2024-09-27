'use strict';

const { 
  updateMe, 
  myData, 
  addCompletedModulesEntries, 
  deleteCompletedModulesEntries, 
  updateCompletedModulesEntries,
  updateCurrentModule,
  emailForgotPassword
} = require('./extensions/users-permissions/services')

module.exports = {
  register({ strapi }) {


    // graphql
    const extensionService = strapi.service("plugin::graphql.extension");
    extensionService.use(({ strapi }) => ({
      typeDefs: `
        type Query {
          myData: MyData
        }

        type MyData {
          progressData: JSON
        }

        type EmailRes {
          isSuccessful: Boolean
          status: Int
          statusText: String
        }

        input ModuleData {
          lessonModule: Float
          examScore: Float
        }

        type Mutation {
          emailForgotPassword(email: String!): EmailRes
          updateMe(progressData: JSON): Boolean
          addCompletedModulesEntries(moduleData: [ ModuleData ]): Boolean
          deleteCompletedModulesEntries(moduleData: [ ModuleData ]): Boolean
          updateCompletedModulesEntries(moduleData: [ ModuleData ]): Boolean
          updateCurrentModule(moduleData: ModuleData, completedModuleData: ModuleData): Boolean
        }
      `,

      resolvers: {
        Query: {
          myData: {
            resolve: async (parent, args, context) => {
              const data = await myData(context);
              return data;
            },
          },
        },
        Mutation: {
          emailForgotPassword: {
            resolve: async (parent, args, context) => {
              console.log('user', args)
              const data = await emailForgotPassword(context, args);
              return data;
            } 
          },
          updateMe: {
            resolve: async (parent, args, context) => {
              const data = await updateMe(context, args);
              return data;
            } 
          },
          addCompletedModulesEntries: {
            resolve: async (parent, args, context) => {
              const data = await addCompletedModulesEntries(context, args);
              return data;
            } 
          },
          deleteCompletedModulesEntries: {
            resolve: async (parent, args, context) => {
              const data = await deleteCompletedModulesEntries(context, args);
              return data;
            }
          },
          updateCompletedModulesEntries: {
            resolve: async (parent, args, context) => {
              const data = await updateCompletedModulesEntries(context, args);
              return data;
            }
          },
          updateCurrentModule: {
            resolve: async (parent, args, context) => {
              const data = await updateCurrentModule(context, args);
              return data;
            }
          },
        }
      },

      resolversConfig: {
        "Query.myData": {
          auth: false,
        },
        "Mutation.updateMe": {
          auth: false,
        },
        "Mutation.emailForgotPassword": {
          auth: false,
        }
      },
    }));
  }
};
