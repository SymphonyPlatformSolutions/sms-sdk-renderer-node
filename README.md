# sms-sdk-renderer-node

SDK renders symphony messages using precompiled Handlebars templates both in bots and in applications.

## User Guide

Now, there are several message templates that you can choose:

| Name         | Description                                                              |
| ------------- | ------------------------------------------------------------------------|
| SIMPLE        | Renders a message in simple format                                      |
| ALERT         | Renders a message formatted as an alert                                 |
| INFORMATION   | Renders a general information messages                                  |
| NOTIFICATION  | Renders a message formatted as a notification                           |
| TABLE         | Renders a collection of objects in the table format                     |
| LIST          | Renders a list of values                                                |
| BADGE         | Renders a badge, to be used with other elements                         |  
| RFQ_CARD      | Renders a Card, Base component for RFQ's                                |
| RFQ_VALUE     | Renders a Value panel, base component for RFQ's                         |
| RFQ_QUOTE     | Renders a RFQ Quote, main component for RFQ's                           |
| RFQ_START_ACK | Renders a RFQ Quote with the *rfq_acknowledged* or *rfq_initiated* state|
| RFQ_PRICED    | Renders a RFQ Quote with the *rfq_priced* state                         |
| RFQ_AGREED_PAY| Renders a RFQ Quote with the *rfq_agreed_pay* state                     |
| RFQ_CONFIRMED | Renders a RFQ Quote with *rfq_confirmed* state                          |
| RFQ_PASSED    | Renders a RFQ Quote with *rfq_passed* state, it also handles timeout    |

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
const compiledMessage = SmsRenderer.renderBotMessage(myMessageData, SmsRenderer.smsTypes.ALERT);
```
* Send the message with Symphony API SDK:
```
Symphony.sendMessage(message.stream.streamId, compiledMessage, null, Symphony.MESSAGEML_FORMAT);
```

#### In the client application

* In the code, in the `render` function of the `entity` service, compile your message using the command:
```
const compiledMessage = SmsRenderer.renderAppMessage(myMessageData, SmsRenderer.smsTypes.ALERT);
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
| SmsRenderer.renderAppMessage() | messageData, messageType | Extension application |
| SmsRenderer.renderBotMessage() | messageData, messageType | Bot                   |

The complete list of message data object properties can be seen in the unit test examples.

## Common Elements
###SIMPLE
```
{
  title: 'Simple Title',
  content: 'This is a simple message'
};
```
###ALERT
```
{
  title: 'Alert Title',
  content: 'This is a danger alert'
};
```
###INFORMATION
```
{
  title: 'Informaiton Title',
  content: 'This is a information message',
  description: 'Information message description'
};
```
###NOTIFICATION
```
{
  title: 'My Title',

  // OPTIONAL - used to render alert syle notification
  alert: true,

  // Content can be a smiple text
  content: 'My content',
  // or an object that is rendered in </card>
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
###LIST
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
    }
  ]
};
```
###TABLE
```
[
  { "Manufacturer": "Apple", "Phone": "iPhone", "Operating System": "iOS" },
  { "Manufacturer": "Samsung", "Phone": "Galaxy", "Operating System": "Android" },
  { "Manufacturer": "Google", "Phone": "Google Pixel 3", "Operating System": "Android" }
];
```

## Financial Elements
### RFQ Initiated
```javascript
{
  dealerName: 'Hydra',
  state: {
    state: 'rfq_initiated',
  },
  action: 'sms-sparc/start-rfq',
  rfqId: 'f152f549-a2d9-4c92-9a60-f7dedc9f823c',
  product: {
    product: 'IRS',
    currency: 'USD',
    index: '3M-LIBOR',
    clearingHouse: 'EUREX',
    start: {
      date: 'spot',
      type: 'spot',
    },
    tenor: {
      date: '1y',
      type: 'single',
      value: {
        firstValue: 1,
      },
    },
    sizeType: 'DV01',
    size: {
      currency: 'USD',
      value: '3',
      sizeMultiplier: 'k',
      size: 'USD3k',
    },
    payDirection: 'PAY',
    rate: 'Rate',
  },
  colorIndex: 6,
  shortCode: 'w7',
  initiatorUserId: 351775001411610,
  initiatorCompanyName: 'Stark Industries',
  startTime: 1568975971,
  shorthandMessage: 'RFQ sent.',
}
```

