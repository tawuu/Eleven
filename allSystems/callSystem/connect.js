module.exports = async (MemberInfo, database) => {

    index = require("../../index.js")
    isAvailable = index.require("isAvailable.js");

    isAvailableGuild = await isAvailable.Guild(MemberInfo.guildID, database, "CallXP");

    if (isAvailableGuild === false) return;

    isAvailableRole = await isAvailable.GuildMemberRole(MemberInfo.guildID, MemberInfo.userID, database, "CallXP");

    if (isAvailableRole === false) return;

    const UserCallDatabase = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}`);

    const isMuted = MemberInfo.selfMute || MemberInfo.serverMute;

    if (isMuted) {
        UserCallDatabase.set({
            joinedAt: new Date().getTime(),
            unavailableTime: 0,
            unavailableSince: new Date().getTime(),
            unavailableFor: {
                Muted: true,
                Aloned: false,
                Points: 1
            }
        });
    } else {
        UserCallDatabase.set({
            joinedAt: new Date().getTime(),
            unavailableTime: 0,
            unavailableSince: 0,
            unavailableFor: {
                Muted: false,
                Aloned: false,
                Points: 0
            }
        });
    }

 
}