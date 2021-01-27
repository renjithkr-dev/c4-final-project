import * as AWS from "aws-sdk"
const AWSXRay = require('aws-xray-sdk-core')
import {v4 as uuid} from 'uuid'

const xAWS=AWSXRay.captureAWS(AWS)
var docClient =  new xAWS.DynamoDB.DocumentClient()


export const GetItemsForUserId=async (uId:string)=>{
    var params = {
        TableName: process.env.TODOS_TABLE,
        IndexName: process.env.INDEX_NAME,
        KeyConditionExpression:"userId=:id",
        ExpressionAttributeNames:{
            "#todoName": "name"
        },
        ExpressionAttributeValues:{
          ":id":uId
        },
        "ProjectionExpression": "todoId,attachmentUrl,dueDate,createdAt,#todoName,done"
    };
    let data=[]
    try {
      const resp=await docClient.query(params).promise()
      data=resp.Items
    } catch (error) {
      throw(error)
    }
    return Promise.resolve(data)
}

export const AddItem=async (userId:string,item:any)=>{
    const params = {
        TableName:process.env.TODOS_TABLE,
        Item:{
          userId: userId,
          todoId: `${uuid()}`,
          createdAt: new Date().toDateString(),
          ...item,
          done: true,
          attachmentUrl: ""
        }
    };
    try{
        await docClient.put(params).promise();
        return Promise.resolve(params.Item)
        }catch(e){
          throw e
        }
}

export const UpdateItem=async (toDoID:string,newItem:any)=>{
    const params = {
        TableName:process.env.TODOS_TABLE,
        Key:{
            "todoId":toDoID
        },
        ExpressionAttributeNames:{
            "#todoName": "name"
        },
        UpdateExpression:'set #todoName=:nm, dueDate= :dueDt, done=:dn',
        ExpressionAttributeValues:{
            ":nm":newItem.name,
            ":dueDt":newItem.dueDate,
            ":dn":newItem.done
        },
        ReturnValues:"ALL_NEW"
    };
    try{
        const uItem=await docClient.update(params).promise();
        return Promise.resolve(uItem)
        }catch(e){
          throw e
        }
}
export const UpdateURLForItem=async (toDoID:string,url:any)=>{
    const params = {
        TableName:process.env.TODOS_TABLE,
        Key:{
            "todoId":toDoID
        },
        UpdateExpression:'set attachmentUrl=:aurl',
        ExpressionAttributeValues:{
            ":aurl":url
        },
        ReturnValues:"ALL_NEW"
    };
    try{
        const uItem=await docClient.update(params).promise();
        return Promise.resolve(uItem)
        }catch(e){
          throw e
        }
}
export const DeleteItem=async (toDoID:string)=>{
    const params = {
        TableName:process.env.TODOS_TABLE,
        Key:{
            "todoId":toDoID
        },
        ConditionExpression:'todoId=:todoID',
        ExpressionAttributeValues:{
            ":todoID":toDoID
        }
    };
    try{
        const uItem=await docClient.delete(params).promise();
        return Promise.resolve("Deleted")
        }catch(e){
          throw e
        }
}