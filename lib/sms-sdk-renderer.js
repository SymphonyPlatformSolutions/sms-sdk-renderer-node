const handlebars = require('handlebars');

/**
 * This is a key value map for supported messages
 * Add an sms type to enum when adding new template,
 * to be used by client as a parameter in render() method
 */
const smsTypes = {
    SIMPLE: 'simple',
    ALERT: 'alert',
    NOTIFICATION: 'notification',
    INFORMATION: 'information',
    TABLE: 'table',
    LIST: 'list',
    RFQ_CARD: 'rfq_quote',
    BADGE: 'badge',
};

/***
 * KeyValue Map for all available templates;
 */
const compiledTemplates = {};

/***
 * Method that compiles the templates if running on a app
 * or simply map these compiled templates for bots.
 */
const compileTemplates = function () {
    compiledTemplates[smsTypes.SIMPLE] = require('../templates/simple.hbs');
    compiledTemplates[smsTypes.ALERT] = require('../templates/alert.hbs');
    compiledTemplates[smsTypes.NOTIFICATION] = require('../templates/notification.hbs');
    compiledTemplates[smsTypes.INFORMATION] = require('../templates/information.hbs');
    compiledTemplates[smsTypes.TABLE] = require('../templates/table.hbs');
    compiledTemplates[smsTypes.LIST] = require('../templates/list.hbs');
    compiledTemplates[smsTypes.RFQ_CARD] = require('../templates/rfq-card.hbs');
    compiledTemplates[smsTypes.BADGE] = require('../templates/badge.hbs');

    Object.keys(compiledTemplates).forEach((key) => {
        handlebars.registerPartial(key, compiledTemplates[key].default);
        compiledTemplates[key] = handlebars.compile(compiledTemplates[key].default);
    });
};

/***
 * Allow the custom/dynamic register of project specific partials
 * and templates, once registered these will be automatically available
 * for rendering. Note that Partials and Templates Keys must be unique.
 * @param partials {Object}
 * @param templates {Object}
 */
const register = function (partials = null, templates = null) {
    if (partials) {
        Object.keys(partials).forEach((key) => {
            handlebars.registerPartial(key, partials[key]);
        })
    }
    if (templates) {
        Object.keys(templates).forEach((key) => {
            compiledTemplates[key] = handlebars.compile(templates[key]);
        })
    }
};

/***
 *  Returns the compiled message wrapped inside a <messageML> tag
 * @param compiledMessage
 * @returns {string}
 */
const wrapByMessageMLTags = function (compiledMessage) {
    return `<messageML>${compiledMessage}</messageML>`;
};

/***
 * Render method, responsible for rendering messages
 * for both bots and apps
 * @param message {Object} Handlebars context
 * @param smsType {Enum}
 */
const render = function (message, smsType) {
    if (!compiledTemplates[smsType]) {
        compileTemplates();
    }

    let context = {
        message: message
    };
    return compiledTemplates[smsType](context);
};

/***
 * Renders a message based on the provided type
 * @param message {Object} Handlebars context
 * @param smsType {Enum}
 */
const renderBotMessage = function (message, smsType) {
    return render(message, smsType);
};

/***
 * Renders a message based on the provided type
 * @param message Object Handlebars context
 * @param smsType Enum
 */
const renderAppMessage = function (message, smsType) {
    let compiledMessage = render(message, smsType);

    return wrapByMessageMLTags(compiledMessage);
};

/***
 * Compiles the default message templates in the first import
 */
compileTemplates();

module.exports.SmsRenderer = {
    smsTypes: smsTypes,
    renderBotMessage: renderBotMessage,
    renderAppMessage: renderAppMessage,
    register,
};
