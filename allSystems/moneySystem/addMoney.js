module.exports.AddMoney = async (guildID, userID, value, database) => {
    const MemberMoneyDatabase = database.ref(`Configs/${guildID}/MembersMoney/${userID}/`);
    const MemberMoneyDatabaseVal = await MemberMoneyDatabase.once("value");

    const nextDaily = new Date().getTime() + 86400000;

    if (MemberMoneyDatabaseVal.val() === null) {
        MemberMoneyDatabase.set({
            money: value,
            nextDaily: nextDaily
        });
        return value;
    } else {
        const MemberMoney = MemberMoneyDatabaseVal.val().money;
        const nextMoney = parseInt(MemberMoney) + parseInt(value)
        MemberMoneyDatabase.update({
            money: nextMoney,
            nextDaily: nextDaily
        });
        return nextMoney;
    }

};