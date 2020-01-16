module.exports.names = ["shop", "loja"];


module.exports.run = (client, message, args, database) => {

    const channel = message.channel;

    let commands = {
        pt: ["criar", "adicionar", "deletar", "atualizar"],
        en: ["create", "add", "delete", "update"]
    }
    if (!args[0]) return channel.send(client.message(["shop", "missing_command", "pt"], commands.pt.join(" / ")));

    if (!commands.pt.includes(args[0])) return channel.send(client.message(["shop", "unavailable_command", "pt"], commands.pt.join(" / ")))

    switch (args[0].toLowerCase()) {
        case "criar": createShop();
            break;
        case "create": createShop();
            break;

    }

    function createShop() {
        const filter = m => m.author.id === message.author.id;

        let id = 1;
        let collector;

        Shop = {
            name: null,
            coin_name: null,
            coin_icon: null
        }


        function MessageCollector(filter, channel, data) {
            channel.send(data[0].msg());
            collector = channel.createMessageCollector(filter).on("collect", collected => {
                channel.send(data[id].msg(collected.content));
                id++;


            });
        }

        MessageCollector(filter, channel, [
            {
                msg: function () {
                    return client.message(["shop", "collect_name", "pt"], 24)
                }
            }, {
                msg: function (content) {
                    Shop.name = content;
                    return client.message(["shop", "name_confirm", "pt"], content, content);
                }
            }, {
                msg: function (content) {
                    if (Shop.name.toLowerCase() === content.toLowerCase()) {
                        return client.message(["shop", "name_confirmed/collect_coin", "pt"], 5);
                    } else {
                        id--;
                        return client.message(["shop", "name_unconfirmed", "pt"]);
                    }
                }
            }, {
                msg: function (content) {
                    Shop.coin_name = content;
                    return client.message(["shop", "confirm_coin_name", "pt"], content, content);
                }
            }, {
                msg: function (content) {
                    if (Shop.coin_name.toLowerCase() === content.toLowerCase()) {
                        return client.message(["shop", "coin_name_confirmed/collect_coin_icon", "pt"]);
                    } else {
                        id--;
                        return client.message(["shop", "unconfirmed_coin_name", "pt"]);
                    }
                }
            }
        ]);


    }


}