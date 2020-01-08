const Discord = require("discord.js");
const c = require("../config.json");
exports.run = async (client, message, args) => {
    await message.author.createDM;

    const vv = client.emojis.find(emoji => emoji.name === "Sim");
    const xx = client.emojis.find(emoji => emoji.name === "No");
    message.delete();
    message.channel
        .send(
            `${message.author}, as instruçoes para seu pedido de revisão foram enviadas a sua DM.`
        )
        .then(msg => msg.delete(5000));

    const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor("💬 | Revisão", client.user.avatarURL)
        .setDescription("⠀\nInsira seu nickname utilizado in-game. ``` ```")
        .setFooter("Rede Duel", message.author.avatarURL);

    message.author
        .send(embed)
        .catch(err =>
            message.channel.send(
                `${message.author}, não consegui enviar mensagem a você, ative sua DM e tente novamente.`
            )
        )
        .then(async msg => {
            var collector = message.author.dmChannel.createMessageCollector(
                a => a.author.id == message.author.id,
                {
                    time: 1000 * 50,
                    max: 1
                }
            );
            collector.on("collect", a => {
                var nome = a.content;

                const embeda = new Discord.RichEmbed()
                    .setColor("RANDOM")
                    .setAuthor("💬 | Revisão", client.user.avatarURL)
                    .setDescription(
                        "⠀\nEm qual servidor você foi punido? \n **Servidores:** RankUP, Factions ou P4Free. ``` ```"
                    )
                    .addField(
                        "Revisão em progresso.",
                        `
\`🙆\` Nickname: ${nome}`
                    )
                    .setFooter("Rede Duel", message.author.avatarURL);
                msg.edit(embeda);
                var collector = message.author.dmChannel.createMessageCollector(
                    b => b.author.id == message.author.id,
                    {
                        time: 1000 * 50,
                        max: 1
                    }
                );
                collector.on("collect", b => {
                    var depend = b.content;

                    const embedb = new Discord.RichEmbed()
                        .setColor("RANDOM")
                        .setAuthor("💬 | Revisão", client.user.avatarURL)
                        .setDescription(
                            "⠀\nPor que você foi punido? \n __Insira link para print contendo sua punição.__ ``` ```"
                        )
                        .addField(
                            "Revisão em progresso.",
                            `
\`🙆\` Nickname: ${nome}
\`🖥️\` Servidor: ${depend}`
                        )
                        .setFooter("Rede Duel", message.author.avatarURL);
                    msg.edit(embedb);
                    var collector = message.author.dmChannel.createMessageCollector(
                        c => c.author.id == message.author.id,
                        {
                            time: 1000 * 50,
                            max: 1
                        }
                    );
                    collector.on("collect", c => {
                        var resumo = c.content;

                        const embedc = new Discord.RichEmbed()
                            .setColor("RANDOM")
                            .setAuthor("💬 | Revisão", client.user.avatarURL)
                            .setDescription(
                                "⠀\nPor que devemos revogar a punição que lhe foi aplicada? __Insira provas (imagens/vídeos) e argumente porque a punição foi incorreta__. ``` ```"
                            )
                            .addField(
                                "Revisão em progresso.",
                                `
\`🙆\` Nickname: ${nome}
\`🖥️\` Servidor: ${depend}
\`🔨\` Punição: ${resumo}`
                            )
                            .setFooter("Rede Duel", message.author.avatarURL);
                        msg.edit(embedc);

                        var collector = message.author.dmChannel.createMessageCollector(
                            d => d.author.id == message.author.id,
                            {
                                time: 1000 * 50,
                                max: 1
                            }
                        );
                        collector.on("collect", d => {
                            var valor = d.content;

                            const embedd = new Discord.RichEmbed()
                                .setColor("RANDOM")
                                .setAuthor("💬 | Revisão", client.user.avatarURL)
                                .setDescription("⠀\nConfirme seu **pedido de revisão** ``` ```")
                                .addField(
                                    "Pedido em confirmação.",
                                    `
\`🙆\` Nickname: ${nome}
\`🖥️\` Servidor: ${depend}
\`🔨\` Motivo: ${resumo}
\`📪\` Revisão: ${valor}`
                                )
                                .setFooter("Rede Duel", message.author.avatarURL);
                            msg.edit(embedd).then(async r => {
                                await msg.react(vv);
                                await msg.react(xx);

                                let s = (r, u) =>
                                    r.emoji.name === vv.name && u.id == message.author.id;
                                let n = (r, u) =>
                                    r.emoji.name === xx.name && u.id == message.author.id;

                                let sL = msg.createReactionCollector(s, {
                                    time: 120000
                                });
                                let nL = msg.createReactionCollector(n, {
                                    time: 120000
                                });

                                sL.on("collect", async r => {
                                    msg.reactions.map(re => re.remove(client.user));
                                    const act = new Discord.RichEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor("💬 | Revisão", client.user.avatarURL)
                                        .setDescription("⠀\nSeu pedido foi confirmado... ``` ```")
                                        .addField(
                                            "Revisão enviada.",
                                            `
\`🙆\` Nickname: ${nome}
\`🖥️\` Servidor: ${depend}
\`🔨\` Motivo: ${resumo}
\`📪\` Revisão: ${valor}`
                                        )
                                        .setFooter("Rede Duel", message.author.avatarURL);
                                    msg.edit(act);

                                    const pedido = new Discord.RichEmbed()
                                        .setColor("RANDOM")
                                        .setAuthor("💬 | Revisão", client.user.avatarURL)
                                        .setDescription(
                                            `⠀\nPedido de: \`${message.author.tag}\` \`\`\` \`\`\``
                                        )
                                        .addField(
                                            "Informações do pedido:",
                                            `
\`🙆\` Nickname: ${nome}
\`🖥️\` Servidor: ${depend}
\`🔨\` Motivo: ${resumo}
\`📪\` Revisão: ${valor}`
                                        )
                                        .setTimestamp()
                                        .setFooter(
                                            "Analize com calma a revisão e aceite ou negue o pedido reagindo abaixo.",
                                            message.author.avatarURL
                                        );
                                    client.channels.get("664171374113325061").send(pedido)
                                }).then(async r => {
                                    // INICIO
                                    await msg.react(vv);
                                    await msg.react(xx);

                                    let sim = (r, u) =>
                                        r.emoji.name === vv.name && u.id == message.author.id;
                                    let nao = (r, u) =>
                                        r.emoji.name === xx.name && u.id == message.author.id;

                                    let aceitarL = msg.createReactionCollector(sim, {
                                        time: 120000
                                    });
                                    let negarL = msg.createReactionCollector(nao, {
                                        time: 120000
                                    })

                                    aceitarL.on("collect", async r => {
                                        msg.reactions.map(re => re.remove(client.user));
                                        const aceitar = new Discord.RichEmbed()
                                            .setColor("RANDOM")
                                            .setAuthor("💬 | Revisão", client.user.avatarURL)
                                            .setDescription("⠀\nRevisão aceita... ``` ```")
                                            .addField(
                                                "Revisão:",
                                                `
                    \`🙆\` Nickname: ${nome}
                    \`🖥️\` Servidor: ${depend}
                    \`🔨\` Motivo: ${resumo}
                    \`📪\` Revisão: ${valor}`
                                            )
                                            .addField("Revisão aceita por:", reaction.users)
                                            .setFooter("Rede Duel", message.author.avatarURL);
                                        client.channels.get("664183982031765505").send(aceitar);

                                    })

                                    negarL.on("collect", async r => {
                                        msg.reactions.map(re => re.remove(client.user));
                                        const act = new Discord.RichEmbed()
                                            .setColor("RANDOM")
                                            .setAuthor("💬 | Revisão", client.user.avatarURL)
                                            .setDescription("⠀\nRevisão negada... ``` ```")
                                            .addField(
                                                "Revisão:",
                                                `
                        \`🙆\` Nickname: ${nome}
                        \`🖥️\` Servidor: ${depend}
                        \`🔨\` Motivo: ${resumo}
                        \`📪\` Revisão: ${valor}`
                                            )
                                            .addField("Revisão negada por:", reaction.users)
                                            .setFooter("Rede Duel", message.author.avatarURL);
                                        msg.edit(act);
                                    })
                                })
                            })
                        })
                        nL.on("collect", async r => {
                            msg.reactions.map(re => re.remove(client.user));
                            const act = new Discord.RichEmbed()
                                .setColor("RANDOM")
                                .setAuthor("💬 | Revisão", client.user.avatarURL)
                                .setDescription("⠀\nSua revisão foi cancelada... ``` ```")
                                .setFooter("Rede Duel", message.author.avatarURL);
                            msg.edit(act);
                        });
                    });
                });
            });
        });
});
    });
};

exports.help = {
    name: "revisao",
    aliases: ["revisar"]
};