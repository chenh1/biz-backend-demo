'use strict';

/**
 * master-path service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::master-path.master-path');
