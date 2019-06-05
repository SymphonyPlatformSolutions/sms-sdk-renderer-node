# sms-sdk-renderer

SDK renders symphony messages using precompiled Handlebars templates both in bots and in applications.

## User Guide

Now, there are several message templates that you can choose:

| Name         | Description                                   |
| ------------ | --------------------------------------------- |
| SIMPLE       | Renders a message in simple format            |
| ALERT        | Renders a message formatted as an alert       |
| INFORMATION  | Renders a general informaiton messages        |
| NOTIFICATION | Renders a message foramtted as a notification |

### Prerequisites

Please make sure the following tools are installed:
* node.js (v8.11.3)
* npm (5.6.0)

### Install SDK

* Add to your `package.json` file in the `"dependencies"` property, this line:
`"sms-sdk-renderer": "github:SymphonyPlatformSolutions/sms-sdk-renderer.git"`
* If you're developing client application, add this to your `webpack.config.js` file:

```
module: {
  rules: [
    {
      test: /\.hbs$/,
      loader: "handlebars-loader"
    }
  ]
},
resolve:
{
  alias: {
    'handlebars': 'handlebars/dist/handlebars.js'
  }
},
node: {
  fs: 'empty'
}
```

### How to use

* Import the sdk:
```
const { SmsRenderer } = require('sms-sdk-renderer');
```
* Create a message object like that, for the ALERT template:
```
const myMessageData = {
  title: 'Message Title',
  content: 'Message Content'
};
```

#### In the bot

* In the code, compile your message using the command:
```
const compiledMessage = SmsRenderer.renderInBot(myMessageData, SmsRenderer.smsTypes.ALERT);
```
* Send the message with Symphony API SDK:
```
Symphony.sendMessage(message.stream.streamId, compiledMessage, null, Symphony.MESSAGEML_FORMAT);
```

#### In the client application

* In the code, in the `render` function of the `entity` service, compile your message using the command:
```
const compiledMessage = SmsRenderer.renderInApp(myMessageData, SmsRenderer.smsTypes.ALERT);
```
* In the same `render`method, return the message like that:
```
return {
    template: compiledMessage
};
```

### SDK API

Template type names are accessible by `SmsRenderer.smsTypes` constant, like so:
```
const simpleMessageTemplate = SmsRenderer.smsTypes.SIMPLE;
```
Possible values are `SIMPLE, ALERT, INFORMATION, NOTIFICATION`.

To get the compiled template in `MessageML` format, use the functions:

| Syntax                    | Parameters               | Where to use          |
| ------------------------- | ------------------------ | --------------------- |
| SmsRenderer.renderInApp() | messageData, messageType | Extension application |
| SmsRenderer.renderInBot() | messageData, messageType | Bot                   |

The complete list of message data object properties (example can be seen in the [test / sms-sdk-renderer.test.js](https://github.com/vinnie777/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.test.js) file):

| Property              | Used in templates          | Type    | Comment                                            |
| --------------------- | -------------------------- | ------- | -------------------------------------------------- |
| title                 | SIMPLE, ALERT, INFORMATION | string  |                                                    |
| content               | SIMPLE, ALERT, INFORMATION | string  |                                                    |
| user.displayName      | INFORMATION, NOTIFICATION  | string  |                                                    |
| key                   | NOTIFICATION               | string  |                                                    |
| keyLink               | NOTIFICATION               | string  |                                                    |
| subject               | NOTIFICATION               | string  |                                                    |
| action                | NOTIFICATION               | string  |                                                    |
| user.displayName      | NOTIFICATION               | string  |                                                    |
| comment.body          | NOTIFICATION               | string  |                                                    |
| assignee.emailAddress | NOTIFICATION               | string  |                                                    |
| assignee.displayName  | NOTIFICATION               | string  |                                                    |
| statusBar             | NOTIFICATION               | boolean | To show or not the notification status bar         |
| type.name             | NOTIFICATION               | string  |                                                    |
| priority.name         | NOTIFICATION               | string  |                                                    |
| epic.name             | NOTIFICATION               | string  |                                                    |
| epic.link             | NOTIFICATION               | string  |                                                    |
| status.name           | NOTIFICATION               | string  |                                                    |
| labels                | NOTIFICATION               | string  | array of objects with property `text`, type string |

### Knowing Issue

Templates are not rendered as they have to in the client application: not all MessageML tags and styles interpreted correctly by `render` function of the `entity` service (https://developers.symphony.com/extension/docs/entity-advanced-templating).
