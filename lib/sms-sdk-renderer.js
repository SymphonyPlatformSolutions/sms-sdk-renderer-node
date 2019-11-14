const handlebars = require('handlebars');

/**
 * Helper function to append strings
 */
const appendHelper = function(str, suffix) {
  if (typeof str === 'string' && typeof suffix === 'string') {
    return str + suffix;
  }
  return str;
};

const rfqColorHelper = function (code) {
    switch (code) {
        case 0:
            return '#EC407A';
        break;
        case 1:
            return '#880E4F';
        break;
        case 2:
            return '#AB47BC';
        break;
        case 3:
            return '#4A148C';
        break;
        case 4:
            return '#42A5F5';
        break;
        case 5:
            return '#006064';
        break;
        case 6:
            return '#00BFA5';
        break;
        case 7:
            return '#E17900';
        break;
        case 8:
            return '#8C513B';
        break;
        default:
            return '#00BFA5';
        break;
    }
};

const quoteMessageHelper = function (message) {
    if (message.state.state === 'rfq_initiated') {
        return '<p>Waiting for dealer to acknowledge</p>';
    } else {
        return `<p>${message.shorthandMessage}</p>`;
    }
};

const switchHelper = function(value, options) {
    this._switch_value_ = value;
    var html = options.fn(this); // Process the body of the switch block
    delete this._switch_value_;
    return html;
};

const caseHelper = function(...args) {
    var options    = args.pop();
    var caseValues = args;

    if (caseValues.indexOf(this._switch_value_) === -1) {
        return '';
    } else {
        return options.fn(this);
    }
};


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
    BADGE: 'badge',
    RFQ_CARD: 'rfq-card',
    RFQ_QUOTE: 'rfq-quote',
    RFQ_START_ACK: 'rfq-start-ack',
    RFQ_PRICED: 'rfq-priced',
    RFQ_AGREED_PAY: 'rfq-agreed-pay',
    RFQ_CONFIRMED: 'rfq-confirmed',
    RFQ_PASSED: 'rfq-passed',
    RFQ_VALUE: 'rfq-value',
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
    compiledTemplates[smsTypes.RFQ_CARD] = require('../templates/rfq/rfq-card.hbs');
    compiledTemplates[smsTypes.RFQ_QUOTE] = require('../templates/rfq/rfq-quote.hbs');
    compiledTemplates[smsTypes.RFQ_START_ACK] = require('../templates/rfq/rfq-start-ack.hbs');
    compiledTemplates[smsTypes.RFQ_PRICED] = require('../templates/rfq/rfq-priced.hbs');
    compiledTemplates[smsTypes.RFQ_AGREED_PAY] = require('../templates/rfq/rfq-agreed-pay.hbs');
    compiledTemplates[smsTypes.RFQ_CONFIRMED] = require('../templates/rfq/rfq-confirmed.hbs');
    compiledTemplates[smsTypes.RFQ_PASSED] = require('../templates/rfq/rfq-passed.hbs');
    compiledTemplates[smsTypes.RFQ_VALUE] = require('../templates/rfq/rfq-value.hbs');

    compiledTemplates[smsTypes.BADGE] = require('../templates/badge.hbs');


    Object.keys(compiledTemplates).forEach((key) => {
        if (compiledTemplates[key].default) {
            handlebars.registerPartial(key, compiledTemplates[key].default);
            compiledTemplates[key] = handlebars.compile(compiledTemplates[key].default);
        }
    });

    handlebars.registerHelper('append', appendHelper);
    handlebars.registerHelper('switch', switchHelper);
    handlebars.registerHelper('case', caseHelper);

    handlebars.registerHelper('rfqColor', rfqColorHelper);
    handlebars.registerHelper('rfqQuoteMessage', quoteMessageHelper);
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
