module.exports = async (MemberInfo, database) => {

  
    index = require("../../index.js")
    isAvailable = index.require("isAvailable.js");

    isAvailableGuild = await isAvailable.Guild(MemberInfo.guildID, database, "CallXP");

    if (isAvailableGuild === false) return;

    isAvailableRole = await isAvailable.GuildMemberRole(MemberInfo.guildID, MemberInfo.userID, database, "CallXP");

    if (isAvailableRole === false) return;

    const UserCallDatabase = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}`);

    const UserCallDatabaseVal = await UserCallDatabase.once("value");

    if (UserCallDatabaseVal.val() === null) return;

    const mutedAt = UserCallDatabaseVal.val().mutedAt;
    const nowTime = new Date().getTime();

    TotalSecondsMuted = nowTime % mutedAt;
    TotalSecondsMuted = parseInt(TotalSecondsMuted / 1000, 10);

    UserCallDatabase.update({
        mutedAt: 0,
        isMuted: false,
        mutedTime: UserCallDatabaseVal.val().mutedTime + TotalSecondsMuted
    });

}