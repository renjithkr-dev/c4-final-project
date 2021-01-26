import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger, transports } from 'winston'
import { doesNotReject } from 'assert';
import { GetItemsForUserId } from "../../dataaccess/dataaccess"



const logger = createLogger({
  level: 'info', transports: [
    new transports.Console()]
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  try {
    const data = await GetItemsForUserId(event.requestContext.authorizer.principalId)
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "items": data })
    }
  } catch (err) {
    logger.error(err)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ "iterms": [] })
    }
  }
}
