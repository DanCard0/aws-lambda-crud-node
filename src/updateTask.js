const AWS = require('aws-sdk');

const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

const updateTask = async(event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;
    const { done, title, description } = event.body;

    await dynamodb.update({
        TableName: 'TaskTable',
        Key: { id },
        UpdateExpression: 'set done = :done, title = :title, description = :description',
        ExpressionAttributeValues: {
            ':done': done,
            ':title': title,
            ':description': description
        },
        ReturnValues: 'ALL_NEW'
    }).promise();

    return {
        status: 200,
        body: JSON.stringify({
            message: 'Tarea actualizada exitosamente'
        })
    }
};

module.exports = {
    updateTask: middy(updateTask).use(jsonBodyParser())
};