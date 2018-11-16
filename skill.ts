import express = require("express")
import _ = require("lodash")
import bodyParser = require("body-parser")
import { AddressInfo } from "net"
import {
  ErrorHandler,
  HandlerInput,
  RequestHandler,
  SkillBuilders,
} from "ask-sdk-core"
import { Response, SessionEndedRequest } from "ask-sdk-model"

const funFactsAboutFormula1 = [
  "Barrichelo dejo pasar a Schumacher en Austria 2001",
  "Barrichelo dejo ganar a Schumacher en Austria 2002",
]

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest"
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = "Bienvenido a formulauno, preguntame sobre alguna curiosidad de la formula 1!"

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse()
  },
}

const DatoCuriosoHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "datoCurioso"
    )
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText =
      funFactsAboutFormula1[_.random(0, funFactsAboutFormula1.length)]
    //  "Este es un dato curioso"
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse()
  },
}

const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    )
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = `Me puedes decir "Dime un dato curioso"!`

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse()
  },
}

const CancelAndStopIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    )
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText = "Espero verte de nuevo!"

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse()
  },
}

const SessionEndedRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest"
  },
  handle(handlerInput: HandlerInput): Response {
    console.log(
      `Session ended with reason: ${
        (handlerInput.requestEnvelope.request as SessionEndedRequest).reason
      }`,
    )

    return handlerInput.responseBuilder.getResponse()
  },
}

const ErrorHandler: ErrorHandler = {
  canHandle(handlerInput: HandlerInput, error: Error): boolean {
    return true
  },
  handle(handlerInput: HandlerInput, error: Error): Response {
    console.log(`Error handled: ${error.message}`)
    const speechText =
      "Por favor, no te puedo entender. Repita la frase de nuevo."
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse()
  },
}
const skillBuilder = SkillBuilders.custom()

const handler = skillBuilder
  .addRequestHandlers(
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    HelpIntentHandler,
    LaunchRequestHandler,
    DatoCuriosoHandler,
  )
  .create()
const expressApp = express()

expressApp.use(bodyParser.json(), async (req, res, next) => {
  try {
    console.log(req.url)
    console.log(req.body)

    const response = await handler.invoke(req.body)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

const server = expressApp.listen(6500, () => {
  const address = server.address() as AddressInfo
  console.log(`${address.address}${address.port}`)
})
