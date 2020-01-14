module.exports.names = ["level"];
module.exports.run = async (client, message, args, database) => {

    const channel = message.channel;

    const levelTypes = ["CHAT", "CALL"];

    if (!args[0]) errArgsZero();
    else if (!levelTypes.includes(args[0].toUpperCase())) errArgsZero();
    else if (args[0].toUpperCase() === levelTypes[0]) showLevelChat();
    else if (args[0].toUpperCase() === levelTypes[1]) showLevelCall();

    function errArgsZero() {
        channel.send(`Digite o tipo de level que deseja ver \`${levelTypes.join("/")}\``)

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
        if (!isAvailableGuild) return channel.send(`Serviço desabilitado neste servidor.`).then(msg => msg.delete(6000));
        if (!isAvailableRole) return channel.send(`Seu cargo não permite este serviço.`).then(msg => msg.delete(6000));

        const userChatXPDatabase = database.ref(`Configs/${message.guild.id}/MembersChatXP/${message.author.id}`);

        const userChatXPDatabaseVal = await userChatXPDatabase.once("value");

        if (userChatXPDatabaseVal.val() === null) return channel.send(`Você não tem nível ainda...`);

        const { RichEmbed } = require('discord.js');

        TotalXPEmbed = new RichEmbed();

        TotalXPEmbed.setDescription(`LEVEL: **${userChatXPDatabaseVal.val().Level}** XP: **${userChatXPDatabaseVal.val().XP}** (**${userChatXPDatabaseVal.val().NextLevel}**%)`)


        channel.send(TotalXPEmbed);

    }

    async function showLevelCall() {

        
        isAvailable = client.require(`isAvailable.js`);
        isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "callxp");
        isAvailable = client.require(`isAvailable.js`);
        isAvailableRole = await isAvailable.GuildMemberRole(message.guild.id, message.author.id, database, "callxp");
        
        if (!isAvailableGuild) return channel.send(`Serviço desabilitado neste servidor.`).then(msg => msg.delete(6000));
        if (!isAvailableRole) return channel.send(`Seu cargo não permite este serviço.`).then(msg => msg.delete(6000));
        
        const userCallXPDatabase = database.ref(`Configs/${message.guild.id}/MembersCallXP/TotalTime/${message.author.id}`);

        const userCallXPDatabaseVal = await userCallXPDatabase.once("value");

        if (!userCallXPDatabaseVal.val()) return channel.send(`Você não tem CallXP!`);

        TotalSeconds = userCallXPDatabaseVal.val().TotalTimeSeconds;

        Hours = Math.floor(TotalSeconds / 3600);
        TotalSeconds %= 3600;
        Minutes = Math.floor(TotalSeconds / 60);
        Seconds = TotalSeconds % 60;

        const { RichEmbed } = require("discord.js");

        TotalTimeEmbed = new RichEmbed();

        TotalTimeEmbed.setDescription(`**${Hours}** Hours, **${Minutes}** Minutes, **${Seconds}** Seconds.`)

        channel.send(TotalTimeEmbed);

    }
};