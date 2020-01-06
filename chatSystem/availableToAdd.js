timeoutGuildMember = new Map();

module.exports.GuildMember = (guild, member) => {

    let isAvailableToAdd = Boolean;

    if (timeoutGuildMember.has(`${guild.id}-${member.id}`)) {
        isAvailableToAdd = false;
    } else {
        timeoutGuildMember.set(`${guild.id}-${member.id}`);
        isAvailableToAdd = true;
        setTimeout(() => {
            
            timeoutGuildMember.delete(`${guild.id}-${member.id}`);
        }, 30000);
    }

    return isAvailableToAdd;

};