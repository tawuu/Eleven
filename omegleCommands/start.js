module.exports = async (client, message, args) => {

    const channel = message.channel;
    // look for someone to talk.
    isInQueue = client.omegleStrangers.find(stranger => stranger === message.author.id);
    if (isInQueue) { 
        channel.send("você já está procurando por alguém.");
    } else {
        client.omegleStrangers.length > 0 ? Match() : AddInQueue();

        function Match() {
            stranger1 = client.omegleStrangers.pop();
            stranger2 = message.author.id;
            client.omegleStrangersMatched.push(`${stranger1}-${stranger2}`);
            channel.send("achei alguém pra você!");
            
        }

        function AddInQueue() {
            client.omegleStrangers.push(message.author.id);
            channel.send("procurando por alguém...");
        }
    }

}
