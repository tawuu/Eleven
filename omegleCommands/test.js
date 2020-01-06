const { appendFileSync } = require("fs");
module.exports = (client, message, args) => {
    if (message.author.id !== "474407357649256448") return;
    
    console.log(client.omegleMatcheds)
};