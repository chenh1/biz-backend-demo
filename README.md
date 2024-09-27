# biz-backend-demo

## What does this repository do?
This repository serves as a demo/boilerplate for Strapi. Companion to [biz-web-client-demo](https://github.com/chenh1/biz-web-client-demo).

Uses pm2 to reset application on max memory. Configure this in `ecosystem.config.js`.

To test it out, setup a postgres database locally and plug it your credentials into `.env`.


## Features

### Sendgrid Integration
Sendgrid is hooked up to process forgotten password. Get your Sendgrid API key and assign it to `SG_API_KEY` in `.env`. Add more services in `services.js` as needed.

### S3 Middleware
Configure the s3 bucket url in `config/middlewares.js`

### GraphQL
Built in via GraphQL plugin.

## Upcoming
- Migrate to Strapi 5