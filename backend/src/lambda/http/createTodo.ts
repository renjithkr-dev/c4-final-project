import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda'

import { createLogger, transports } from 'winston'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {AddItem} from "../../dataaccess/dataaccess"


const logger = createLogger({
  level: 'info', transports: [
    new transports.Console()]
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  try {
    const params=await AddItem(event.requestContext.authorizer.principalId,newTodo)
    const {userId,...responseItems}=params
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({"item":responseItems})
    }
  } catch (e) {
    logger.error(e)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "error": 'Error' })
    }
  }
  // TODO: Implement creating a new TODO item
  
}
