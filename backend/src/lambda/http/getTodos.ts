import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {DynamoDB} from "aws-sdk"
import {createLogger,transports} from 'winston'
import { doesNotReject } from 'assert';

var docClient = new DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const logger = createLogger({level: 'info',transports: [
  new transports.Console()]})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  var params = {
    TableName: process.env.TODOS_TABLE,
    IndexName: process.env.INDEX_NAME,
    KeyConditionExpression:"userId=:id",
    ExpressionAttributeValues:{
      ":id":"1"
    }
};
let data={}
try {
  data=await docClient.query(params).promise()
} catch (error) {
  logger.error(error)
}
return{
  statusCode:200,
  headers:{
    "Access-Control-Allow-Origin" : "http://localhost:3000",
    'Access-Control-Allow-Credentials': true
  },
  body:JSON.stringify(data)
}
/*   return {
    statusCode : 200,
    body : JSON.stringify({
      "items": [
        {
          "todoId": "123",
          "createdAt": "2019-07-27T20:01:45.424Z",
          "name": "Buy milk",
          "dueDate": "2019-07-29T20:01:45.424Z",
          "done": false,
          "attachmentUrl": "http://example.com/image.png"
        },
        {
          "todoId": "456",
          "createdAt": "2019-07-27T20:01:45.424Z",
          "name": "Send a letter",
          "dueDate": "2019-07-29T20:01:45.424Z",
          "done": true,
          "attachmentUrl": "http://example.com/image.png"
        },
      ]
    }
    ),
    headers:{
      "Access-Control-Allow-Origin" : "http://localhost:3000",
      'Access-Control-Allow-Credentials': true
    }
  }; */
}
