 module.exports.names = ["kick"];

const { RichEmbed } = require("discord.js");

module.exports.run = (client, message, args, database) => {

    const channel = message.channel;

    if (!message.member.hasPermission(["BAN_MEMBERS"])) return channel.send(client.message(["missing", "missing_member_permission", "pt"]));
    if (!message.guild.member(client.user.id).hasPermission(["KICK_MEMBERS"])) return channel.send(client.message(["missing", "missing_me_permission", "pt"]));

    if (!args[0]) return channel.send(client.message(["missing", "needs_member", "pt"]));

    if (message.mentions.members.first()) return collectReasonAndKick(message.mentions.members.first())
    
    let findMember = [];

    argsLowerCase = args.join(" ").toLowerCase();

    message.guild.members.forEach(member => {

        const pushMember = () => findMember.push({ userTAG: member.user.tag, guildMember: member, user: member.user });

        if (member.user.id === argsLowerCase) pushMember();
        else if (member.user.username.toLowerCase() === argsLowerCase) pushMember();
        else if (member.user.tag === args[0]) pushMember();
        else if (member.user.discriminator === args[0]) pushMember();
        else if (`${member.user.username.toLowerCase()}#${member.user.discriminator}` === argsLowerCase) pushMember();
        else if (`${member.user.username.toLowerCase()}${member.user.discriminator}` === argsLowerCase) pushMember();

    });

    if (findMember.length <= 0) return channel.send(client.message(["missing", "member_not_found", "pt"]));
    else if (findMember.length > 1) {

        let membersFoundStr = "";
        let membersFoundOpts = new Map();
        for (let [idx, member] of findMember.entries()) {
            membersFoundStr += (`[${++idx}] ${member.userTAG}\n`);
            membersFoundOpts.set(++idx, member.user);
        }

        channel.send(client.message["kick", "find_more_than_one_user", "pt"], findMember.length);
        channel.send(new RichEmbed().setDescription(`\`\`\`${membersFoundStr}\`\`\``));
        channel.createMessageCollector(m => m.author.id === message.author.id && ["cancelar", "cancel"].includes(m.content.toLowerCase()) || !isNaN(parseInt(m.content)), { max: 1, time: 15000 })
            .on("collect", collected => {
                if (["cancel", "cancelar"].includes(collected.content.toLowerCase())) return;
                if (parseInt(collected.content) <= findMember.length && parseInt(collected.content) > 0) collectReasonAndKick(membersFoundOpts.get(collected.content));
            });



    } else if (findMember.length === 1 && args[0].length === 4) {
        channel.send(client.message(["kick", "find_one_user", "pt"], findMember[0].userTAG));
        channel.createMessageCollector(m => m.author.id === message.author.id && ["s", "cancelar"].includes(m.content.toLowerCase()), { max: 1, time: 15000 })
            .on("collect", (collected) => {
                if (["cancel", "cancelar"].includes(collected.content.toLowerCase())) return;
                else if (collected.content.toLowerCase() === "s") collectReasonAndKick(findMember[0].guildMember);
            });
    } else if (findMember.length === 1) collectReasonAndKick(findMember[0].guildMember);


    function collectReasonAndKick(member) {
        channel.send(client.message(["kick", "collect_reason", "pt"]));
        channel.createMessageCollector(m => m.author.id === message.author.id && m.content.length > 1)
            .on("collect", collected => {
                if (collected.content.toLowerCase() === "c") kickMember(client.message(["kick", "collect_reason", "pt"]));
                else if (["cancelar", "cancel"].includes(collected.content.toLowerCase())) return
                else kickMember(collected.content);
            });

        function kickMember(reason) {
            member.kick(reason)
                .then(() => channel.send(client.message(["kick", "success", "pt"])))
                .catch((err) => channel.send(client.message(["kick", "unsuccess", "pt"])));
        }

    }

}