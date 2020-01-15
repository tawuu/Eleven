module.exports.names = ["test"];
module.exports.dev = true;

const Jimp = require("Jimp");
module.exports.run = async (client, message, args) => {

    const Bia = await Jimp.read(`./bia.jpg`);

    maxWidth = Bia.bitmap.width;
    maxHeight = Bia.bitmap.height;

    const Teste = new Jimp(maxWidth, maxHeight);

    i = 10;
    function getCubePerfectBitmap(maxW, maxH) {
        return { maxW: maxW / 25, maxH: maxH / 25 }
    }

    let value = getCubePerfectBitmap(maxWidth, maxHeight);
    console.log(value);


    Teste.writeAsync("./test.png");

};