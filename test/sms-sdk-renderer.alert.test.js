'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../lib/sms-sdk-renderer');

const myMessageData = {
  title: 'Alert Title',
  content: 'This is a danger alert'
};

describe('sms-sdk-renderer alert template tests', () => {
  it('should get compiled html from the templates - not wrapped by <messageML/>', function () {
    const compiledSimple = SmsRenderer.renderBotMessage(myMessageData, SmsRenderer.smsTypes.ALERT);
    compiledSimple.should.be.a('string');

    assert.isNotTrue(compiledSimple.includes('<messageML>'));
  });

  it('should get compiled html from the templates - wrapped by <messageML/>', function () {
    const compiledSimple = SmsRenderer.renderAppMessage(myMessageData, SmsRenderer.smsTypes.ALERT);
    compiledSimple.should.be.a('string');

    assert.isTrue(compiledSimple.includes('<messageML>'));
  });

  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderBotMessage(myMessageData, SmsRenderer.smsTypes.ALERT);
    assert.isTrue(compiledMessage.includes(myMessageData.content));
  });
});
