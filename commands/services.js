const { RichEmbed } = require("discord.js");

module.exports.names = ["services", "serviços", "servicos"];

module.exports.run = async (client, message, args, database) => {
    const channel = message.channel;

    if (message.author.id !== message.guild.ownerID) return;

    const AvailableServicesDatabase = database.ref(`AvailableServices/${message.guild.id}/`);

    const AvailableServicesDatabaseVal = await AvailableServicesDatabase.once("value");

    if (AvailableServicesDatabaseVal.val() == null) return channel.send(`Infelizmente seu servidor não está registrado no meu banco de dados, por favor entre em contato com o meu desenvolvedor!`)

    let ServicesArray = [
        { Name: "CallXP", Firebasename: "MembersCallXP", Available: false, Roles: [] },
        { Name: "ChatXP", Firebasename: "MembersChatXP", Available: false, Roles: [] }
    ];

    ServicesArray.setAsAvailable = function (name) {
        this.forEach(el => {
            if (el.Name.toLowerCase() === name.toLowerCase()) el.Available = true;
        });
    }

    ServicesArray.setAsUnavailable = function (name) {
        this.forEach(el => {
            if (el.Name.toLowerCase() === name.toLowerCase()) el.Available = false;
        });
    }

    ServicesArray.val = function () {
        newArr = [];
        this.forEach(el => {
            if (el !== Function) newArr.push(el);
        });
        return newArr;
    };

    ServicesArray.get = function (name) {
        let element;
        this.forEach(el => {
            if (el.Name.toLowerCase() === name.toLowerCase() || el.Firebasename.toLowerCase() === name.toLowerCase()) element = el;
        });
        return element;
    }

    ServicesArray.getAvailables = function () {
        let availables = [];
        this.forEach(el => {
            if (el.Available === true) availables.push(el);
        });
        return availables;
    }

    ServicesArray.getUnavailables = function () {
        let unavailables = [];
        this.forEach(el => {
            if (el.Available === false) unavailables.push(el);
        });
        return unavailables;
    }

    ServicesArray.getRoles = async function (name) {
        let roles;
        for (const el of this) {
            if (el.Name.toLowerCase() === name.toLowerCase()) {
                Database = database.ref(`Configs/${message.guild.id}/${el.Firebasename}/AvailableRoles`);
                DatabaseVal = await Database.once("value");
                roles = DatabaseVal.val();
            }
        };

        return roles;
    }

    AvailableServicesDatabaseVal.forEach(snap => {
        snap.val() ? ServicesArray.setAsAvailable(snap.key) : ServicesArray.setAsUnavailable(snap.key);
    });

    const ServiceEmbed = new RichEmbed();
    ServiceEmbed.setTitle(`Lista de serviços deste servidor!`);
    ServiceEmbed.setDescription(`adquiri apra comprar alguma`);

    Availables = ServicesArray.getAvailables();
    Unavailables = ServicesArray.getUnavailables();

    if (Availables !== null) {
        for (const service of Availables) {
            Roles = await ServicesArray.getRoles(service.Name);

            let RolesThreated;

            if (Roles === null) RolesThreated = `**Nenhum** cargo está utilizando este serviço.`
            else {
                RolesArr = Roles.includes(",") ? Roles.split(",") : [Roles];
                RolesThreated = [];
                for (const Role of RolesArr) {
                    RolesThreated.push(`**${message.guild.roles.get(Role).name}**`);
                }
                RolesThreated = RolesThreated.join("\n∟");
            }


            ServiceEmbed.addField(`${service.Name}`, `:green_circle: Disponível\nCargos utilizando este serviço:\n∟${RolesThreated}`);
        };
    }

    if (Unavailables !== null) {
        for (const service of Unavailables) {
            ServiceEmbed.addField(service.Name, `:red_circle: Indisponível`);
        }
    }

    channel.send(ServiceEmbed);




};