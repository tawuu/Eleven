const { RichEmbed } = require("discord.js");
Fight = require(`../fightSystem/FightClass.js`);

Fighthing = new Set();

module.exports.names = ["fight", "lutar"];

module.exports.run = async (client, message, args) => {

    const channel = message.channel;

    if (!message.mentions.members.first()) return channel.send(`You need to mention someone!`);


    mentionedId = message.mentions.members.first().id;
    mentionedUsername = client.users.get(mentionedId).username;

    if (client.users.get(mentionedId).bot && mentionedId !== client.user.id) return channel.send(`You can not fight against a bot!`);
    if (mentionedId === message.author.id) return channel.send(`You can not fight by yourself ;-;`);
    if (Fighthing.has(message.author.id)) return channel.send(`Você já está em uma luta!`);
    if (Fighthing.has(mentionedId)) return channel.send(`<@${mentionedId}> já está em uma luta!`);


    Fight = new Fight(
        { name: message.author.username, id: message.author.id },
        { name: mentionedUsername, id: mentionedId }
    );

    Fighthing.add(mentionedId);
    Fighthing.add(message.author.id);

    let collector;

    channel.send(new RichEmbed()
        .setDescription(`<@${Fight.turn.id}> escolha um ataque! [ \`${Fight.moves.join("/")}\` ]`));

    Fight.on("winner", fighter => {
        collector.stop();
        channel.send(new RichEmbed()
            .setDescription(`Vencedor: **${fighter.name}**`));
    });

    Fight.on("attack", (fighter, attack, damage, nextFighter) => require("../fightSystem/attackMessage.js")(channel, fighter, attack, damage, nextFighter));

    collector = channel.createMessageCollector(m => Fight.moves.includes(m.content.toLowerCase()));

    collector.on("collect", collected => collected.author.id === Fight.turn.id ? Fight.hit(collected.content.toLowerCase()) : null);

};