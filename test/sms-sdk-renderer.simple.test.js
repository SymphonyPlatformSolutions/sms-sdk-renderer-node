'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../lib/sms-sdk-renderer');

const myMessageData = {
  title: 'Simple Title',
  content: 'This is a simple message'
};

describe('sms-sdk-renderer simple template tests', () => {
  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderBotMessage(myMessageData, SmsRenderer.smsTypes.SIMPLE);
    assert.isTrue(compiledMessage.includes(myMessageData.content));
  });
});
