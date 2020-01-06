const { appendFileSync } = require("fs");
const moment = require("moment");

module.exports = async (oldMember, newMember, database) => {

    isAvailable = require(`../database/isAvailable.js`);

    isAvailableGuild = await isAvailable.Guild(oldMember.guildID, database, "CallXP");

    if (isAvailableGuild === false) return;

    isAvailableRole = await isAvailable.GuildMemberRole(oldMember.guildID, oldMember.userID, database, "CallXP");

    if (isAvailableRole === false) return;


    ///////////////// WORK WITH DISCONNECTED USER IN CALL ///////////////////////////
    const UserCallDatabase = database.ref(`Configs/${oldMember.guildID}/MembersCallXP/${newMember.userID}`);

    const UserCallDatabaseVal = await UserCallDatabase.once("value");

    if (UserCallDatabaseVal.val() == null) return;

    let joinedAt = UserCallDatabaseVal.val().joinedAt;

    let unavailableTime = UserCallDatabaseVal.val().unavailableTime;
    let unavailableSince = UserCallDatabaseVal.val().unavailableSince;

    if (unavailableSince > 0) {
        let MilisecondsUnavailabled = new Date().getTime() % unavailableSince;
        let SecondsUnavailabled = parseInt(MilisecondsUnavailabled / 1000, 10);
        unavailableTime = unavailableTime + SecondsUnavailabled
    }

    UserCallDatabase.set({});

    let MilisecondsConnected = new Date().getTime() % joinedAt;

    SecondsConnected = parseInt(MilisecondsConnected / 1000, 10);

    TimeConnected = SecondsConnected - unavailableTime;

    if (TimeConnected < 10) return;

    let TotalSeconds = TimeConnected;

    Hours = Math.floor(TotalSeconds / 3600);
    TotalSeconds %= 3600;
    Minutes = Math.floor(TotalSeconds / 60);
    Seconds = TotalSeconds % 60;

    str = oldMember.guildID + "-" + moment().format("L").replace(/\//g, "-");

    appendFileSync(`./callSystem/logs/${str}.log`, `[${newMember.userID}] - ${Hours}:${Minutes}:${Seconds} in call\n`);

    //////////// SAVE MAX TIME //////////////////////

    const MaxUserCallTimeDatabase = database.ref(`Configs/${newMember.guildID}/MembersCallXP/TotalTime/${newMember.userID}`);

    const MaxUserCallTimeDatabaseVal = await MaxUserCallTimeDatabase.once("value");

    if (MaxUserCallTimeDatabaseVal.val() === null) {
        MaxUserCallTimeDatabase.set({
            TotalTimeSeconds: TimeConnected
        });
    } else {
        MaxUserCallTimeDatabase.update({
            TotalTimeSeconds: MaxUserCallTimeDatabaseVal.val().TotalTimeSeconds + TimeConnected
        });
    };

};
