const wit = require("./wit")
const buildResponse = require("./build-response")
const db = require("./db")

function handleMessage(request) {
    // Extracting Information from message
    let recivedMsg = mapRequest(request)
    global.senderId = recivedMsg.sender
    global.recivedMsg = recivedMsg

    return wit.handleMessage(recivedMsg.text)
        .then((data) => {
            // Using Wit.ai Api to get entities
            recivedMsg.ai = wit.extractEntities(data)
        })
        .then(() => {
            return db.saveMessage(recivedMsg)
        })
        .then(() => {
            return db.saveUser(recivedMsg)
        })
        .then(() => {
            // Building the response, and sending
            return buildResponse(recivedMsg)
        })
}

function mapRequest(request) {
    let recivedMsg = {}
    recivedMsg.sender = request.sender
    recivedMsg.text = request.text
    recivedMsg.id = request.originalRequest.message.message_id
    recivedMsg.firstName = request.originalRequest.message.from.first_name
    recivedMsg.username = request.originalRequest.message.from.username
    recivedMsg.isBot = request.originalRequest.message.from.is_bot
    recivedMsg.platform = request.type
    recivedMsg.lang = request.type
    return recivedMsg
}

module.exports = handleMessage


