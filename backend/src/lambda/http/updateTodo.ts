import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger, transports } from 'winston'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { UpdateItem } from "../../dataaccess/dataaccess"

const logger = createLogger({
  level: 'info', transports: [
    new transports.Console()]
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    const data = await UpdateItem(todoId,updatedTodo)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "items": data })
    }
  } catch (error) {
    logger.error(error)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": "Error when updating" })
    }
  }
}