###RFQ Aknowledged
```javascript
{
    dealerName: 'Hydra',
    state: {
        messageId: '3x5S4lN27iH77E9nJ-k9kH___pKxvooAbQ',
        timestamp: 1568975975935,
        state: 'rfq_acknowledged',
        userId: 351775001411612,
    },
    action: 'sms-sparc/dealer-ack',
    rfqId: 'f152f549-a2d9-4c92-9a60-f7dedc9f823c',
    product: {
        product: 'IRS',
        currency: 'USD',
        index: '3M-LIBOR',
        clearingHouse: 'EUREX',
        start: { date: 'spot', type: 'spot' },
        tenor: {
          date: '1y',
          type: 'single',
          value: { firstValue: 1 },
        },
        sizeType: 'DV01',
        size: {
          currency: 'USD',
          value: '3',
          sizeMultiplier: 'k',
          size: 'USD3k',
        },
        payDirection: 'PAY',
        rate: 'Rate',
    },
    colorIndex: 6,
    shortCode: 'w7',
    initiatorUserId: 351775001411610,
    initiatorCompanyName: 'Stark Industries',
    startTime: 1568975971,
    shorthandMessage: 'Hydra acknowledged. Waiting for price.',
}
```
###RFQ Priced
```javascript
{
  dealerName: 'Hydra',
  state: {
    messageId: 'L_SVjfZGkjVbUp06rqVH_n___pKxvnNFbQ',
    timestamp: 1568975981754,
    state: 'rfq_priced',
    userId: 351775001411612,
    pay: { price: '8', active: true },
    receive: { price: '5', active: false },
  },
  action: 'sms-sparc/dealer-price',
  rfqId: 'f152f549-a2d9-4c92-9a60-f7dedc9f823c',
  product: {
    product: 'IRS',
    currency: 'USD',
    index: '3M-LIBOR',
    clearingHouse: 'EUREX',
    start: { date: 'spot', type: 'spot' },
    tenor: {
      date: '1y',
      type: 'single',
      value: { firstValue: 1 },
    },
    sizeType: 'DV01',
    size: {
      currency: 'USD',
      value: '3',
      sizeMultiplier: 'k',
      size: 'USD3k',
    },
    payDirection: 'PAY',
    rate: 'Rate',
  },
  colorIndex: 6,
  shortCode: 'w7',
  initiatorUserId: 351775001411610,
  initiatorCompanyName: 'Stark Industries',
  startTime: 1568975971,
  shorthandMessage: 'Hydra Price received.',
}
``` 
###RFQ Agreed
```javascript
{
  dealerName: 'Hydra',
  state: {
    messageId: 'F-nA1oeJwZGO5Psn1v95U3___pKxvmbVbQ',
    timestamp: 1568975984938,
    state: 'rfq_agreed_pay',
    userId: 351775001411610,
    pay: { price: '8' },
  },
  action: 'sms-sparc/buyer-agree-pay',
  rfqId: 'f152f549-a2d9-4c92-9a60-f7dedc9f823c',
  product: {
    product: 'IRS',
    currency: 'USD',
    index: '3M-LIBOR',
    clearingHouse: 'EUREX',
    start: { date: 'spot', type: 'spot' },
    tenor: {
      date: '1y',
      type: 'single',
      value: { firstValue: 1 },
    },
    sizeType: 'DV01',
    size: {
      currency: 'USD',
      value: '3',
      sizeMultiplier: 'k',
      size: 'USD3k',
    },
    payDirection: 'PAY',
    rate: 'Rate',
  },
  colorIndex: 6,
  shortCode: 'w7',
  initiatorUserId: 351775001411610,
  initiatorCompanyName: 'Stark Industries',
  startTime: 1568975971,
  shorthandMessage: 'Stark Industries agrees to pay 8.',
}
```
###RFQ Confirmed
```javascript
{
    dealerName: 'Hydra',
    state: {
        messageId: 'XsouTQ6gEoJ0vLMonkR1-X___pKxvkFZbQ',
        timestamp: 1568975994534,
        state: 'rfq_confirmed',
        userId: 351775001411612,
        userName: 'Clark Kent',
    },
    action: 'sms-sparc/dealer-done',
    rfqId: 'f152f549-a2d9-4c92-9a60-f7dedc9f823c',
    product: {
    product: 'IRS',
    currency: 'USD',
    index: '3M-LIBOR',
    clearingHouse: 'EUREX',
    start: { date: 'spot', type: 'spot' },
    tenor: {
      date: '1y',
      type: 'single',
      value: { firstValue: 1 },
    },
    sizeType: 'DV01',
    size: {
      currency: 'USD',
      value: '3',
      sizeMultiplier: 'k',
      size: 'USD3k',
    },
    payDirection: 'PAY',
    rate: 'Rate',
    },
    colorIndex: 6,
    shortCode: 'w7',
    initiatorUserId: 351775001411610,
    initiatorCompanyName: 'Stark Industries',
    startTime: 1568975971,
    shorthandMessage: 'Done @ 8. Hydra agrees to receive, Stark Industries agrees to pay.',
}
````
###RFQ Timeout
```javascript
{
  state: { state: 'rfq_passed' },
  action: 'sms-sparc/dealer-timeout',
  rfqId: '58e0704a-ca59-4c01-a2e2-c3212622458a',
  product: {
    product: 'OTC Option',
    rawText: 'Buy SPX US 07/31/19 P2425 European CASH 1',
  },
  colorIndex: 7,
  shortCode: 'y9',
  initiatorUserId: 351775001411610,
  initiatorCompanyName: 'Stark Industries',
  startTime: 1568984171,
  shorthandMessage: 'RFQ has ended.',
}
````
###RFQ Passed
```javascript
{
  state: {
    messageId: '5Mtui0pnyBSj1WWResDvFH___pKxNeeEbQ',
    timestamp: 1568984930427,
    state: 'rfq_passed',
    userId: 351775001411612,
  },
  action: 'sms-sparc/dealer-pass',
  rfqId: '79191c6d-5b99-402b-ba4b-5d92ebc7f8aa',
  product: {
    product: 'OTC Option',
    rawText: 'Buy SPX US 07/31/19 P2425 European CASH 1',
  },
  colorIndex: 8,
  shortCode: 'e2',
  initiatorUserId: 351775001411610,
  initiatorCompanyName: 'Stark Industries',
  startTime: 1568984917,
  shorthandMessage: 'RFQ has ended.',
}
```
