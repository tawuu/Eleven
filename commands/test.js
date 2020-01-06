module.exports.names = ["test"];
module.exports.dev = true;
module.exports.run = async (client, message, args, database) => {

    isAvailable = require(`../database/isAvailable.js`);
    GuildMemberRole = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "chatxp");
    message.channel.send(GuildMemberRole);

};