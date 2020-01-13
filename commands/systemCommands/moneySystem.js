module.exports.names = ["moneysystem", "money"];

module.exports.run = async (client, message, args, database) => {
    if (message.author.id !== message.guild.ownerID) return;

    const channel = message.channel;

    isAvailable = require(`../../database/isAvailable.js`);

    isAvailableGuild = await isAvailable.Guild(message.guild.id, database, "money");

    if (!isAvailableGuild) return channel.send(`Seu servidor não possui este serviço.`);

    Commands = [`ADDROLE`, 'REMOVEROLE'];

    if (!args[0]) return channel.send(`Use um dos comandos: \`${Commands.join(",")}\``);

    if (!Commands.includes(args[0].toUpperCase())) return channel.send(`Use um comando válido! Lista: \`${Commands.join(",")}\``);

    switch (args[0].toUpperCase()) {
        case "ADDROLE": addRoleToServiceFromServer();
            break;

        case "REMOVEROLE": removeRoleToServiceFromServer();
            break;

        default: SomethingGoesWrong();
            break;
    }

    function addRoleToServiceFromServer() {

        if (!args.slice(1).join(" ")) {
            channel.send(`Informe o cargo que será adicionado. \`Um coletor de mensagens foi iniciado, caso queira cancelar digite C\``);
            const Collector = channel.createMessageCollector(m => m.author.id === message.author.id);

            Collector.on("collect", collected => {
                if (["c", "cancel", "cancelar"].includes(collected.content.toLowerCase())) {
                    Collector.stop("stopped")
                    return channel.send(`O coletor foi cancelado.`);
                };

                let roleToAdd;
                let everyone = false;
                if (["everyone", "todos"].includes(collected.content.toLowerCase())) {
                    roleToAdd = message.guild.roles.find(r => r.name === "@everyone");
                    everyone = true;
                };

                if (!everyone && collected.mentions.roles) roleToAdd = collected.mentions.roles.first();
                else if (!everyone) roleToAdd = message.guild.roles.get(collected.content) || message.guild.roles.forEach(r => r.id === collected.content || r.name.toLowerCase() === collected.content.toLowerCase() || r === r);

                if (!roleToAdd) channel.send(`Cargo não encontrado. \`Digite C para cancelar!\``);
                else return AddNewRoleToService("MembersMoney", roleToAdd)
                    .then(() => {
                        Collector.stop();
                        return channel.send(`O cargo ${roleToAdd} foi salvo com sucesso!`);
                    })
                    .catch((err) => {
                        if (err.message === "already exists") channel.send(`Este cargo já está salvo. \`Digite C para cancelar ou insira um cargo diferente!\``);
                        else channel.send(`Algo deu errado, consulte meu desenvolvedor ou tente novamente!`);
                    });

            });

        } else {

            roleToAdd = args.slice(1).join(" ");

            if (["everyone", "todos"].includes(roleToAdd.toLowerCase())) {
                roleToAdd = message.guild.roles.find(c => c.name === "@everyone");
            } else {
                roleToAdd = message.mentions.roles.first() || message.guild.roles.find(r => r.id === roleToAdd || r.name.toLowerCase() === roleToAdd.toLowerCase()) || message.guild.roles.get(roleToAdd);
            };

            if (!roleToAdd) return channel.send(`Cargo não encontrado, por favor tente novamente.`);
            else AddNewRoleToService("MembersMoney", roleToAdd)
                .then(() => {
                    return channel.send(`O cargo ${roleToAdd} foi salvo com sucesso!`)
                })
                .catch(err => {
                    if (err.message === "already exists") return channel.send(`O cargo ${roleToAdd} já está salvo.`);
                    else return channel.send(`Algo deu errado... por favor consulte meu desenvolvedor ou tente novamente!`);
                });
        }
    }

    function removeRoleToServiceFromServer() {
        if (!args.slice(1).join(" ")) {
            channel.send(`Informe o cargo qeu será removido \`Um coletor de mensagens foi iniciado, caso queira cancelar digite C\``);

            const Collector = channel.createMessageCollector(m => m.author.id === message.author.id);
            Collector.on("collect", collected => {
                if (["c", "cancel", "cancelar"].includes(collected.content.toLowerCase())) {
                    Collector.stop("stopped")
                    return channel.send(`O coletor foi cancelado.`);
                }

                let roleToRemove;
                if (['everyone', 'todos'].includes(collected.content.toLowerCase())) {
                    roleToRemove = message.guild.roles.find(r => r.name === "@everyone");
                }

                if (!roleToRemove) roleToRemove = collected.mentions.roles.first() || message.guild.roles.get(collected.content) || message.guild.roles.find(r => r.id === collected.content || r.name.toLowerCase() === collected.content.toLowerCase() || r === collected.content);

                if (!roleToRemove) channel.send(`Cargo não encontrado. \`Digite C para cancelar ou tente novamente!\``);
                else return removeRoleFromService("MembersMoney", roleToRemove)
                    .then(() => {
                        Collector.stop();
                        return channel.send(`O cargo ${roleToRemove} foi removido com sucesso!`);
                    })
                    .catch((err) => {
                        if (err.message === "role not saved") channel.send(`Este cargo não está salvo para ser removido. \`Digite C para cancelar!\``);
                        else if (err.message === "any role detected") {
                            Collector.stop();
                            channel.send(`Este serviço não contem cargos salvos. \`Cancelando coletor.\``);
                        }
                        else channel.send(`Algo deu errado, consulte meu desenvolvedor ou tente novamente!`);
                    });

            });
        } else {
            roleToRemove = args.slice(1).join(" ");
            if (["everyone", "todos"].includes(roleToRemove.toLowerCase())) {
                roleToRemove = message.guild.roles.find(r => r.name === "@everyone");
            } else {
                roleToRemove = message.mentions.roles.first() || message.guild.roles.get(roleToRemove) || message.guild.roles.find(r => r.name.toLowerCase() === roleToRemove.toLowerCase());
            }

            if (!roleToRemove) return channel.send(`Cargo não encontrado, por favor tente novamente.`);
            else removeRoleFromService("MembersMoney", roleToRemove)
                .then(() => {
                    return channel.send(`O cargo ${roleToRemove} foi removido com sucesso!`);
                })
                .catch((err) => {
                    if (err.message === "role not saved") channel.send(`Este cargo não está salvo para ser removido. \`Digite C para cancelar!\``);
                    else if (err.message === "any role detected") channel.send(`Este serviço não contem cargos salvos.`);
                    else {
                        console.log(err);
                        channel.send(`Algo deu errado, consulte meu desenvolvedor ou tente novamente!`);
                    }
                });
        }
    }

    async function AddNewRoleToService(service, role) {
        const UpdatingNewRoleDatabase = database.ref(`Configs/${message.guild.id}/${service}/AvailableRoles`);
        const UpdatingNewRoleDatabaseVal = await UpdatingNewRoleDatabase.once("value");

        if (UpdatingNewRoleDatabaseVal.val() === null) {
            UpdatingNewRoleDatabase.set(role.id);
            return true;
        } else {
            RolesAvailable = UpdatingNewRoleDatabaseVal.val();
            RolesToUpdate = RolesAvailable.includes(",") ? RolesAvailable.split(",") : [RolesAvailable];

            if (RolesToUpdate.includes(role.id)) throw new Error("already exists");
            else {
                RolesToUpdate.push(role.id);

                UpdatingNewRoleDatabase.set(RolesToUpdate.join(","));
                return true;
            }
        }

    }

    async function removeRoleFromService(service, role) {
        const UpdatingNewRoleDatabase = database.ref(`Configs/${message.guild.id}/${service}/AvailableRoles`);
        const UpdatingNewRoleDatabaseVal = await UpdatingNewRoleDatabase.once("value");

        let AvailableRoles;

        if (UpdatingNewRoleDatabaseVal.val() === null) throw new Error(`any role detected`);
        else AvailableRoles = UpdatingNewRoleDatabaseVal.val();

        AvailableRoles = AvailableRoles.includes(",") ? AvailableRoles.split(",") : [AvailableRoles];

        if (!AvailableRoles.includes(role.id)) throw new Error("role not saved");

        UpdatedRoles = [];

        AvailableRoles.forEach(AvailableRole => {
            if (AvailableRole === role.id) return;
            else UpdatedRoles.push(AvailableRole);
        })

        const SetNewAvailableRole = database.ref(`Configs/${message.guild.id}/${service}/`);
        if (UpdatedRoles.length === 0) SetNewAvailableRole.set({ AvailableRoles: null })
        else SetNewAvailableRole.set({ AvailableRoles: null });


        return true;
    }

    function SomethingGoesWrong() {
        return channel.send(`Algo deu errado.. por favor, tente novamente ou entre em contato com meu desenvolvedor.`);
    }

}