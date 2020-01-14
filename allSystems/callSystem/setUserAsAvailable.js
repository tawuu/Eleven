module.exports = async (database, MemberInfo, availableFor) => {

    switch (availableFor.toLowerCase()) {
        case "mute": availableFor = "Muted";
            break;

        case "alone": availableFor = "Aloned";
            break;
        case "disconnecting": availableFor = "Disconnected";
            break;
    }


    ///////////////////// pass the reason and remove points ////////////////////
    const userInDatabaseUnavailableFor = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}/unavailableFor`);

    const userInDatabaseUnavailableForVal = await userInDatabaseUnavailableFor.once("value");

    if (userInDatabaseUnavailableForVal.val() === null) return;

    let Points = userInDatabaseUnavailableForVal.val().Points - 1;
    let Muted = userInDatabaseUnavailableForVal.val().Muted;
    let Aloned = userInDatabaseUnavailableForVal.val().Aloned;


    if (availableFor === "Muted" && Muted === false) return;
    else if (availableFor === "Aloned" && Aloned === false) return;

    else if (availableFor === "Muted") userInDatabaseUnavailableFor.update({ Muted: false, Points: Points });
    else if (availableFor === "Aloned") userInDatabaseUnavailableFor.update({ Aloned: false, Points: Points });

    //////////////////// work with the seconds available //////////////////////////////////////
    if (Points === 0) {

        const userInDatabaseUnavailable = database.ref(`Configs/${MemberInfo.guildID}/MembersCallXP/${MemberInfo.userID}`);

        const userInDatabaseUnavailableVal = await userInDatabaseUnavailable.once("value");

        if (userInDatabaseUnavailableVal.val() === null) return;

        unavailableSince = userInDatabaseUnavailableVal.val().unavailableSince;
        const nowTime = new Date().getTime();

        userInDatabaseUnavailable.update({ unavailableSince: 0 });

        let secondsUnavailable = nowTime % unavailableSince;
        secondsUnavailable = parseInt(secondsUnavailable / 1000, 10);

        let unavailableTime = userInDatabaseUnavailableVal.val().unavailableTime;
        unavailableTime = unavailableTime + secondsUnavailable;

        userInDatabaseUnavailable.update({ unavailableTime: unavailableTime });


    }


}
