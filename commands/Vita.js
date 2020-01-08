module.exports.names = ["vita"];

const { RichEmbed } = require("discord.js");
// const config = require("../config.json");

module.exports.run = async (client, message, args, database) => {

    const channel = message.channel;
    const dmChannel = await message.author.createDM();

    message.delete();

    channel.send(`${message.author}, as instruções para seu pedido de revisão foram enviadas à sua DM.`)
        .then(msg => msg.delete(5000));

    const getNicknameEmbed = new RichEmbed();
    const getServerEmbed = new RichEmbed();
    const getReasonEmbed = new RichEmbed();
    const getRevokeEmbed = new RichEmbed();
    const getConfirmEmbed = new RichEmbed();
    const confirmedEmbed = new RichEmbed();

    let Embeds = [getNicknameEmbed, getServerEmbed, getReasonEmbed, getRevokeEmbed, getConfirmEmbed, confirmedEmbed];

    for (const Embed of Embeds) {
        Embed.setColor("RANDOM");
        Embed.setAuthor("💬 | Revisão", client.user.avatarURL);
        Embed.setFooter("Rede Duel", message.author.avatarURL);
    }

    ReviewInfo = {
        nickname: null,
        servidor: null,
        motivo: null,
        revisao: null
    }

    getNicknameEmbed.setDescription("\nInsira seu nickname utilizado in-game. ``` ```")
    dmChannel.send(getNicknameEmbed)
        .catch(() => message.channel.send(`${message.author}, não consegui enviar mensagem a você, ative sua DM e tente novamente.`))
        .then((dmMessage) => {
            const filter = m => m.author.id === message.author.id;
            const options = { time: 1000 * 50, max: 1 };
            messageCollector(dmChannel, filter, options, (content) => {
                ReviewInfo.nickname = content;

                getServerEmbed.setDescription("\nEm qual servidor você foi punido? \n **Servidores:** RankUP, Factions ou P4Free. ``` ```")
                getServerEmbed.addField(`Revisão em progresso.`, `\`🙆\` Nickname: ${ReviewInfo.nickname}`);
                dmMessage.edit(getServerEmbed);
                ServerCollector();
            });
            
            function ServerCollector() {
                messageCollector(dmChannel, filter, options, (content) => {
                    ReviewInfo.servidor = content;
                    getReasonEmbed.setDescription("\nPor que você foi punido? \n __Insira link para print contendo sua punição.__ ``` ```")
                    getReasonEmbed.addField(`Revisão em progresso.`, `\`🙆\` Nickname: ${ReviewInfo.nickname}\n\`🖥️\` Servidor: ${ReviewInfo.servidor}`);
                    dmMessage.edit(getReasonEmbed);
                    reasonCollector();
                });
            }

            function reasonCollector() {
                messageCollector(dmChannel, filter, options, (content) => {
                    ReviewInfo.motivo = content;
                    getRevokeEmbed.setDescription("⠀\nPor que devemos revogar a punição que lhe foi aplicada? __Insira provas (imagens/vídeos) e argumente porque a punição foi incorreta__. ``` ```")
                    getRevokeEmbed.addField(`Revisão em progresso.`, `\`🙆\` Nickname: ${ReviewInfo.nickname}\n\`🖥️\` Servidor: ${ReviewInfo.servidor}\n\`🔨\` Punição: ${ReviewInfo.motivo}`);
                    dmMessage.edit(getRevokeEmbed);
                    revokeCollector();
                });
            }

            function revokeCollector() {
                messageCollector(dmChannel, filter, options, (content) => {
                    ReviewInfo.revisao = content;
                    getConfirmEmbed.setDescription("⠀\nConfirme seu **pedido de revisão** ``` ```")
                    getConfirmEmbed.addField(`Revisão em progresso.`, `\`🙆\` Nickname: ${ReviewInfo.nickname}\n\`🖥️\` Servidor: ${ReviewInfo.servidor}\n\`🔨\` Punição: ${ReviewInfo.motivo}\n\`📪\` Revisão: ${ReviewInfo.revisao}`);
                    dmMessage.edit(getConfirmEmbed);
                    confirmCollector();
                });
            }

            function confirmCollector() {
                dmChannel.send("a");
            }
            
        });



    ////////////////////////////////////////////////
    function messageCollector(channel, filter, options = {}, callback, finishcallback) {
        const Collector = channel.createMessageCollector(filter, options);
        Collector.on("collect", collected => { callback(collected.content) });
        Collector.on("end", (a, reason) => {
            if (finishcallback) finishcallback(reason)
        });
    }

};