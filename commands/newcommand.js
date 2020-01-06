module.exports.names = ["newcommand"];
module.exports.dev = true;

module.exports.run = (client, message, args) => {

    const { writeFileSync } = require("fs");
    commandName = args[0];
    commandCode = args.slice(1).join(" ");
    let code;
    commandCode ? code = commandCode : code = ""; 
    
let PatternCode = `module.exports.names = ["${commandName}"];

module.exports.run = (client, message, args) => {
    
    ${code}

};`

    writeFileSync(`./commands/${commandName}.js`, PatternCode);
};