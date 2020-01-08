module.exports.names = ["test"];
module.exports.dev = true;
module.exports.run = async (client, message, args, database) => {

    let service = "MembersChatXP";
    UpdatedRoles = [];

    const SetNewAvailableRole = database.ref(`Configs/${message.guild.id}/${service}/`);
    if (UpdatedRoles.length === 0) SetNewAvailableRole.set({ AvailableRoles: null })
    else SetNewAvailableRole.set({ AvailableRoles: null });


};