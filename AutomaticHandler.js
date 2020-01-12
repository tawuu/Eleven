const {  readdir, lstat } = require("fs").promises;

module.exports = async function AutomaticHandler(path, handlermap) {
    const pathStat = await lstat(path);
    if (pathStat.isFile()) {
        f = require(path);
        f.names ? f.names.forEach(name => handlermap.set(name, f)) / console.log(`Carregado: ${path}`) : handlermap.set(f.name, f) / console.log(`Carregado: ${path}`);
    } else if (pathStat.isDirectory()) {
        files = await readdir(path);
        if (files.length === 0) return console.log(`A pasta ${path} está vazia.`);
        files.forEach(async file => {
            const fileStat = await lstat(`${path}${file}`);
            if (fileStat.isFile()) {
                try {
                    f = require(`${path}${file}`);
                    f.names ? f.names.forEach(name => handlermap.set(name, f)) / console.log(`Carregado: ${file}`) : handlermap.set(f.name, f) / console.log(`Carregado: ${file}`);
                } catch (error) {
                    console.log(`Erro ao tentar carregar: ${file}`);
                }
            } else if (fileStat.isDirectory()) AutomaticHandler(`${path}${file}/`);

        });
    }

}

