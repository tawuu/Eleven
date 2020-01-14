module.exports.GuildMember = async (guild, member, database) => {

    const ChatXPDatabase = database.ref(`Configs/${guild.id}/MembersChatXP/${member.id}`);

    const ChatXPDatabaseVal = await ChatXPDatabase.once("value");

    XPGenerator = Math.floor(Math.random() * 60) + 20;

    if (ChatXPDatabaseVal.val() === null) {
        let obtained = XPGenerator;
        let total = 400;
        let percent = obtained * 100 / total;
        percent = parseInt(percent, 10);
        ChatXPDatabase.set({
            XP: XPGenerator,
            Level: 1,
            NextLevel: percent
        });
    } else {

        let newLevel = ChatXPDatabaseVal.val().Level;
        let newXP = ChatXPDatabaseVal.val().XP + XPGenerator;
        if (newXP / newLevel > (newLevel * 400)) newLevel = newLevel + 1;

        ////////////////////////
        let obtained = parseInt(newXP / newLevel, 10);
        let total = newLevel * 400;
        let percent = obtained * 100 / total;
        percent = parseInt(percent, 10);

        ////////////////////////


        ChatXPDatabase.update({
            XP: newXP,
            Level: newLevel,
            NextLevel: percent
        });
    }

}