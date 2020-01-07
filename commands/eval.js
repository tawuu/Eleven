module.exports.names = ["eval"];
module.exports.dev = true;

const { RichEmbed } = require('discord.js');

module.exports.run = async (client, message, args, database) => {

    try {
        let commandString = args.join(" ");
        let commandEval = await eval(commandString);

        if (typeof commandString !== 'string');
        commandString = require('util').inspect(commandString, { depth: 0 });

        let evalEmbed = new RichEmbed();

        evalEmbed.setAuthor('Eval')
        evalEmbed.addField('📥 Entrada', commandString)
        evalEmbed.addField('📤 Saida', commandEval)

        message.channel.send(evalEmbed)

    } catch (e) {
        message.channel.send(new RichEmbed().setDescription(e.message));
    }
}