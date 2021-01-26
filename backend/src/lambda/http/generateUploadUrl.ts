import {S3} from "aws-sdk"
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {v4 as uuid} from 'uuid'
import {UpdateURLForItem} from "../../dataaccess/dataaccess"

const s3=new S3({'signatureVersion':'v4'})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const key=`upload/${uuid()}`

  var params = {Bucket: process.env.BUCKET_NAME, Key: key, Expires: 300};
  const url= s3.getSignedUrl('putObject', params)
  await UpdateURLForItem(todoId,`https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`)
  return {
    statusCode:200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      'Access-Control-Allow-Credentials': true
    },
    body:JSON.stringify({"uploadUrl":url})
  }
}
