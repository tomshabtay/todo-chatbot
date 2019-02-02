const common = require("../common")

const message1 = ["היי", "שלום", "היי!"]
const message2 = ["מה ברצונך לעשות?", "תבחר פעולה בבקשה", "איך אפשר לעזור לך?"]

function greet() {
    let message = message1[Math.floor(Math.random() * message1.length)];
    message += "\n" + message2[Math.floor(Math.random() * message2.length)];

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
    return new Promise((resolve, reject) => {
        resolve(t)
    })
}

module.exports = greet