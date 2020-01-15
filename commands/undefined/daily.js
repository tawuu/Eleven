module.exports.names = ["daily"];
const  { RichEmbed } = require("discord.js");
module.exports.run = async (client, message, args, database) => {

    const channel = message.channel;

    const isAvailable = client.require(`isAvailable.js`);

    const isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "money");
    if (!isAvailableGuild) return;
    
    const isAvailableGuildMember = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "money");
    if (!isAvailableGuildMember) return;
    
    const CheckerIsAvailableToDaily = client.require(`availableToDaily.js`);

    const ValueForDaily = Math.floor(Math.random() * 500) + 100;

    const isAvailableToDaily = await CheckerIsAvailableToDaily.GuildMember(message.guild.id, message.author.id, database)
    if (isAvailableToDaily === true) {
        const Money = client.require("addMoney.js");
        Money.AddMoney(message.guild.id, message.author.id, ValueForDaily, database)
        channel.send(new RichEmbed().setDescription(client.message(["daily", "money_add", "pt"], ValueForDaily)));
    } else {
        return channel.send(client.message(["daily", "wait_for", "pt"], MsToTime(isAvailableToDaily)));
    }

};  

function MsToTime(milis) {
    var seconds = Math.floor((milis / 1000) % 60),
    minutes = Math.floor((milis / (1000 * 60)) % 60),
    hours = Math.floor((milis / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}