module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            //'dl.airtable.com',
            'biz-backend-demo-static.s3.us-east-2.amazonaws.com', // change this to your s3 bucket before attempting to use the media library upload
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            //'dl.airtable.com',
            'biz-backend-demo-static.s3.us-east-2.amazonaws.com', // change this to your s3 bucket before attempting to use the media library upload
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
