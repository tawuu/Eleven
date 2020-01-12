Fight = require(`../fightSystem/start.js`);
Fighthing = new Set();
module.exports.names = ["fight", "lutar"];

module.exports.run = (client, message, args) => {

    const channel = message.channel;

    if (!message.mentions.members.first()) return channel.send(`You need to mention someone!`);

    
    mentionedId = message.mentions.members.first().id;
    mentionedUsername = client.users.get(mentionedId).username;

    if (Fighthing.has(message.author.id)) return channel.send(`Você já está em uma luta!`);
    if (Fighthing.has(mentionedId)) return channel.send(`<@${mentionedId}> já está em uma luta!`);


    Fight = new Fight(
        { name: message.author.username, id: message.author.id },
        { name: mentionedUsername, id: mentionedId }
    );
    
    Fighthing.add(mentionedId);
    Fighthing.add(message.author.id);





    const moves = ["punch", "kick", "push", "giveup"];

    channel.send(`A luta começou! escolha seu movimento: **${moves.join(" / ")}**`)


    const filter = (m) => moves.includes(m.content.toLowerCase());

    const collector = channel.createMessageCollector(filter);

    collector.on("collect", async collected => {

        if (collected.author.id !== Fight.whoMoves().id) return;

        moviment = collected.content.toLowerCase();

        result = await Fight.move(moviment);
        channel.send(`resultado do seu movimento: **${result}**`);
        channel.send(`quem se movimenta é: **${Fight.whoMoves().name}**`);

    });

};