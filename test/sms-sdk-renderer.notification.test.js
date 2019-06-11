'use strict';

const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;

const chai = require('chai');
const should = chai.should();
const assert = chai.assert;

const { SmsRenderer } = require('../lib/sms-sdk-renderer');

const myMessageData = {
  title: 'Notificaiton Title',
  content: 'Notificaiton content',
  description: 'Notification description',
  comment: {
    body: 'Notification comments'
  },
  assignee: {
    emailAddress: 'john.smith@email.com',
    displayName: 'John Smith',
  },
  showStatusBar: true,
  type: {
    name: 'message type'
  },
  priority: {
    name: 'message priority'
  },
  status: {
    name: 'message status'
  },
  labels: [
    {
      text: 'label1'
    },
    {
      text: 'label2'
    }
  ]
};

describe('sms-sdk-renderer notification template tests', () => {
  it('should get compiled html from the templates - test messages content', function () {
    const compiledMessage = SmsRenderer.renderInBot(myMessageData, SmsRenderer.smsTypes.NOTIFICATION);
    assert.isTrue(compiledMessage.includes(myMessageData.content));
  });
});
