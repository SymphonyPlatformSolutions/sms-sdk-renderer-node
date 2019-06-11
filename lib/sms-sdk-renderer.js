'use strict';

const fs = require('fs');
const path = require('path');
const resolve = require('path').resolve;

const handlebars = require('handlebars');

/**
 * Add an sms type to enum when adding new template,
 * to be used by client as a parameter in render() method
 */
const smsTypes = {
    SIMPLE: 'simple',
    ALERT: 'alert',
    NOTIFICATION: 'notification',
    INFORMATION: 'information',
    TABLE: 'table',
    LIST: 'list'
};

const compiledTemplates = {};

const compileTemplates = function () {
    // Avoid using node.js fs lib because webpack does not support it for in-browser usage.
    // All requires must be statically analyzable. That means we cannot use variables
    // in require to build file names dynamically.
    compiledTemplates[smsTypes.SIMPLE] = require('../templates/simple.hbs');
    compiledTemplates[smsTypes.ALERT] = require('../templates/alert.hbs');
    compiledTemplates[smsTypes.NOTIFICATION] = require('../templates/notification.hbs');
    compiledTemplates[smsTypes.INFORMATION] = require('../templates/information.hbs');
    compiledTemplates[smsTypes.TABLE] = require('../templates/table.hbs');
    compiledTemplates[smsTypes.LIST] = require('../templates/list.hbs');
};

compileTemplates(); // pre-compile templates when module is first reqiured

// Not used now, because webpack does not support fs for in-browser usage
const readTemplatesFiles = function () {
    const views = resolve(__dirname, '../templates/');

    fs.readdirSync(views).forEach((fileName) => {
        let extName = path.extname(fileName);

        if (extName === '.hbs' || extName === '.handlebars') {
            const filePath = resolve(views, fileName);
            const source = fs.readFileSync(filePath, 'utf8');
            const template = handlebars.compile(source, { strict: true });

            const baseName = path.basename(fileName, extName);
            compiledTemplates[baseName] = template;
        }
    });
};

const wrapByMessageMLTags = function (compiledMessage) {
    return '<messageML>' + compiledMessage + '</messageML>';
};

const render = function (message, smsType) {
    if (!compiledTemplates[smsType]) {
        compileTemplates();
    }

    let context = {
        message: message
    };
    return compiledTemplates[smsType](context);
};

const renderInBot = function (message, smsType) {
    return render(message, smsType);
};

const renderInApp = function (message, smsType) {
    let compiledMessage = render(message, smsType);

    return wrapByMessageMLTags(compiledMessage);
};

module.exports.SmsRenderer = {
    smsTypes: smsTypes,
    renderInBot: renderInBot,
    renderInApp: renderInApp
};
