module.exports.names = ["addcommand"];
const { mkdirSync, writeFileSync } = require("fs");
module.exports.dev = true;

function codeString (name) {
    return string = `module.exports.names = ["${name}"];
    
    
module.exports.run = (client, message, args, database) => {



}`
}

module.exports.run = (client, message, args) => {

    if (!args[0]) return message.channel.send(`example: addcomand [./folder/]command1/command2`);
    path = args.join(" ");
    let folder;
    let archives;

    if (path.startsWith("./")) {
        folder = path.split("/")[1];
        archives = path.split("/").slice(2);
    } else {
        archives = path.includes("/") ? path.split("/") : [path];
    }

    if (folder) {
        mkdirSync(`./commands/${folder}`);
        archives.forEach(archive => writeFileSync(`./commands/${folder}/${archive}.js`, codeString(archive)));
    }
    else archives.forEach(archive => writeFileSync(`./commands/${archive}.js`, codeString(archive)));

};