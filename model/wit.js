
let config = require("./config")
var Wit

try {
    Wit = require('../').Wit;
} catch (e) {
    Wit = require('node-wit').Wit;
}

const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] &&
        Array.isArray(entities[entity]) &&
        entities[entity].length > 0 &&
        entities[entity][0].value
        ;
    if (!val) {
        return null;
    }
    return typeof val === 'object' ? val.value : val;
};


const handleMessage = (entities) => {
    const device = firstEntityValue(entities, 'device');
    const email = firstEntityValue(entities, 'email');
};

const client = new Wit({ accessToken: config.witApiToken });

module.exports.extractEntities = function (entities) {
    let extracted_entities = []
    if(!entities || !entities.entities) {
        return []
    }
    let arr = entities.entities
    for (var key in arr) {
        if (arr.hasOwnProperty(key)) {
            let en_arr = arr[key]
            en_arr.forEach(element => {
                let entity = {}
                entity.name = key
                entity.value = element.value
                entity.confidence = Number.parseFloat(element.confidence).toPrecision(3)
                extracted_entities.push(entity)
            });            
        }
    }
    return extracted_entities
}

module.exports.handleMessage = function (msg) {
    return client.message(msg, {})
}