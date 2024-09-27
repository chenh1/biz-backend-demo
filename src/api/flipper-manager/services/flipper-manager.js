'use strict';

/**
 * flipper-manager service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::flipper-manager.flipper-manager');
