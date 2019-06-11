'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../lib/sms-sdk-renderer');

const myMessageData = {
  title: 'Phones List',
  content: [
    "iPhone", "Samsung Galaxy", "Nokia PureView"
  ]
};

describe('sms-sdk-renderer list template tests', () => {
  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderInBot(myMessageData, SmsRenderer.smsTypes.LIST);
    assert.isTrue(compiledMessage.includes(myMessageData[0].Manufacturer));
  });
});
