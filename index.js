const { Client, Collection } = require("discord.js");
const { readdir } = require("fs");
const database = require("./database/database.js");
const config = require("./config.json");

const client = new Client();

client.commands = new Collection();
client.omegle = new Collection();
client.omegleStrangers = new Array();
client.omegleStrangersMatched = new Array();

const commandsPath = `./commands/`;
const omeglePath = `./omegleCommands/`;

readdir(commandsPath, (err, files) => {
    if (err) throw err;
    let props;
    files.forEach(file => {
        if (file.endsWith(".js")) {
            try {
                props = require(`${commandsPath}${file}`);
                props.names.map(name => client.commands.set(name, props));
                console.log(`sucessfully loaded: ${file}`);
            } catch (error) {
                console.log(error.message);
                console.log(`error trying to load this file: ${file}`);
            }
        } else if (!file.includes(".")) {
            readdir(`${commandsPath}${file}/`, (err, subfiles) => {
                subfiles.forEach(subfile => {
                    if (!subfile.endsWith(".js")) return;
                    try {
                        props = require(`${commandsPath}${files}${subfile}`);
                        props.names.map(name => client.commands.set(name, props));
                        console.log(`sucessfully loaded: ${subfile}`);
                    } catch (error) {
                        console.log(error.message);
                        console.log(`error trying to load this file: ${subfile}`);
                    }
                });
            });
        }
    })

});

readdir(omeglePath, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        commandName = file.split(".")[0];
        props = require(`${omeglePath}${file}`);
        console.log(`[omegle] sucessfully loaded: ${commandName}`);
        client.omegle.set(commandName, props);
    });
});

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

client.on("ready", () => console.log("ready"));

//CALLSYSTEM
client.on("voiceStateUpdate", (oldMember, newMember) => require(`./events/voiceStateUpdate.js`)(client, oldMember, newMember, database));
//CHATSYSTEM
client.on("message", (message) => require(`./events/message.js`)(client, message, database, config.prefix));
//CLIENT
module.exports.client = client;


client.login(config.maintoken);

