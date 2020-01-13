const { RichEmbed } = require("discord.js");
module.exports = (channel, fighter, attack, damage, nextFighter) => {
    if (damage) {
        channel.send(new RichEmbed()
        .setDescription(`(${fighter.hp}/100) <@${fighter.id}>\n
        <@${fighter.id}> utilizou \*\*${attack}\*\* e causou \*\*${damage}\*\* de dano!
        \n(${nextFighter.hp}/100) <@${fighter.id}>`));
    } else {
        channel.send(new RichEmbed()
        .setDescription(`(${fighter.hp}/100) <@${fighter.id}>\n
        <@${fighter.id}> utilizou **${attack}** e errou!
        \n(${nextFighter.hp}/100) <@${fighter.id}>`));
    }
};