module.exports.names = ["kick"];

const { RichEmbed } = require("discord.js");

module.exports.run = (client, message, args, database) => {

    const channel = message.channel;

    if (!message.guild.member(client.user.id).hasPermission(["BAN_MEMBERS"])) return channel.send(`Eu não tenho permissão suficiente para utilizar este comando!`);
    if (!message.member.hasPermission(["BAN_MEMBERS"])) return channel.send(`Você não tem permissão suficiente para utilizar este comando!`);

    if (!args[0]) return channel.send(`Insira o usuário que irá ser banido!`);

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

    if (findMember.length <= 0) return channel.send(`Me desculpe mas não consegui encontrar nenhum usuário.`);
    else if (findMember.length > 1) {

        let membersFoundStr = "";
        let membersFoundOpts = new Map();
        for (let [idx, member] of findMember.entries()) {
            membersFoundStr += (`[${++idx}] ${member.userTAG}\n`);
            membersFoundOpts.set(++idx, member.user);
        }

        channel.send(`Encontrei mais de um usuário [\`${findMember.length} usuários\`] escolha um pelo seu número! \`Para cancelar digite CANCELAR\``);
        channel.send(new RichEmbed().setDescription(`\`\`\`${membersFoundStr}\`\`\``));
        channel.createMessageCollector(m => m.author.id === message.author.id && m.content.toLowerCase() === "cancelar" || !isNaN(parseInt(m.content)), { max: 1, time: 15000 })
            .on("collect", collected => {
                if (collected.content.toLowerCase() === "cancelar") return;
                if (parseInt(collected.content) <= findMember.length && parseInt(collected.content) > 0) collectReasonAndKick(membersFoundOpts.get(collected.content));
            });



    } else if (findMember.length === 1 && args[0].length === 4) {
        channel.send(`Encontrei apenas este usuário \`${findMember[0].userTAG}\` deseja expulsá-lo? \`Digite S para confirmar\` / \`Para cancelar digite CANCELAR\` `);
        channel.createMessageCollector(m => m.author.id === message.author.id && ["s", "cancelar"].includes(m.content.toLowerCase()), { max: 1, time: 15000 })
            .on("collect", (collected) => {
                if (collected.content.toLowerCase() === "cancelar") return;
                else if (collected.content.toLowerCase() === "s") collectReasonAndKick(findMember[0].guildMember);
            });
    } else if (findMember.length === 1) collectReasonAndKick(findMember[0].guildMember);


    function collectReasonAndKick(member) {
        channel.send(`Digite o motivo da expulsão: \`Para deixar em branco digite C\` / \`Para cancelar digite CANCELAR\``)
        channel.createMessageCollector(m => m.author.id === message.author.id && m.content.length > 1)
            .on("collect", collected => {
                if (collected.content.toLowerCase() === "c") kickMember("Razão não informada.");
                else if (collected.content.toLowerCase() === "cancelar") return
                else kickMember(collected.content);
            });

        function kickMember(reason) {
            member.kick(reason)
                .then(() => channel.send(`O usuário foi expulso com sucesso!`))
                .catch((err) => channel.send(`Me desculpe, mas não consegui expulsar este usuário.`));
        }

    }

}