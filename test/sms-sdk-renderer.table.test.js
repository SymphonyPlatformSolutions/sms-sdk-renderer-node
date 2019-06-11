'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../lib/sms-sdk-renderer');

var myMessageData = [
  { "Manufacturer": "Apple", "Phone": "iPhone", "Operating System": "iOS" },
  { "Manufacturer": "Samsung", "Phone": "Galaxy", "Operating System": "Android" },
  { "Manufacturer": "Nokia", "Phone": "Lumia", "Operating System": "Windows" }
];

describe('sms-sdk-renderer table template tests', () => {
  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderInBot(myMessageData, SmsRenderer.smsTypes.TABLE);
    assert.isTrue(compiledMessage.includes(myMessageData[0].Manufacturer));
  });
});
