
const botflow = require("./model/botflow")
const db = require("./model/db")

let request = { "sender": "123", "text": "הוסף משימה", "originalRequest": { "update_id": 471631581, "message": { "message_id": 54, "from": { "id": 123, "is_bot": false, "first_name": "Rotev", "username": "boi4657", "language_code": "en" }, "chat": { "id": 123, "first_name": "123", "username": "123", "type": "private" }, "date": 1548405068, "text": "vhh" } }, "type": "telegram" }

botflow(request) // Responding...
    .then((replay) => {
        console.log(replay)
    }).then(() => {
        db.disconect()
    })


