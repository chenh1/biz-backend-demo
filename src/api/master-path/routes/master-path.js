'use strict';

/**
 * master-path router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::master-path.master-path');
