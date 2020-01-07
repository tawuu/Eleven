module.exports.names = ["chatsystem", "chat"];

module.exports.run = async (client, message, args, database) => {
    if (message.author.id !== message.guild.ownerID) return;

    const channel = message.channel;

    isAvailable = require(`../database/isAvailable.js`);

    isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "chatxp");

    if (!isAvailableGuild) return channel.send(`Seu servidor não possui este serviço.`);

    Commands = [`ADDROLE`];

    if (!args[0]) return channel.send(`Use um dos comandos: \`${Commands.join(",")}\``);

    if (!Commands.includes(args[0].toUpperCase())) return channel.send(`Use um comando válido! Lista: \`${Commands.join(",")}\``);

    switch (args[0].toUpperCase()) {
        case "ADDROLE": addRoleToServiceFromServer();
            break;

        default: SomethingGoesWrong();
            break;
    }

    function addRoleToServiceFromServer() {

        if (!args[1]) {
            channel.send(`Informe o cargo que será adicionado. \`Um coletor de mensagens foi iniciado, caso queira cancelar digite C\``);
            const Collector = channel.createMessageCollector(m => m.author.id === message.author.id);
            Collector.on("collect", collected => {
                if (["c", "cancel", "cancelar"].includes(collected.content.toLowerCase())) {
                    Collector.stop("stopped") 
                    return channel.send(`O coletor foi cancelado.`);
                }
                let roleToAdd;

                if (collected.mentions.roles) roleToAdd = collected.mentions.roles.first();
                else roleToAdd = message.guild.roles.get(collected.content) || message.guild.roles.forEach(r => r.id === collected.content || r.name.toLowerCase() === collected.content.toLowerCase() || r === r);

                if (!roleToAdd) channel.send(`Cargo não encontrado. \`Digite C para cancelar!\``);
                if (roleToAdd) {
                    channel.send(`O cargo ${roleToAdd} foi adicionado ao serviço ChatXP!`);

                    // adicionar no banco de dados e terminar o coletor.
                }
            });

}
    }

    function SomethingGoesWrong() {
        return channel.send(`Algo deu errado.. por favor, tente novamente ou entre em contato com meu desenvolvedor.`);
    }


}
