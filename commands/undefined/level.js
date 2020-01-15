module.exports.names = ["level"];
module.exports.run = async (client, message, args, database) => {

    const channel = message.channel;

    const levelTypes = ["CHAT", "CALL"];

    if (!args[0]) errArgsZero();
    else if (!levelTypes.includes(args[0].toUpperCase())) errArgsZero();
    else if (args[0].toUpperCase() === levelTypes[0]) showLevelChat();
    else if (args[0].toUpperCase() === levelTypes[1]) showLevelCall();

    function errArgsZero() {
        channel.send(client.message(["level", "type", "pt"], levelTypes.join("/")));

        filter = m => m.author.id === message.author.id;

        TypeCollector = channel.createMessageCollector(filter, { time: 10000 });
        TypeCollector.on("collect", (collected) => {
            if (collected.content.toUpperCase() === levelTypes[0]) showLevelChat() / TypeCollector.stop("acabo");
            if (collected.content.toUpperCase() === levelTypes[1]) showLevelCall() / TypeCollector.stop("acabo");
        });
    }

    async function showLevelChat() {

        isAvailable = client.require(`isAvailable.js`);
        isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "chatxp");
        isAvailable = client.require(`isAvailable.js`);
        isAvailableRole = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "chatxp");

        if (!isAvailableGuild) return channel.send(client.message(["service", "unavailable", "pt"], "chatxp")).then(msg => msg.delete(6000));
        if (!isAvailableRole) return channel.send(client.message(["service", "unavailable_for_role", "pt"])).then(msg => msg.delete(6000));

        const userChatXPDatabase = database.ref(`Configs/${message.guild.id}/MembersChatXP/${message.author.id}`);

        const userChatXPDatabaseVal = await userChatXPDatabase.once("value");

        if (userChatXPDatabaseVal.val() === null) return channel.send(client.message(["level", "null_level", "pt"]));

        const { RichEmbed } = require('discord.js');

        TotalXPEmbed = new RichEmbed();

        TotalXPEmbed.setDescription(client.message(["level", "description", "pt"], userChatXPDatabaseVal.val().Level, userChatXPDatabaseVal.val().XP, userChatXPDatabaseVal.val().NextLevel));


        channel.send(TotalXPEmbed);

    }

    async function showLevelCall() {


        isAvailable = client.require(`isAvailable.js`);
        isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "callxp");
        isAvailable = client.require(`isAvailable.js`);
        isAvailableRole = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "callxp");

        if (!isAvailableGuild) return channel.send(client.message(["service", "unavailable", "pt"], "callxp")).then(msg => msg.delete(6000));
        if (!isAvailableRole) return channel.send(client.message(["service", "unavailable_for_role", "pt"])).then(msg => msg.delete(6000));

        const userCallXPDatabase = database.ref(`Configs/${message.guild.id}/MembersCallXP/TotalTime/${message.author.id}`);

        const userCallXPDatabaseVal = await userCallXPDatabase.once("value");

        if (!userCallXPDatabaseVal.val()) return channel.send(client.message(["callxp", "null_xp", "pt"]));

        TotalSeconds = userCallXPDatabaseVal.val().TotalTimeSeconds;

        Hours = Math.floor(TotalSeconds / 3600);
        TotalSeconds %= 3600;
        Minutes = Math.floor(TotalSeconds / 60);
        Seconds = TotalSeconds % 60;

        const { RichEmbed } = require("discord.js");

        TotalTimeEmbed = new RichEmbed();

        TotalTimeEmbed.setDescription(client.message(["callxp", "description", "pt"], Hours, Minutes, Seconds));

        channel.send(TotalTimeEmbed);

    }
};