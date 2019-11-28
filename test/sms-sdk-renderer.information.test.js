'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../src/lib/sms-sdk-renderer');

const myMessageData = {
  title: 'Informaiton Title',
  content: 'This is a information message',
  description: 'Information message description'
};

describe('sms-sdk-renderer information template tests', () => {
  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderBotMessage(myMessageData, SmsRenderer.smsTypes.INFORMATION);
    assert.isTrue(compiledMessage.includes(myMessageData.content));
  });
});
