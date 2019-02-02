const db = require("../db")

const message_a1 = ["סבבה", "יופי", "מעולה"]
const message_a2 = ["תפרט לי בבקשה מה המשימה", "תרשום לי בבקשה מה המשימה"]

let message_a = message_a1[Math.floor(Math.random() * message_a1.length)];
message_a += "\n" + message_a2[Math.floor(Math.random() * message_a2.length)];

function addTodo() {
    let session = global.user.session

    if (session.step === 0) {
        return askForTodoData()
    }
    if (session.step === 1) {
        return saveTodo()
    }

}

function askForTodoData() {
    // let todoData = global.recivedMsg.text
    let session = global.user.session
    session.step = 1
    session.flow = "add-todo"
    let finish = new Promise((resolve, reject) => {
        resolve(message_a)
    })

    return db.updateSession(session).then((res) => {
        return finish
    })

}

function saveTodo() {
    let session = global.user.session
    session.step = 0
    session.data = {}
    session.data.text = global.recivedMsg.text 
    let finish = new Promise((resolve, reject) => {
        resolve("המשימה נשמרה בהצלחה!")
    })

    return db.updateSession(session)
    .then(db.addTodo(global.recivedMsg.text))
    .then((res) => {
        return finish
    })
}

module.exports = addTodo