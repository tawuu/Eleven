module.exports = (client, message, args) => {
    if (message.author.id !== "474407357649256448") return;
    client.omegleStrangers = new Array();
    client.omegleStrangersMatched = new Array();
};