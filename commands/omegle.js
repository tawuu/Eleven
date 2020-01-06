module.exports.names = ["omegle"];
module.exports.dev = true;

module.exports.run = (client, message, args) => {
    

    const channel = message.channel;

    if (!args[0]) return channel.send(`Digite >help omegle e veja as opções de comandos!`);
    else {
        let command = args[0].toLowerCase();
        anotherArgs = args.slice(1);
        if (client.omegle.has(command)) client.omegle.get(command)(client, message, anotherArgs);
        
    }


};