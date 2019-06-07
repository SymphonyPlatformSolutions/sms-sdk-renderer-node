'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../lib/sms-sdk-renderer');

const message = {
  title: 'mock title',
  content: 'mock content',
  description: 'mock description',
  key: 'mock key',
  keyLink: 'http://uefa.com',
  subject: 'mock subject',
  action: 'mock action',
  user: {
    displayName: 'mock displayName',
  },
  comment: {
    body: 'mock comment body'
  },
  assignee: {
    emailAddress: 'mock@email.com',
    displayName: 'mock displayName',
  },
  statusBar: true,
  type: {
    name: 'mock type'
  },
  priority: {
    name: 'mock priority'
  },
  epic: {
    name: 'mock epic',
    link: 'http://uefa.com'
  },
  status: {
    name: 'mock status'
  },
  labels: [
    {
      text: 'mock_label1'
    },
    {
      text: 'mock_label2'
    }
  ]
};

describe('sms-sdk-renderer tests', () => {
  it('should get compiled html from the templates - not wrapped by <messageML/>', function () {
    const compiledSimple = SmsRenderer.renderInBot(message, SmsRenderer.smsTypes.SIMPLE);
    compiledSimple.should.be.a('string');

    assert.isNotTrue(compiledSimple.includes('<messageML>'));
  });

  it('should get compiled html from the templates - wrapped by <messageML/>', function () {
    const compiledSimple = SmsRenderer.renderInApp(message, SmsRenderer.smsTypes.SIMPLE);
    compiledSimple.should.be.a('string');

    assert.isTrue(compiledSimple.includes('<messageML>'));
  });

  it('should get compiled html from the templates - test messages content', function () {
    let compiledMessage = SmsRenderer.renderInBot(message, SmsRenderer.smsTypes.SIMPLE);
    assert.isTrue(compiledMessage.includes(message.title));

    compiledMessage = SmsRenderer.renderInBot(message, SmsRenderer.smsTypes.ALERT);
    assert.isTrue(compiledMessage.includes(message.content));

    compiledMessage = SmsRenderer.renderInBot(message, SmsRenderer.smsTypes.NOTIFICATION);
    assert.isTrue(compiledMessage.includes(message.priority.name));

    compiledMessage = SmsRenderer.renderInBot(message, SmsRenderer.smsTypes.INFORMATION);
    assert.isTrue(compiledMessage.includes(message.description));
  });
});
