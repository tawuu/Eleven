module.exports = async (client, message, database, prefix, func) => {

    if (func == "cmd") {

        if (message.channel.type === "dm" || message.author.bot || !message.content.startsWith(prefix)) return;
        let command;
        let args = message.content.split(" ").slice(1);
        let commandName = message.content.split(" ")[0].slice(prefix.length).toLowerCase();

        if (client.commands.has(commandName)) command = client.commands.get(commandName);
        else return;

        if (command.dev && message.author.id !== "474407357649256448") return;

        command.run(client, message, args, database);
    } else {

        ////////////////////////////////////////

        if (message.content.startsWith(`<@${client.user.id}>`)) message.channel.send(client.message(["client_message", "mentioned_me", "pt"]));

        if (message.author.bot || message.content.startsWith(prefix) || message.content.length < 10 && !message.attachments) return

        isAvailable = client.require(`isAvailable.js`);

        isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "chatxp");
        if (isAvailableGuild === false) return;


        isAvailable = client.require(`isAvailable.js`);
        isAvailableRole = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "chatxp");
        if (isAvailableRole === false) return;


        isAvailableToAdd = client.require(`availableToAdd.js`);
        isAvailableToAdd = isAvailableToAdd.GuildMember(message.guild, message.member);

        if (isAvailableToAdd === false) return;

        addXP = client.require(`AddXP.js`);
        addXP.GuildMember(message.guild, message.member, database);
    }
}