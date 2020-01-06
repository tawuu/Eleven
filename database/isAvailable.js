module.exports.GuildMemberRole = async (guildID, memberID, database, service) => {

    client = require(`../index.js`).client;

    var services = ["money", "chatxp", "callxp"];

    switch (service.toLowerCase()) {
        case services[0]: service = "MembersMoney";

            break;
        case services[1]: service = "MembersChatXP";

            break;
        case services[2]: service = "MembersCallXP";

            break;

        default: service = "404 not found";
            break;
    }

    if (service === "404 not found") return console.log("param service is wrong.");


    const AvailableServiceForRole = database.ref(`Configs/${guildID}/${service}/AvailableRoles`);

    let isAvailable = Boolean;

    const AvailableServiceForRoleVal = await AvailableServiceForRole.once("value");

    if (AvailableServiceForRoleVal.val() === null) return isAvailable = false;

    const AvailableRoles = AvailableServiceForRoleVal.val();

    const userRoles = client.guilds.get(guildID).members.get(memberID).roles;

    hasRole = userRoles.find(role => AvailableRoles.includes(role.id));

    hasRole ? isAvailable = true : isAvailable = false;

    return isAvailable;


};

module.exports.Guild = async (guildID, database, service) => {

    var services = ["money", "chatxp", "callxp"];

    switch (service.toLowerCase()) {
        case services[0]: service = "Money";

            break;
        case services[1]: service = "ChatXP";

            break;
        case services[2]: service = "CallXP";

            break;

        default: service = "404 not found";
            break;
    }


    if (service === "404 not found") return console.log("param service is wrong.");

    const AvailableServicesDatabase = database.ref(`AvailableServices/${guildID}`);

    let isAvailable = Boolean;

    const AvailableServicesDatabaseVal = await AvailableServicesDatabase.once("value");

    if (AvailableServicesDatabaseVal.val() === null)  isAvailable = false;
    else if (AvailableServicesDatabaseVal.val()[service] === false) isAvailable = false;
    else isAvailable = true;

    return isAvailable;

}