'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../src/lib/sms-sdk-renderer');

var myMessageData = [
  { "Manufacturer": "Apple", "Phone": "iPhone", "Operating System": "iOS" },
  { "Manufacturer": "Samsung", "Phone": "Galaxy", "Operating System": "Android" },
  { "Manufacturer": "Google", "Phone": "Google Pixel 3", "Operating System": "Android" }
];

describe('sms-sdk-renderer table template tests', () => {
  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderBotMessage(myMessageData, SmsRenderer.smsTypes.TABLE);
  });
});
