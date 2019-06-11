# sms-sdk-renderer

SDK renders symphony messages using precompiled Handlebars templates both in bots and in applications.

## User Guide

Now, there are several message templates that you can choose:

| Name         | Description                                         |
| ------------ | --------------------------------------------------- |
| SIMPLE       | Renders a message in simple format                  |
| ALERT        | Renders a message formatted as an alert             |
| INFORMATION  | Renders a general informaiton messages              |
| NOTIFICATION | Renders a message formatted as a notification       |
| TABLE        | Renders a collection of objects in the table format |
| LIST         | Renders a list of values                            |

### Prerequisites

Please make sure the following tools are installed:
* node.js (v8.11.3)
* npm (5.6.0)

### Install SDK

* Add to your `package.json` file in the `"dependencies"` property, this line:
`"sms-sdk-renderer": "github:SymphonyPlatformSolutions/sms-sdk-renderer"`
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
Possible values are `SIMPLE, ALERT, INFORMATION, NOTIFICATION, TABLE, LIST`.

To get the compiled template in `MessageML` format, use the functions:

| Syntax                    | Parameters               | Where to use          |
| ------------------------- | ------------------------ | --------------------- |
| SmsRenderer.renderInApp() | messageData, messageType | Extension application |
| SmsRenderer.renderInBot() | messageData, messageType | Bot                   |

The complete list of message data object properties can be seen in the test examples:

* [SIMPLE message example](https://github.com/SymphonyPlatformSolutions/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.simple.test.js)
* [ALERT message example](https://github.com/SymphonyPlatformSolutions/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.alert.test.js)
* [INFORMATION message example](https://github.com/SymphonyPlatformSolutions/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.information.test.js)
* [NOTIFICATION message example](https://github.com/SymphonyPlatformSolutions/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.notification.test.js)
* [TABLE message example](https://github.com/SymphonyPlatformSolutions/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.table.test.js)
* [LIST message example](https://github.com/SymphonyPlatformSolutions/sms-sdk-renderer/blob/master/test/sms-sdk-renderer.list.test.js)
