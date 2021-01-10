const readline = require("readline");
global.path = require("path");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const pms = require("pretty-ms");
const conf = require("nconf");
global.log = require(`./logHandlers.js`);
conf.file({ file: path.join("config.json") });
global.fs = require("fs");
const axios = require("axios").default;
const chalk = require("chalk");
const Discord = require("discord.js-selfbot");
const client = new Discord.Client();

let startFunction;

let loggedIn;
let loadJSON;
global.saveJSON = false;
global.copyFrom;
global.copyTo;

console.clear();
process.stdout.write(
    String.fromCharCode(27) +
        "]0;" +
        `${require("../package.json").name} v${
            require("../package.json").version
        }` +
        String.fromCharCode(7)
);

log.info(
    "Welcome to the Discord Server Cloner, made by !AmNoot, recreated by kindled."
);

var args = process.argv.slice(2);
switch (args[0]) {
    case "loadjson":
        log.info(
            "Loading JSON is soon to be released, so it won't be enabled right now"
        );
        //loadJSON = true;
        break;
    case "savejson":
        saveJSON = true;
        break;
}

if (!conf.get("token")) {
    rl.question("Enter a Discord token:: ", (token) => {
        console.clear();
        conf.set("token", token);
        conf.save();
        log.success("Successfully set token");
        log.info("Logging into token.. this may take a little while");
        loggedIn = Date.now();
        client.login(token);
    });
} else {
    log.info("Logging into token.. this may take a little while");
    loggedIn = Date.now();
    client.login(conf.get("token"));
}

// load modules

let modulesCollection = new Map();
const modules = fs
    .readdirSync(path.join(__dirname, "modules", "clone"))
    .filter((r) => r.endsWith(".js"));
for (const module of modules) {
    const x = require(path.join(__dirname, "modules", "clone", module));
    modulesCollection.set(x.name, x);
}

// ask function

function ask(type) {
    switch (type) {
        case "copyFrom":
            rl.question(
                "What server do you want to copy from (Discord ID):: ",
                (copyFromServer) => {
                    if (!client.guilds.cache.get(copyFromServer)) {
                        console.log("Invalid server to copy from");
                        return ask("copyFrom");
                    } else {
                        copyFrom = client.guilds.cache.get(copyFromServer);
                        return ask("copyTo");
                    }
                }
            );
            break;
        case "copyTo":
            rl.question(
                "What server do you want to copy to (Discord ID):: ",
                (copyToServer) => {
                    if (!client.guilds.cache.get(copyToServer)) {
                        797655191776264212;
                        console.log("Invalid server to copy to");
                        return ask("copyTo");
                    }
                    copyTo = client.guilds.cache.get(copyToServer);
                    if (!copyTo.me.hasPermission("ADMINISTRATOR")) {
                        log.info(
                            `You do not have administrator in ${copyTo.name}`
                        );
                        return ask("copyTo");
                    }
                    if (loadJSON == true) {
                        return ask("JSONFolder");
                    } else {
                        if (startFunction) {
                            startFunction();
                        } else {
                            log.error("This is awkward...");
                        }
                    }
                }
            );
            break;
        case "JSONFolder":
            rl.question(
                "Enter the ID of a server you've copied before:: ",
                (serverID) => {
                    if (
                        !fs.existsSync(
                            path.join(
                                __dirname,
                                "modules",
                                "savedServers",
                                `${serverID}`
                            )
                        )
                    ) {
                        console.info(
                            "This server was never copied and saved before."
                        );
                        return ask("JSONFolder");
                    } else {
                        const loadModules = fs
                            .readdirSync(
                                path.join(__dirname, "modules", "load")
                            )
                            .filter((r) => r.endsWith(".js"));
                        for (const module of loadModules) {
                            const x = require(path.join(
                                __dirname,
                                "modules",
                                "load",
                                module
                            ));
                            x.execute(client, serverID);
                        }
                    }
                }
            );
        //return process.exit(0);
    }
}

// ready event

client.on("ready", async () => {
    try {
        log.success(
            `Logged into ${client.user.tag} within ${pms(
                Date.now() - loggedIn,
                {
                    verbose: true,
                }
            )}`
        );
        if (loadJSON == true) {
            ask("copyTo");
        } else {
            ask("copyFrom");
        }
        // get all the clone modules, and then execute them C:
        startFunction = () => {
            for (const module of modules) {
                const x = require(path.join(
                    __dirname,
                    "modules",
                    "clone",
                    module
                ));
                try {
                    x.execute(client);
                } catch (err) {
                    console.error(err.stack);
                }
            }
        };
    } catch (e) {
        console.error(e.stack);
    }
});
