module.exports.names = ["warn"];


module.exports.run = async (client, message, args, database) => {

    const channel = message.channel;

    let member = message.mentions.members.first();
    if (!member) return channel.send(client.message(["missing", "needs_member", "pt"]));

    const warnsMemberDatabase = database.ref(`Configs/${message.guild.id}/Moderation/${member.id}/warns`);
    const warnsMemberDatabaseVal = await warnsMemberDatabase.once("value");

    if (args[0].toLowerCase() === "add") addWarn();
    if (args[0].toLowerCase() === "count") countWarn();


    function addWarn() {

        if (!message.member.hasPermission("KICK_MEMBERS")) return channel.send(client.message(["missing", "missing_member_permissions", "pt"]));
        if (!message.guild.member(client.user.id).hasPermission("KICK_MEMBERS")) return channel.send(client.message(["missing", "missing_me_permissions", "pt"]));

        let reason = args.slice(2).join(" ");
        if (!reason) return channel.send(client.message(["warn", "needs_reason", "pt"]));

        let warnsCount;

        if (warnsMemberDatabaseVal.val() === null) {
            warnsCount = 1;
            warnsMemberDatabase.set({
                count: warnsCount,
                reasons: [reason]
            })

        } else {
            warnsCount = warnsMemberDatabaseVal.val().count + 1;
            reasons = warnsMemberDatabaseVal.val().reasons.push(reason);
            warnsMemberDatabase.update({
                count: warnsCount,
                reasons: reasons
            })
        }
        channel.send(client.message(["warn", "member_warned", "pt"], member, warnsCount, reason));
    }

    function countWarn() {
        if (warnsMemberDatabaseVal.val() === null) {
            channel.send(client.message(["warn", "member_without_warns", "pt"], member))
        } else {
            channel.send(client.message(["warn", "member_with_warns", "pt"], member, warnsMemberDatabaseVal.val().count));
        }
    }


}