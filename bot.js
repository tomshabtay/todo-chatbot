var botBuilder = require('claudia-bot-builder')
const botflow = require("./model/botflow")

module.exports = botBuilder(function (request, originalApiRequest) {
    originalApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false

    return botflow(request) // Responding...
        .then((replay) => {
            console.log("replay")
            console.log(replay)
            return replay
        })
}, { platforms: ['telegram'] });