module.exports.GuildMember =  async (guild, member, database) => {

    const nextDailyDatabase = database.ref(`Configs/${guild}/MembersMoney/${member}/nextDaily/`);
    const nextDailyDatabaseVal = await nextDailyDatabase.once("value");
    
    if (nextDailyDatabaseVal.val() === null) return true;
    if (nextDailyDatabaseVal.val() < new Date().getTime()) return true;
    if (nextDailyDatabaseVal.val() > new Date().getTime()) return nextDailyDatabaseVal.val() - new Date().getTime(); 

}

