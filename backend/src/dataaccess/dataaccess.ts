import {DynamoDB} from "aws-sdk"
import {v4 as uuid} from 'uuid'

var docClient = new DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

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