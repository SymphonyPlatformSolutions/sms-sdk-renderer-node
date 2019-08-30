# sms-sdk-renderer-node

SDK renders symphony messages using precompiled Handlebars templates both in bots and in applications.

## User Guide

Now, there are several message templates that you can choose:

| Name         | Description                                         |
| ------------ | --------------------------------------------------- |
| SIMPLE       | Renders a message in simple format                  |
| ALERT        | Renders a message formatted as an alert             |
| INFORMATION  | Renders a general information messages              |
| NOTIFICATION | Renders a message formatted as a notification       |
| TABLE        | Renders a collection of objects in the table format |
| LIST         | Renders a list of values                            |

### Prerequisites

Please make sure the following tools are installed:
* node.js (v8.11.3)
* npm (5.6.0)

### Install SDK

* Add to your `package.json` file in the `"dependencies"` property, this line:
`"sms-sdk-renderer-node": "github:SymphonyPlatformSolutions/sms-sdk-renderer-node"`
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
const { SmsRenderer } = require('sms-sdk-renderer-node');
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

The complete list of message data object properties can be seen in the unit test examples.

### Message Context Examples

SIMPLE
```
{
  title: 'Simple Title',
  content: 'This is a simple message'
};
```
ALERT
```
{
  title: 'Alert Title',
  content: 'This is a danger alert'
};
```
INFORMATION
```
{
  title: 'Informaiton Title',
  content: 'This is a information message',
  description: 'Information message description'
};
```
NOTIFICATION
```
{
  title: 'My Title',

  // OPTIONAL - used to render alert syle notification
  alert: true,

  // Content can be a smiple text or an object
  // Object is rendered in </card>
  content: 'My content',
  content: {
    header: 'Content header',
    body: 'Content body'
  },

  description: 'My description',
  comment: {
    body: 'My comments'
  },
  assignee: {
    displayName: 'John Smith'
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
```
LIST
```
{
  title: 'Phones List',

  // Content can be a list of strings
  content: [
    "iPhone", "Samsung Galaxy", "Google Pixel 3"
  ]
  // or a list of objects, header is rendered in bold
  content: [
    {
        header: "iPhone",
        body: " is an Apple device"
  ]
};
```
TABLE
```
[
  { "Manufacturer": "Apple", "Phone": "iPhone", "Operating System": "iOS" },
  { "Manufacturer": "Samsung", "Phone": "Galaxy", "Operating System": "Android" },
  { "Manufacturer": "Google", "Phone": "Google Pixel 3", "Operating System": "Android" }
];
```
