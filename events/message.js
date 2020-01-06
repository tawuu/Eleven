module.exports = async (client, message, database, prefix) => {

    if (message.author.bot || message.content.startsWith(prefix) || message.content.length < 10 && !message.attachments) return

    isAvailable = require(`../database/isAvailable.js`);
    
    isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "chatxp");
    if (isAvailableGuild === false) return;
    
    
    isAvailable = require(`../database/isAvailable.js`);
    isAvailableRole = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "chatxp");
    if (isAvailableRole === false) return;


    isAvailableToAdd = require(`../chatSystem/availableToAdd.js`);
    isAvailableToAdd = isAvailableToAdd.GuildMember(message.guild, message.member);

    if (isAvailableToAdd === false) return;

    addXP = require(`../chatSystem/AddXP.js`);
    addXP.GuildMember(message.guild, message.member, database);
}