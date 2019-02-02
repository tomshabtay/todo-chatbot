const db = require("../db")
const common = require("../common")

function listTodos() {
    let session = global.user.session
    if (session.step === 0) {
        return showList()
    }
    if (session.step === 1) {
        return markAsDone()
    }

}

function markAsDone() {
    let session = global.user.session
    session.step = 0
    session.data = {}
    session.data.text = global.recivedMsg.text

    message = "המשימה סומנה כסויימה 👌"

    let options = common.main_menu
    let t = {
        text: message,
        parse_mode: 'Markdown',
        reply_markup: JSON.stringify({
            keyboard: options,
            resize_keyboard: true,
            one_time_keyboard: false
        })
    }

    let finish = new Promise((resolve, reject) => {
        resolve(t)
    })

    let choosenId = global.recivedMsg.text
    if (Number.isInteger(choosenId)) {
        message = "לא בוצעה פעולה"
    }
    return db.updateSession(session)
        .then(db.markTodoDone(choosenId))
        .then((res) => {
            return finish
        })

}

function showList() {
    // let todoData = global.recivedMsg.text
    let todos = global.user.todos
    let message = "משימות:" + "\n"

    todos.forEach(todo => {
        message += todo.id + ". " + todo.text
        if (todo.done) {
            message += " ✔️"
        }
        message += "\n"
    });
    message += "\n"
    message += "הקלד או בחר מספר משימה כדי לסמן שסויימה"

    let options = todos.map((todo) => {
        return todo.id.toString()
    })

    let t = {
        text: message,
        parse_mode: 'Markdown',
        reply_markup: JSON.stringify({
            keyboard: [options],
            resize_keyboard: true,
            one_time_keyboard: true
        })
    }

    let session = global.user.session
    session.step = 1
    session.flow = "list-todos"

    let finish = new Promise((resolve, reject) => {
        resolve(t)
    })

    return db.updateSession(session).then((res) => {
        return finish
    })

}

module.exports = listTodos