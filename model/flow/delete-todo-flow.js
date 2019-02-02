const db = require("../db")

function deleteTodo() {
    let finish = new Promise((resolve, reject) => {
        resolve("המשימות שבוצעו נמחקו בהצלחה")
    })

    return db.deleteAllTodos().then((res) => {
        return finish
    })

}

module.exports = deleteTodo