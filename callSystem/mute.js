module.exports = async (MemberInfo, database) => {

    isAvailable = require(`../database/isAvailable.js`);

    isAvailableGuild = await isAvailable.Guild(MemberInfo.guildID, database, "CallXP");

    if (isAvailableGuild === false) return;

    isAvailableRole = await isAvailable.GuildMemberRole(MemberInfo.guildID, MemberInfo.userID, database, "CallXP");

    if (isAvailableRole === false) return;

    const UserCallDatabase = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}`);

    const UserCallDatabaseVal = await UserCallDatabase.once("value");

    if (UserCallDatabaseVal.val() === null) return;

    UserCallDatabase.update({
        mutedAt: new Date().getTime(),
        isMuted: true
    });




}