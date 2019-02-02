let mongoose = require('mongoose')
let config = require('./config')
mongoose.connect(config.witApiToken)


// Schemas
let UserSchema = new mongoose.Schema({
    senderId: String,
    firstName: String,
    isBot: String,
    platform: String,
    lang: String,
    ups: { type: Number, default: 0 },
    username: String,
    lastSeen: Date,
    session: {
        flow: String,
        step: Number,
        data: {}
    },
    todos: [{}]
})

let MessageSchema = new mongoose.Schema({
    text: String,
    senderId: String,
    ai: [{
        value: String,
        confidence: String,
        name: String
    }]
})

const User = mongoose.model('User', UserSchema)
const Message = mongoose.model('Message', MessageSchema)

// Oporations
module.exports.deleteAllTodos = function () {
    let user = {}
    user.todos = global.user.todos.filter(todo => {
        return !todo.done
    })

    for (let i = 0; i < user.todos.length; i++) {
        const element = user.todos[i]
        element.id = i + 1

    }

    var query = { 'senderId': global.senderId },
        update = user,
        options = { upsert: true };

    // Find the document
    return User.update(query, update, options)
        .exec()
        .then((result) => {
            Promise.resolve("Done")
        })
}

module.exports.addTodo = function (text) {
    let todo = {
        text: text,
        id: global.user.todos.length + 1,
        done: false
    }
    var query = { 'senderId': global.senderId },
        update = { $push: { todos: todo } },
        options = { upsert: true };

    // Find the document
    return User.update(query, update, options)
        .exec()
        .then((result) => {
            Promise.resolve("Done")
        })
}


module.exports.markTodoDone = function (id) {

    var query = { 'senderId': global.senderId, 'todos.id': parseInt(id) },
        update = {
            '$set': {
                'todos.$.done': true
            }
        },
        options = { upsert: true };

    // Find the document
    return User.update(query, update, options)
        .exec()
        .then((result) => {
            Promise.resolve("Done")
        })
}

module.exports.updateSession = function (session) {
    let user = {}

    user.session = {}
    user.session.flow = session.flow
    user.session.step = session.step
    user.session.data = session.data

    var query = { 'senderId': global.senderId },
        update = user

    options = { upsert: true };

    // Find the document
    return User.findOneAndUpdate(query, update, options)
        .exec()
        .then((result) => {
            Promise.resolve("Done")
        })
}

module.exports.saveMessage = function (recivedMsg) {
    let msg = new Message()
    msg.text = recivedMsg.text
    msg.senderId = recivedMsg.sender.toString()
    msg.ai = recivedMsg.ai

    return msg.save().then((res) => {
        global.messageId = res.id
    })
}

module.exports.saveUser = function (recivedMsg) {
    let user = {}
    user.username = recivedMsg.username
    user.firstName = recivedMsg.firstName
    user.isBot = recivedMsg.isBot
    user.lang = recivedMsg.lang
    user.platform = recivedMsg.platform
    user.senderId = recivedMsg.sender.toString()
    user.lastSeen = new Date()
    user.$inc = { ups: 1 }

    var query = { 'senderId': user.senderId },
        update = user
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    return User.findOneAndUpdate(query, update, options)
        .exec()
        .then((result) => {
            global.userId = result.id
            global.user = result
        })
}

module.exports.disconect = function () {
    return mongoose.disconnect()
}
