const greet = require("./flow/greet-flow")
const addTodo = require("./flow/add-todo-flow")
const listTodos = require("./flow/list-todos-flow")
const deleteTodo = require("./flow/delete-todo-flow")

// Possible flows (values from Wit.ai)
const GREET_FLOW = "greet"
const BYE_FLOW = "bye"
const ADD_TODO_FLOW = "add-todo"
const LIST_TODOS_FLOW = "list-todos"
const DELETE_TODO_FLOW = "delete-todo"


function makeReplay(recivedMsg) {
    // Continue flow...
    let session = global.user.session
    if (session.step >= 1) {
        if (session.flow === ADD_TODO_FLOW) {
            return addTodo()
        }
        if (session.flow === LIST_TODOS_FLOW) {
            return listTodos()
        }
    }

    // Or start new flow
    // Finding the intent
    let intent = recivedMsg.ai.find((element => {
        return element.name === "intent"
    }))

    // Checking the intent
    if (!intent || !intent.value || !checkConfidence(intent.confidence))
        return Promise.resolve("whaattt...")

    if (intent.value === GREET_FLOW) {
        return greet()
    }

    if (intent.value === BYE_FLOW) {
        return Promise.resolve("But why dude..")
    }

    if (intent.value === ADD_TODO_FLOW) {
        return addTodo()
    }

    if (intent.value === LIST_TODOS_FLOW) {
        return listTodos()
    }

    if (intent.value === DELETE_TODO_FLOW) {
        return deleteTodo()
    }
}

function getDebugInfo(recivedMsg) {
    let res = "AI says:" + "\n"

    recivedMsg.ai.forEach(element => {
        res += element.name + ": " + element.value + "     %" + (element.confidence * 100) + "\n"
    });
    res += + "\n" + global.messageId + "\n"
    res += global.userId + "\n"
    return res
}

function checkConfidence(confidence) {
    return confidence > 0.9
}

function buildResponse(recivedMsg) {
    let debugInfo = getDebugInfo(recivedMsg)
    return makeReplay(recivedMsg)
}

module.exports = buildResponse