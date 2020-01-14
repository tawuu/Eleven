const { RichEmbed } = require("discord.js");
module.exports.dev = true;
module.exports.names = ["dev"];

module.exports.run = (client, message, args, database) => {

    const channel = message.channel;

    defaultMessage = `blockservice, openservice, blockservicerole, openservicerole, serverslist`;

    if (!args[0]) return channel.send(defaultMessage);

    switch (args[0].toLowerCase()) {
        case "blockservice": BlockServiceFromServer();
            break;

        case "openservice": OpenServiceFromServer();
            break;

        case "serverslist": ServersList();
            break;

        case "blockservicerole": BlockServiceFromRole();
            break;

        case "openservicerole": OpenServiceFromRole();
            break;

        default: channel.send(defaultMessage);
            break;
    }

    async function BlockServiceFromServer() {

        var services = ["money", "chatxp", "callxp"];

        if (!args[1]) return channel.send("needs server ID");
        if (!args[2]) return channel.send(`choose one service: \`${services.join("/")}\``);

        ServerID = args[1];
        ServerName = client.guilds.get(ServerID).name;
        let service;

        switch (args[2].toLowerCase()) {
            case services[0]: service = "Money";

                break;
            case services[1]: service = "ChatXP";

                break;
            case services[2]: service = "CallXP";

                break;

            default: service = "404 not found";
                break;
        }

        if (!services.includes(service.toLowerCase())) return channel.send(`invalid service.`);

        isAvailable = client.require("isAvailable.js");

        isAvailable = await isAvailable.Guild(ServerID, database, service);

        if (isAvailable === false) {
            channel.send(`Service **${service}** is already blocked to the guild **${ServerID}** [${ServerName}]`);
        } else {
            const AvailableServicesDatabase = database.ref(`AvailableServices/${ServerID}`);

            const AvailableServicesDatabaseVal = await AvailableServicesDatabase.once("value");

            if (AvailableServicesDatabaseVal.val() === null) {
                return channel.send(`server not found.`);
            } else {
                ServicesAvailable = AvailableServicesDatabaseVal.val();
                ServicesAvailable[service] = false;
                AvailableServicesDatabase.update(ServicesAvailable);

                channel.send(`Server **${ServerID}** [${ServerName}] had the service \`${service}\` blocked.`);
            }

        }
    }

    async function OpenServiceFromServer() {
        var services = ["money", "chatxp", "callxp"];

        if (!args[1]) return channel.send("Input the server's ID");
        if (!args[2]) return channel.send(`Choose one service: \`${services.join("/")}\``);

        var ServerID = args[1];
        var ServerName = client.guilds.get(ServerID).name;
        var service = args[2];


        switch (service.toLowerCase()) {
            case services[0]: service = ["Money", "MoneySystem"];
                break;

            case services[1]: service = ["ChatXP", "MembersChatXP"];
                break;

            case services[2]: service = ["CallXP", "MembersCallXP"];
                break;

            default: service = "404 not found";
                break;
        }

        if (!services.includes(service[0].toLowerCase())) return channel.send(`invalid service.`);

        isAvailable = client.require("isAvailable.js");

        if (!isAvailable.Guild(ServerID, database, service[0])) {
            channel.send(`Service **${service[0]}** is already opened to the guild **${ServerID}** [${ServerName}]`);
        } else {
            const AvailableServicesDatabase = database.ref(`AvailableServices/${ServerID}`);

            const AvailableServicesDatabaseVal = await AvailableServicesDatabase.once("value");

            if (AvailableServicesDatabaseVal.val() === null) {
                return channel.send(`server not found.`);
            } else {
                ServicesAvailable = AvailableServicesDatabaseVal.val();
                ServicesAvailable[service[0]] = true;
                AvailableServicesDatabase.update(ServicesAvailable);

                channel.send(`Server **${ServerID}** [${ServerName}] had the service \`${service[0]}\` opened.`);
            }
        }

    }

    async function BlockServiceFromRole() {

        var services = ["money", "chatxp", "callxp"];

        if (!args[1]) return channel.send("Input the server's ID");
        if (!args[2]) return channel.send(`Choose one service: \`${services.join("/")}\``);
        if (!args[3]) return channel.send(`Choose one role to remove.`);

        var ServerID = args[1];
        var ServerName = client.guilds.get(ServerID).name;
        var service = args[2];
        var role = args[3];

        switch (service.toLowerCase()) {
            case services[0]: service = ["Money", "MoneySystem"];
                break;

            case services[1]: service = ["ChatXP", "MembersChatXP"];
                break;

            case services[2]: service = ["CallXP", "MembersCallXP"];
                break;

            default: service = "404 not found";
                break;
        }

        if (!services.includes(service[0].toLowerCase())) return channel.send(`invalid service.`);

        let RoleToBlock = client.guilds.get(ServerID).roles.find(r => r === role || r.id === role || r.name === role) || message.mentions.roles.first();

        if (!RoleToBlock) return channel.send(`Invalid role`);

        AvailableRolesDatabase = database.ref(`Configs/${ServerID}/${service[1]}/AvailableRoles`);
        AvailableRolesDatabaseVal = await AvailableRolesDatabase.once("value");

        const AvailableRoles = AvailableRolesDatabaseVal.val();

        if (AvailableRoles === null) return channel.send(`This server doesn't have any role allowed for ${service[1]}`);

        let AvailableRolesArray = AvailableRoles.includes(",") ? AvailableRoles.split(",") : [AvailableRoles];

        if (!AvailableRolesArray.includes(RoleToBlock.id)) return channel.send(`${RoleToBlock} is not allowed for ${service[1]}.`);

        let AvailableRolesArrayUpdated = [];

        AvailableRolesArray.forEach(AvailableRoleID => {
            if (AvailableRoleID === RoleToBlock.id) return;
            else AvailableRolesArrayUpdated.push(AvailableRoleID);

        });
        console.log(AvailableRolesArrayUpdated.length);

        if (AvailableRolesArrayUpdated.length === 0) console.log("a") / AvailableRolesDatabase.set({});
        else AvailableRolesDatabase.set(AvailableRolesArrayUpdated.join(","));
        


        channel.send(`${RoleToBlock} has been removed from the service **${service[1]}** [in **${ServerName}**]`);

    }

    async function OpenServiceFromRole() {
        var services = ["money", "chatxp", "callxp"];

        if (!args[1]) return channel.send("Input the server's ID");
        if (!args[2]) return channel.send(`Choose one service: \`${services.join("/")}\``);
        if (!args[3]) return channel.send(`Choose on role to add.`);

        var ServerID = args[1];
        var ServerName = client.guilds.get(ServerID).name;
        var service = args[2];
        var role = args[3];

        switch (service.toLowerCase()) {
            case services[0]: service = ["Money", "MoneySystem"];
                break;

            case services[1]: service = ["ChatXP", "MembersChatXP"];
                break;

            case services[2]: service = ["CallXP", "MembersCallXP"];
                break;

            default: service = "404 not found";
                break;
        }

        if (!services.includes(service[0].toLowerCase())) return channel.send(`invalid service.`);

        isAvailable = client.require("isAvailable.js");
        isAvailableGuild = await isAvailable.Guild(ServerID, database, service[0])
        if (!isAvailableGuild) {
            channel.send(`Service **${service[0]}** is not allowed to the guild **${ServerID}** [${ServerName}]`);
        } else {
            const roleToAdd = client.guilds.get(ServerID).roles.find(r => r.id === role || r.name === role || r === role) || message.mentions.roles.first();
            if (!roleToAdd) return channel.send(`Invalid role`);

            AvailableRolesDatabase = database.ref(`Configs/${ServerID}/${service[1]}/AvailableRoles`);
            AvailableRolesDatabaseVal = await AvailableRolesDatabase.once("value");

            if (AvailableRolesDatabaseVal.val() === null) {
                AvailableRolesDatabase.set(`${roleToAdd.id}`);
                channel.send(`${roleToAdd} has been added to the service **${service[1]}**`)
            } else {
                roles = AvailableRolesDatabaseVal.val();
                
                rolesArray = roles.includes(",") ? roles.split(",") : [roles];

                if (rolesArray.includes(roleToAdd.id)) return channel.send(`${roleToAdd} is already allowed.`); 
                
                rolesArray.push(roleToAdd.id);

                AvailableRolesDatabase.set(rolesArray.join(","));
                channel.send(`${roleToAdd} has been added to the service **${service[1]}** [in **${ServerName}**]`)
            }

        }
    }



    async function ServersList() {
        ServersListEmbed = new RichEmbed();

        const ServersDatabase = await database.ref("AvailableServices").once("value");

        let ServersID = [];
        let idx = 0;
        ServersDatabase.forEach(snap => {
            idx++;
            ServersID.push(`${idx}: **${snap.key}** [${client.guilds.get(snap.key).name}]`);

        });

        ServersListEmbed.setDescription(ServersID.join("\n"));

        channel.send(ServersListEmbed);
    }

};