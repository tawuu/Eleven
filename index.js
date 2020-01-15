const { readdir, lstat } = require("fs").promises;
const { Client, Collection } = require("discord.js");
const database = require("./database/database.js");
const config = require("./config.json");


const client = new Client({
    disableEveryone: true
});


require('dotenv').config()
const express = require('express'), app = express(), axios = require("axios");

app.get('/', (req, res) => {
    res.send('Blz...')
})

app.listen(process.env.PORT || 3000, () => {
    setInterval(async () => {
        await axios.get('https://eleven-heroku.herokuapp.com');
        console.log('[GET] - Bot request heroku url');
    }, 25 * 60000);
});

client.commands = new Collection();

let AutomaticHandler = require(`./AutomaticHandler.js`);

AutomaticHandler(`./commands/`, client.commands).catch(console.error);

const cache = new Map();

async function setupCache(folder = "./") {
    if (["./git/", "./commands/", "./node_modules"].includes(folder)) return;

    elements = await readdir(folder)
    for (const element of elements) {
        elementStat = await lstat(`${folder + element}`);
        if (elementStat.isFile()) cache.set(element, `${folder + element}`);
        else if (elementStat.isDirectory()) setupCache(folder + element + "/");
    }
} setupCache();

client.require = function (fileName) {
    if (cache.has(fileName)) return require(cache.get(fileName));
    else return console.error("File doesn't exists.");
}
module.exports.require = function (fileName) {
    if (cache.has(fileName)) return require(cache.get(fileName));
    else return console.error("File doesn't exists.");
}

let maxMessages = 5;
let maxTime = 120000;
let counting = false;
let messagesCreatedAt = [];

function startMonitoring() {
    let interval = setInterval(() => {
        if (messagesCreatedAt.length >= maxMessages) {
            if (messagesCreatedAt[9] - messagesCreatedAt[0] < maxTime) {
                console.log(`Mais de 10 mensagens no intervalo de: ${parseInt((messagesCreatedAt[9] - messagesCreatedAt[0]) / 1000)} segundos`);
                clearInterval(interval);
                counting = false;
            }
        }
    }, 500);
}

client.on("message", message => {
    if (!counting) { counting = true; startMonitoring() }
    else messagesCreatedAt.push(message.createdTimestamp);

});

client.message = ([type, message, lang], first, second, third) => {
    messages = require("./messages.json");
    message = messages[type][message][lang];
    if (first) message = message.replace("%%first%%", first);
    if (second) message = message.replace("%%second%%", second);
    if (third) message = message.replace("%%third%%", third);
    return message;
}

//ADDGUILD
client.on(`guildCreate`, (guild) => require("./events/guildCreate.js")(guild, database));
//COMMANDRUN
client.on("message", (message) => require(`./events/message.js`)(client, message, database, config.prefix, "cmd"));
//CALLSYSTEM
client.on("voiceStateUpdate", (oldMember, newMember) => client.require(`voiceStateUpdate.js`)(client, oldMember, newMember, database));
//CHATSYSTEM
client.on("message", (message) => require(`./events/message.js`)(client, message, database, config.prefix));
//CLIENT
module.exports.client = client;


client.login(config.maintoken);

