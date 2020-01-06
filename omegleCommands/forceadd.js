const { appendFileSync } = require("fs");
module.exports = (client, message, args) => {
    if (message.author.id !== "474407357649256448") return;

    const channel = message.channel;
    if (!args[0]) return channel.send("insira o id do usuário.");
    else return client.omegleStrangers.push(args[0]);
    
};