module.exports.names = ["test"];
module.exports.dev = true;
module.exports.run = async (client, message, args, database) => {

    var promise = new Promise((resolve, reject) => {
        message.channel.send("olá!")
            .then(resolve("everything worked!"))
            .catch(reject("something goes wrong!"));
    });

    promise.then(result => {
        console.log(result);
    }).catch(err => {
        console.log(err);
    });


};