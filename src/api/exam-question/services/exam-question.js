'use strict';

/**
 * exam-question service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::exam-question.exam-question');
