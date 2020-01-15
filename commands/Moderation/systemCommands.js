module.exports.names = ["chatsystem", "chat", "callsystem", "call", "moneysystem", "money"];

module.exports.run = async (client, message, args, database) => {
    if (message.author.id !== message.guild.ownerID) return;

    const channel = message.channel;

    let serviceCalled;

    switch (message.content.toLowerCase().split(" ")[0].slice(1)) {
        case "chatsystem": serviceCalled = ["chatxp", "MembersChatXP"];
            break;
        case "chat": serviceCalled = ["chatxp", "MembersChatXP"];
            break;
        case "callsystem": serviceCalled = ["callxp", "MembersCallXP"];
            break;
        case "call": serviceCalled = ["callxp", "MembersCallXP"];
            break;
        case "moneysystem": serviceCalled = ["money", "MembersMoney"];
            break;
        case "money": serviceCalled = ["money", "MembersMoney"];
            break;
    }

    isAvailable = client.require(`isAvailable.js`);

    isAvailableGuild = await isAvailable.Guild(message.guild.id, database, serviceCalled[0]);

    if (!isAvailableGuild) return channel.send(client.message(["service", "unavailable", "pt"], serviceCalled[0]));

    Commands = [`ADDROLE`, 'REMOVEROLE'];

    if (!args[0]) return channel.send(client.message(["service", "commands_list", "pt"], Commands.join(",")));

    if (!Commands.includes(args[0].toUpperCase())) return channel.send(client.message(["service", "commands_list", "pt"], Commands.join(",")));

    if (args[0].toUpperCase() == "ADDROLE") return addRoleToServiceFromServer();
    else if (args[0].toUpperCase() == "REMOVEROLE") return removeRoleToServiceFromServer();
    else return SomethingGoesWrong();

    function addRoleToServiceFromServer() {

        if (!args.slice(1).join(" ")) {
            channel.send(client.message(["service", "addrole_collector", "pt"]));
            const Collector = channel.createMessageCollector(m => m.author.id === message.author.id);

            Collector.on("collect", collected => {
                if ([client.message(["collector_option", "cancel", "pt"])].includes(collected.content.toLowerCase())) {
                    Collector.stop("stopped")
                    return channel.send(client.message(["service", "collector_canceled", "pt"]));
                };

                let roleToAdd;
                let everyone = false;
                if (["everyone", "todos"].includes(collected.content.toLowerCase())) {
                    roleToAdd = message.guild.roles.find(r => r.name === "@everyone");
                    everyone = true;
                };

                if (!everyone && collected.mentions.roles) roleToAdd = collected.mentions.roles.first();
                else if (!everyone) roleToAdd = message.guild.roles.get(collected.content) || message.guild.roles.forEach(r => r.id === collected.content || r.name.toLowerCase() === collected.content.toLowerCase() || r === r);

                if (!roleToAdd) channel.send(client.message(["service", "role_not_found", "pt"]));
                else return AddNewRoleToService(serviceCalled[1], roleToAdd)
                    .then(() => {
                        Collector.stop();
                        return channel.send(client.message(["service", "role_saved", "pt"], roleToAdd));
                    })
                    .catch((err) => {
                        if (err.message === "already exists") channel.send(client.message["service", "role_already_saved", "pt"]);
                        else channel.send(client.message["service", "role_err", "pt"]);
                    });

            });

        } else {

            roleToAdd = args.slice(1).join(" ");

            if (["everyone", "todos"].includes(roleToAdd.toLowerCase())) {
                roleToAdd = message.guild.roles.find(c => c.name === "@everyone");
            } else {
                roleToAdd = message.mentions.roles.first() || message.guild.roles.find(r => r.id === roleToAdd || r.name.toLowerCase() === roleToAdd.toLowerCase()) || message.guild.roles.get(roleToAdd);
            };

            if (!roleToAdd) return channel.send(client.message(["service", "role_not_found_2", "pt"]));
            else return AddNewRoleToService(serviceCalled[1], roleToAdd)
                .then(() => {
                    return channel.send(client.message(["service", "role_saved", "pt"], roleToAdd));
                })
                .catch(err => {
                    if (err.message === "already exists") channel.send(client.message["service", "role_already_saved", "pt"]);
                    else channel.send(client.message["service", "role_err", "pt"]);
                });
        }
    }

    function removeRoleToServiceFromServer() {
        if (!args.slice(1).join(" ")) {
            channel.send(client.message(["service", "removerole_collector", "pt"]));

            const Collector = channel.createMessageCollector(m => m.author.id === message.author.id);
            Collector.on("collect", collected => {
                if (["cancel", "cancelar"].includes(collected.content.toLowerCase())) {
                    Collector.stop("stopped")
                    return channel.send(client.message(["service", "collector_canceled", "pt"]));
                }

                let roleToRemove;
                if (['everyone', 'todos'].includes(collected.content.toLowerCase())) {
                    roleToRemove = message.guild.roles.find(r => r.name === "@everyone");
                } else {
                    roleToRemove = collected.mentions.roles.first() || message.guild.roles.get(collected.content) || message.guild.roles.forEach(r => r.id === collected.content || r.name.toLowerCase() === collected.content.toLowerCase() || r === collected.content);
                }

                if (!roleToRemove) channel.send(client.message(["service", "role_not_found", "pt"]));
                else return removeRoleFromService(serviceCalled[1], roleToRemove)
                    .then(() => {
                        Collector.stop();
                        return channel.send(client.message(["service", "role_removed", "pt"], roleToRemove));
                    })
                    .catch((err) => {
                        if (err.message === "role not saved") channel.send(client.message(["service", "role_not_saved", "pt"]));
                        else if (err.message === "any role detected") {
                            Collector.stop();
                            channel.send(client.message(["service", "any_role_detected", "pt"]));
                        }
                        else channel.send(client.message(["service", "role_err", "pt"]));
                    });

            });
        } else {
            roleToRemove = args.slice(1).join(" ");
            if (["everyone", "todos"].includes(roleToRemove.toLowerCase())) {
                roleToRemove = message.guild.roles.find(r => r.name === "@everyone");
            } else {
                roleToRemove = message.mentions.roles.first() || message.guild.roles.find(r => r.id === roleToRemove || r.name.toLowerCase() === roleToRemove.toLowerCase()) || message.guild.roles.get(roleToRemove);
            }

            if (!roleToRemove) return channel.send(client.message(["service", "role_not_found_2", "pt"]));
            else removeRoleFromService(serviceCalled[1], roleToRemove)
                .then(() => {
                    return channel.send(["service", "role_removed", "pt"], roleToRemove);
                })
                .catch((err) => {
                    if (err.message === "role not saved") channel.send(client.message(["service", "role_not_saved_2", "pt"]));
                    else if (err.message === "any role detected") channel.send(client.message(["service", "any_role_detected_2", "pt"]));
                    else {
                        console.log(err);
                        channel.send(client.message(["service", "role_err", "pt"]));
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
        else SetNewAvailableRole.set({ AvailableRoles: UpdatedRoles.join(",") });

        return true;
    }

    function SomethingGoesWrong() {
        return channel.send(client.message(["service", "role_err", "pt"]));
    }

}