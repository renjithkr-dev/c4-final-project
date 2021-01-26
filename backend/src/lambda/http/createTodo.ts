import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from "aws-sdk"
import { v4 as uuid } from 'uuid'
import { createLogger, transports } from 'winston'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {AddItem} from "../../dataaccess/dataaccess"


var docClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const logger = createLogger({
  level: 'info', transports: [
    new transports.Console()]
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  logger.info(JSON.stringify(newTodo))

  try {
    const params=await AddItem(newTodo)
    const {userId,todoId,...responseItems}=params
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(responseItems)
    }
  } catch (e) {
    logger.error(e)
  }
  // TODO: Implement creating a new TODO item
  
}
