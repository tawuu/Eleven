module.exports.names = ["ranking"];

module.exports.run = async (client, message, args, database) => {

    const channel = message.channel;

    rankingTypes = ["CHAT", "CALL"];

    if (!args[0]) errArgsZero();
    else if (!rankingTypes.includes(args[0].toUpperCase())) errArgsZero();
    else if (args[0].toUpperCase() === rankingTypes[0]) showRankingChat();
    else if (args[0].toUpperCase() === rankingTypes[1]) showRankingCall();

    function errArgsZero() {

        channel.send(client.message(["ranking", "type", "pt"], rankingTypes.join("/")))
        filter = m => m.author.id === message.author.id;

        TypeCollector = channel.createMessageCollector(filter, { time: 10000 });
        TypeCollector.on("collect", (collected) => {
            if (collected.content.toUpperCase() === rankingTypes[0]) showRankingChat() / TypeCollector.stop("acabo");
            if (collected.content.toUpperCase() === rankingTypes[1]) showRankingCall() / TypeCollector.stop("acabo");
        });
    }

    async function showRankingChat() {
        isAvailable = client.require("isAvailable.js")
        isAvailable = await isAvailable.Guild(message.guild.id, database, "chatxp");

        if (isAvailable === false) return channel.send(client.message(["service", "unavailable", "pt"], "chatxp")).then(msg => msg.delete(6000));

        const UsersChatXPDatabase = database.ref(`Configs/${message.guild.id}/MembersChatXP`);
        const UsersChatXPDatabaseVal = await UsersChatXPDatabase.once("value");

        if (UsersChatXPDatabaseVal.val() === null) return channel.send(client.message(["ranking", "null", "pt"]));

        UsersArray = [];

        UsersChatXPDatabaseVal.forEach(snap => {
            if (snap.key === "AvailableRoles") return;
            UsersArray.push({
                user: snap.key,
                username: message.guild.members.get(snap.key).user.username,
                xp: snap.val().XP,
                Level: snap.val().Level,
                NextLevel: snap.val().NextLevel
            });
        });

        if (UsersArray.length === 0) return channel.send(client.message(["ranking", "null", "pt"]));

        UsersArray.sort(function (a, b) {
            return b.xp - a.xp;
        });


        const { RichEmbed } = require("discord.js");

        let descriptionRankingEmbed = "";
        let idx = 0;

        for (const UserArray of UsersArray) {
            let medal;
            switch (idx) {
                case 0: medal = `:first_place:`
                    break;
                case 1: medal = `:second_place:`
                    break;
                case 2: medal = `:third_place:`
                    break;
                default: medal = `:medal:`
                    break;
            }

            descriptionRankingEmbed += `${medal} [**${UserArray.username}**] - Level ${UserArray.Level}\n`;

            idx++;
        }

        message.channel.send(new RichEmbed()
            .setTitle(`Ranking uhul!`)
            .setDescription(descriptionRankingEmbed));

    }

    async function showRankingCall() {
        isAvailable = client.require("isAvailable.js")
        isAvailable = await isAvailable.Guild(message.guild.id, database, "callxp");

        if (isAvailable === false) return channel.send(client.message(["service", "unavailable", "pt"], "callxp")).then(msg => msg.delete(6000));

        const UsersCallXPDatabase = database.ref(`Configs/${message.guild.id}/MembersCallXP/TotalTime`);
        const UsersCallXPDatabaseVal = await UsersCallXPDatabase.once("value");

        if (UsersCallXPDatabaseVal.val() === null) return channel.send(client.message(["ranking", "null", "pt"])).then(msg => msg.delete(6000));

        UsersArray = [];

        UsersCallXPDatabaseVal.forEach(snap => {

            TotalTimeInSeconds = snap.val().TotalTimeSeconds;
            Hours = Math.floor(TotalTimeInSeconds / 3600);
            TotalTimeInSeconds %= 3600;
            Minutes = Math.floor(TotalTimeInSeconds / 60);
            Seconds = TotalTimeInSeconds % 60;

            UsersArray.push({
                user: snap.key,
                username: client.users.get(snap.key).username,
                TotalSeconds: snap.val().TotalTimeSeconds,
                Hours: Hours,
                Minutes: Minutes,
                TotalTimeFormated: client.message(["ranking", "time_formated", "pt"], Hours, Minutes)
            });
        });

        UsersArray.sort((a, b) => {
            return b.TotalSeconds - a.TotalSeconds
        });

        const { RichEmbed } = require("discord.js");

        let descriptionRankingEmbed = "";
        let idx = 0;

        for (const UserArray of UsersArray) {
            let medal;
            switch (idx) {
                case 0: medal = `:first_place:`
                    break;
                case 1: medal = `:second_place:`
                    break;
                case 2: medal = `:third_place:`
                    break;
                default: medal = `:medal:`
                    break;
            }

            descriptionRankingEmbed += `${medal} [**${UserArray.username}**] - ${UserArray.TotalTimeFormated}\n`;

            idx++;
        }

        message.channel.send(new RichEmbed()
            .setTitle(`Ranking uhul!`)
            .setDescription(descriptionRankingEmbed));


    }
};