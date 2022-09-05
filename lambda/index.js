const Alexa = require('ask-sdk-core');
const axios = require("axios")
let APL_simple = require('./documents/APL_simple.json');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Bitcoin tracker, I can provide the price of bitcoin or the fear and greed index. Which would you like?';

if (
  Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
    'Alexa.Presentation.APL'
  ]
) {
  handlerInput.responseBuilder.addDirective({
    type: 'Alexa.Presentation.APL.RenderDocument',
    document: APL_simple,
    datasources: {
      myData: {
        Title: 'Bitcoin tracker"',
        Subtitle: "Say 'price' or 'fear and greed index'",
      },
    },
  });
}

return handlerInput.responseBuilder
    .speak(speakOutput)
    .reprompt(speakOutput)
    .getResponse();
    }
};


const PriceHandler = {
    
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'price';
    },
async handle(handlerInput) {
   let speakOutput = null;

    try {
        let response = await axios.get(
          "https://crypto-analytics2.herokuapp.com/realtime/price/btc"
        );
         let price = response.data.toString();
         price = Number(price).toLocaleString();
        price = price.substring(0, price.indexOf("."));
        speakOutput = "The current price of bitcoin is " + price + " US dollars";
    }catch(erorr){
        speakOutput = "There was an error getting bitcoin's price from the server. Please try again!";
    }

  if (
    Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
      'Alexa.Presentation.APL'
    ]
  ) {
    handlerInput.responseBuilder.addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      document: APL_simple,
      datasources: {
        myData: {
          Title: speakOutput,
        },
      },
    });
  }


  return handlerInput.responseBuilder
    .speak(speakOutput)
    .getResponse();
}
}


const FngHandler = {
    
     canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'fearAndGreedIndex';
    },
async handle(handlerInput) {
  let speakOutput = null;
  let fngVal = null;
  let fngClass = null;

    try {
        let response = await axios.get(
          "https://crypto-analytics2.herokuapp.com/realtime/fng"
        );
         let fng = response.data;
        let fngValue = fng.value;
        let fngClassification = fng.value_classification;
        speakOutput = `Bitcoin fear and greed index is ${fngValue} which corresponds to ${fngClassification}`;
        fngVal = fngValue;
        fngClass = fngClassification;
    }catch(erorr){
        speakOutput = "There was an error retrieving the information from the server. Please try again!";
    }
        

  var APL_simple = require('./documents/APL_simple.json');

  if (
    Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
      'Alexa.Presentation.APL'
    ]
  ) {
    handlerInput.responseBuilder.addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      document: APL_simple,
      datasources: {
        myData: {
            Title: fngClass,
          Subtitle: `${fngVal}/100`,
          
        },
      },
    });
  }
  return handlerInput.responseBuilder
    .speak(speakOutput)
    .getResponse();
}
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say "What is bitcoin\'s price today or give me the crypto fear and greed index! Which would you like?';
        if (
  Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
    'Alexa.Presentation.APL'
  ]
) {
  handlerInput.responseBuilder.addDirective({
    type: 'Alexa.Presentation.APL.RenderDocument',
    document: APL_simple,
    datasources: {
      myData: {
        Title: 'Bitcoin tracker"',
        Subtitle: "Say 'price' or 'fear and greed index'",
      },
    },
  });
}

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. You can ask me about bitcoin\'s price or crypto fear and greed index.';
        
        if (
  Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)[
    'Alexa.Presentation.APL'
  ]
) {
  handlerInput.responseBuilder.addDirective({
    type: 'Alexa.Presentation.APL.RenderDocument',
    document: APL_simple,
    datasources: {
      myData: {
        Title: 'Bitcoin tracker"',
        Subtitle: "Say 'price' or 'fear and greed index'",
      },
    },
  });
}
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse(); 
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        PriceHandler,
        FngHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();