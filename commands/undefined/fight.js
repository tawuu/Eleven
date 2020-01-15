const { RichEmbed } = require("discord.js");

Fighthing = new Set();

module.exports.names = ["fight", "lutar"];

module.exports.run = async (client, message, args) => {
    Fight = client.require(`FightClass.js`);

    const channel = message.channel;

    if (!message.mentions.members.first()) return channel.send(`You need to mention someone!`);


    mentionedId = message.mentions.members.first().id;
    mentionedUsername = client.users.get(mentionedId).username;

    if (client.users.get(mentionedId).bot && mentionedId !== client.user.id) return channel.send(client.message(["fight", "fight_with_bot", "pt"]));
    if (mentionedId === message.author.id) return channel.send(client.message(["fight", "fight_by_itself", "pt"]));
    if (Fighthing.has(message.author.id)) return channel.send(client.message(["fight", "already_fighting", "pt"]));
    if (Fighthing.has(mentionedId)) return channel.send(["fight", "already_fighting_2", "pt"], `<@${mentionedId}>`);


    Fight = new Fight(
        { name: message.author.username, id: message.author.id },
        { name: mentionedUsername, id: mentionedId }
    );

    Fighthing.add(mentionedId);
    Fighthing.add(message.author.id);

    let collector;

    channel.send(new RichEmbed()
        .setDescription(client.message(["fight", "choose_one_attack", "pt"], `<@${Fight.turn.id}>`, Fight.moves.join("/"))));

    Fight.on("winner", fighter => {
        collector.stop();
        channel.send(new RichEmbed()
            .setDescription(client.message(["fight", "winner", "pt"], fighter.name)));
    });

    Fight.on("attack", (fighter, attack, damage, nextFighter) => client.require("attackMessage.js")(channel, fighter, attack, damage, nextFighter));

    collector = channel.createMessageCollector(m => Fight.moves.includes(m.content.toLowerCase()));

    collector.on("collect", collected => collected.author.id === Fight.turn.id ? Fight.hit(collected.content.toLowerCase()) : null);

};