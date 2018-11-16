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

const { PORT = "6500" } = process.env

const funFactsAboutFormula1 = [
  "El coste de un formula 1 es de 6 a 8 millones de euros",
  "Un coche posee aproximadamente 80000 componentes",
  "El peso de un formula 1 es de 702kg",
  "Barrichelo dejo pasar a Schumacher en Austria 2001",
  "Barrichelo dejo ganar a Schumacher en Austria 2002",
  `Las carreras de automóviles de Fórmula 1 tienen sus raíces en el Grand Prix Motor Racing de Europa de las décadas de 1920 y 1930. La "fórmula" en el nombre se refiere a un conjunto de reglas que todos los participantes y los automóviles deben cumplir.`,
  "El costo promedio de un coche de F1 es de 6, 8 millones. Ten en cuenta que es el precio de los componentes más básicos. No incluye los cientos de millones gastados en desarrollo e investigación. Es una máquina bastante cara.",
  "De hecho, aproximadamente 80,000 componentes se juntan para hacer un auto de F1, y los carros deben ser ensamblados con el 100% de precisión para funcionar.",
  "Un conductor de F1 promedio pierde unos 4 kg de peso después de una sola carrera. Una persona que ha perdido el 4% del peso corporal puede perder hasta el 40% de su capacidad psicofísica. Las cabinas de F1 tienen botella de bebida instalada para los conductores. Los conductores pueden beber agua a través de una tubería.",
  "Durante la carrera los neumáticos también pierden peso! Cada neumático pierde alrededor de 0,5 kg de peso debido al desgaste. Los neumáticos normales duran 60 000 - 100 000 km. Los neumáticos de competición están diseñados para durar entre 90 y 120 km. A máxima velocidad, los neumáticos F1 giran 50 veces por segundo.",
  "El peso del coche de F1 es de solo 702 kg, incluido el conductor, pero no el combustible.",
  "Los mejores equipos de F1 pueden repostar y cambiar neumáticos en solo 3 segundos.",
  "Los discos de freno F1 están hechos de una forma especial e indestructible de fibra de carbono. Los discos se calientan hasta alrededor de 1,200 grados C, generalmente la temperatura promedio de la lava fundida.",
  "Los motores de los autos F1 solo duran aproximadamente 2 horas de carrera, principalmente antes de explotar. Si bien esperamos que nuestros motores duren un promedio decente de 20 años. Esa es la medida en que los motores son empujados a funcionar. Un motor de F1 generalmente acelera hasta 18000 rpm. El coche promedio revoluciones hasta 6, 000 rpm.",
  "Fangio ganó el título durante 1951, 1954, 1955, 1956 y 1957. Su récord de cinco títulos del Campeonato del Mundo se mantuvo durante 45 años hasta que el piloto alemán Michael Schumacher se llevó su sexto título en 2003.",
  "Los aviones pequeños pueden despegar a velocidades más lentas que los autos de F1 en la pista. Sin embargo, una sorprendente fuerza aerodinámica proporcionada por sus alas los mantiene en la pista. Carrera de autos de F1 a velocidades de hasta 360 kph.",
  "Los pilotos de F1 experimentan hasta 5G en frenadas y curvas. Esa es una fuerza de carga cinco veces mayor al peso corporal del conductor.",
  "El auto F1 puede acelerar de 0 a 100 mph y desacelerar de nuevo a 0 en solo cuatro segundos.",
  "La seguridad de los automóviles modernos de F1 significa que los conductores pueden soportar grandes impactos de choque. David Purley sufrió el mayor impacto de impacto en el Gran Premio de Gran Bretaña en 1977, donde tuvo un impacto que se estimó en 197.8 g, lo que significa que su automóvil pasó de 108 mph a un punto muerto en dos segundos. Se recuperó y volvió a correr de nuevo.",
  "Los cascos de F1 están entre las cosas más difíciles del mundo. Algunas de las pruebas que tienen que pasar están siendo sometidas a una llama de 800 grados C durante 45 segundos.",
  "Nadie que haya entrado en el deporte con el apellido Hill no ha logrado ganar un campeonato mundial: Grayham (padre), Darion (hijo) y Phil (sin relación).",
]

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest"
  },
  handle(handlerInput: HandlerInput): Response {
    const speechText =
      "Bienvenido a formulauno, preguntame sobre alguna curiosidad de la formula 1!"

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
const server = expressApp.listen(PORT, () => {
  const address = server.address() as AddressInfo
  console.log(`${address.address}${address.port}`)
})
