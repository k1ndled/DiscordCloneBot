module.exports = {
  name: "cloneServerInfo",
  execute: async function (client) {
    let serverInfo = {};
    log.info(`cloning all server info from ${copyFrom} to ${copyTo}`);
    let allowedRegions = [
      "brazil",
      "us-west",
      "singapore",
      "eu-central",
      "hongkong",
      "us-south",
      "amsterdam",
      "us-central",
      "london",
      "us-east",
      "sydney",
      "japan",
      "eu-west",
      "frankfurt",
      "russia",
    ];
    let region = allowedRegions.includes(copyTo.region)
      ? copyTo.region
      : "us-central";
    let guildname = copyFrom.name;
    let guildico = copyFrom.iconURL();

    serverInfo.region = region;
    serverInfo.name = guildname;
    serverInfo.icon = guildico;
    serverInfo.verificationLevel = copyFrom.verificationLevel;

    await copyTo.setIcon(guildico).then((icon) => {
      log.success("Set Guild Icon to " + guildico);
    });
    await copyTo.setName(guildname).then((name) => {
      log.success("Set Guild Name to " + name);
    });
    await copyTo.setRegion(region).then((m) => {
      log.success("Set Guild Region to " + region);
    });
    await copyTo.setVerificationLevel(copyFrom.verificationLevel).then((m) => {
      log.success("Set Guild Verification to " + copyFrom.verificationLevel);
    });
    if (saveJSON) {
      if (!fs.existsSync(path.join(__dirname, "..", `savedServers`))) {
        fs.mkdirSync(path.join(__dirname, "..", `savedServers`));
      }
      if (
        !fs.existsSync(
          path.join(__dirname, "..", "savedServers", `${copyFrom.id}`)
        )
      ) {
        fs.mkdirSync(
          path.join(__dirname, "..", "savedServers", `${copyFrom.id}`)
        );
      }
      fs.writeFileSync(
        path.join(
          __dirname,
          "..",
          "savedServers",
          `${copyFrom.id}`,
          "serverInfo.json"
        ),
        JSON.stringify(serverInfo, null, 4)
      );
    }
  },
};
