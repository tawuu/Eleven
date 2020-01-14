module.exports = async (database, MemberInfo, unavailableFor) => {

    switch (unavailableFor.toLowerCase()) {
        case "mute": unavailableFor = "Muted";
            break;

        case "alone": unavailableFor = "Aloned";
            break;
    }


    ///////////////// pass the reason and add points //////////////////////////
    const userInDatabaseUnavailableFor = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}/unavailableFor`);

    const userInDatabaseUnavailableForVal = await userInDatabaseUnavailableFor.once("value");

    if (userInDatabaseUnavailableForVal.val() === null) return;

    let Points = userInDatabaseUnavailableForVal.val().Points + 1;
    
    let Aloned = userInDatabaseUnavailableForVal.val().Aloned;
    let Muted = userInDatabaseUnavailableForVal.val().Muted;
    
    if (unavailableFor === "Aloned" && Aloned === true) return console.log(`already aloned`);
    if (unavailableFor === "Muted" && Muted === true) return console.log(`already muted`);
    if (unavailableFor === "Aloned" && Aloned === false) userInDatabaseUnavailableFor.update({ Aloned: true, Points: Points });
    if (unavailableFor === "Muted" && Muted === false) userInDatabaseUnavailableFor.update({ Muted: true, Points: Points });
    
    
    ////////////// work with the seconds unavailable //////////////////////////////
    if (Points === 1) {

        const userInDatabaseUnavailable = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}`);

        const userInDatabaseUnavailableVal = await userInDatabaseUnavailable.once("value");

        if (userInDatabaseUnavailableVal.val() === null) return;

        userInDatabaseUnavailable.update({ unavailableSince: new Date().getTime() });

    }



}
