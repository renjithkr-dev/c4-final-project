import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger, transports } from 'winston'
import { DeleteItem } from "../../dataaccess/dataaccess"

const logger = createLogger({
  level: 'info', transports: [
    new transports.Console()]
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  try {
    const data = await DeleteItem(todoId)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(data)
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Error when deleting" })
    }
  }
}
