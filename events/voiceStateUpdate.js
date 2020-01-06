module.exports = async (client, oldMember, newMember, database) => {
    
    user = client.users.get(oldMember.user.id);

    if (user.bot) return;

    newMemberInfo = {
        userID: newMember.user.id,
        serverMute: newMember.serverMute,
        serverDeaf: newMember.serverDeaf,
        selfMute: newMember.selfMute,
        selfDeaf: newMember.selfDeaf,
        voiceSessionID: newMember.voiceSessionID,
        voiceChannelID: newMember.voiceChannelID,
        speaking: newMember.speaking,
        guildID: newMember.guild.id
    }



    oldMemberInfo = {
        userID: oldMember.user.id,
        serverMute: oldMember.serverMute,
        serverDeaf: oldMember.serverDeaf,
        selfMute: oldMember.selfMute,
        selfDeaf: oldMember.selfDeaf,
        voiceSessionID: oldMember.voiceSessionID,
        voiceChannelID: oldMember.voiceChannelID,
        speaking: oldMember.speaking,
        guildID: oldMember.guild.id
    }
    // check alone users using callXPSystem
    require(`../callSystem/UsersAloneInChannels.js`)(client, database);

    // conectar | channelid true
    if (!oldMemberInfo.voiceChannelID && newMemberInfo.voiceChannelID) {
        return require(`../callSystem/connect.js`)(newMemberInfo, database);
    }
    //////////////////////////////////////////////////

    // desconectar | channelid false  
    if (!newMemberInfo.voiceChannelID) {
        return require(`../callSystem/disconnect.js`)(oldMemberInfo, newMemberInfo, database);
    };
    //////////////////////////////////////////////////

    // mutar | muted true
    if (!oldMemberInfo.selfMute && newMemberInfo.selfMute || !oldMemberInfo.serverMute && newMemberInfo.serverMute || !oldMemberInfo.serverDeaf && oldMemberInfo.serverDeaf) {
        return require(`../callSystem/setUserAsUnavailable.js`)(database, newMemberInfo, "mute");
    }
    // desmutar | muted false
    if (oldMemberInfo.selfMute && !newMemberInfo.selfMute || oldMemberInfo.selfMute && !newMemberInfo.serverMute || oldMemberInfo.serverDeaf && !oldMemberInfo.serverDeaf) {
        return require(`../callSystem/setUserAsAvailable.js`)(database, newMemberInfo, "mute");
    }




    // // deafen true
    // if (!oldMemberInfo.selfDeaf && newMemberInfo.selfDeaf) {
    //     return channel.send(`<@${newMemberInfo.userID}> | headset off.`);
    // }
    // // deafen false
    // if (oldMemberInfo.selfDeaf && !newMemberInfo.selfMute) {
    //     return channel.send(`<@${newMemberInfo.userID}> | headset on.`);
    // }

    // change channel
    // if (oldMemberInfo.voiceChannelID !== newMemberInfo.voiceChannelID) {
    //     return require(`../callSystem/changeChannel.js`)(client, oldMemberInfo, newMemberInfo, database);
    // }

};

