module.exports = (client, database) => {

    setTimeout(async () => {

        client.guilds.forEach(async Guild => {

            isAvailable = require(`../database/isAvailable.js`);

            isAvailableGuild = await isAvailable.Guild(Guild.id, database, "CallXP");

            if (isAvailableGuild === false) return;

            Guild.channels.forEach(async channel => {
                if (channel.type !== "voice") return;

                if (channel.members.size === 0) return;

                MembersAtChannel = [];

                channel.members.forEach(member => {
                    if (member.bot) return;
                    else {
                        MembersAtChannel.push(member);
                    }
                });

                let MemberInfo = {
                    guildID: Guild.id
                };

                if (MembersAtChannel.length === 0) return;


                else if (MembersAtChannel.length === 1) {

                    MemberInfo.userID = MembersAtChannel[0].id;

                    isAvailableRole = await isAvailable.GuildMemberRole(MemberInfo.guildID, MemberInfo.userID, database, "CallXP");

                    if (isAvailableRole === false) return;

                    return require(`./setUserAsUnavailable.js`)(database, MemberInfo, "alone");

                } else if (MembersAtChannel.length > 1) {
                    MembersAtChannel.forEach(MemberAtChannel => {
                        MemberInfo.userID = MemberAtChannel.id;
                        return require(`./setUserAsAvailable.js`)(database, MemberInfo, "alone");
                    });
                }

            });

        });

    }, 500);
}