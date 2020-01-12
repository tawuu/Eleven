const { Client, Collection } = require("discord.js");
const database = require("./database/database.js");
const config = require("./config.json");

const client = new Client();


require('dotenv').config()
const express = require('express')
const app = express()
const axios = require("axios");

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
client.omegle = new Collection();
client.omegleStrangers = new Array();
client.omegleStrangersMatched = new Array();

let AutomaticHandler = require(`./AutomaticHandler.js`);

AutomaticHandler(`./commands/`, client.commands);
AutomaticHandler(`./omegleCommands/`, client.omegle);

client.on(`guildCreate`, async (guild) => {
    const AvailableServicesDatabase = database.ref(`AvailableServices/${guild.id}/`);

    const AvailableServicesDatabaseVal = await AvailableServicesDatabase.once("value");

    if (!AvailableServicesDatabaseVal.val() === null) return;

    AvailableServicesDatabase.set({
        Money: false,
        ChatXP: false,
        CallXP: false
    });

});



client.on("message", (message) => {
    if (message.channel.type === "dm" || message.author.bot || !message.content.startsWith(config.prefix)) return;

    let command;
    let args = message.content.split(" ").slice(1);
    let commandName = message.content.split(" ")[0].slice(config.prefix.length).toLowerCase();

    if (client.commands.has(commandName)) command = client.commands.get(commandName);
    else return;

    if (command.dev && message.author.id !== "474407357649256448") return;

    command.run(client, message, args, database);
});


//CALLSYSTEM
client.on("voiceStateUpdate", (oldMember, newMember) => require(`./events/voiceStateUpdate.js`)(client, oldMember, newMember, database));
//CHATSYSTEM
client.on("message", (message) => require(`./events/message.js`)(client, message, database, config.prefix));
//CLIENT
module.exports.client = client;


client.login(config.maintoken);

