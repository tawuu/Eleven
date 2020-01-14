module.exports = (guild, database) => {
    const AvailableServicesDatabase = database.ref(`AvailableServices/${guild.id}/`);

    const AvailableServicesDatabaseVal = await AvailableServicesDatabase.once("value");

    if (!AvailableServicesDatabaseVal.val() === null) return;

    AvailableServicesDatabase.set({
        Money: false,
        ChatXP: false,
        CallXP: false
    });
}