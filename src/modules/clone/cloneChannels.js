module.exports = {
  name: "cloneChannels",
  execute: async function (client) {
    log.info(`cloning all channels from ${copyFrom} to ${copyTo}`);

    /*/

    CATEGORY CLONING

    /*/

    // get all categories
    let serverChannels = {};
    let categories = [];
    copyFrom.channels.cache
      .map((c) => {
        if (c.type == "category") {
          categories.push(c);
        }
      })
      .sort((a, b) => a.calculatedPosition - b.calculatedPosition);
    serverChannels.categories = categories;
    log.info(`found ${categories.length} categories`);
    // for every category in server
    categories.forEach(async (category) => {
      // if category already exists, do nothing.
      if (await copyTo.channels.cache.find((c) => c.name === category.name))
        return;
      // create category
      await copyTo.channels
        .create(category.name, {
          reason: "Cloned by Qlutch Cloner",
          type: "category",
          permissionOverwrites: channels[i].permissionOverwrites,
        })
        .then((c) => {
          log.success(`Category ${c.name} was created`);
        })
        .catch((err) => {
          log.error(err.stack);
        });
    });

    /*/

    TEXT CHANNEL CLONING

    /*/

    let channels = copyFrom.channels.cache
      .filter((c) => c.type === "text")
      .sort((a, b) => a.calculatedPosition - b.calculatedPosition)
      .map((c) => c);

    serverChannels.text = channels;
    for (var i = 0; i < channels.length; i++) {
      // get original channel
      let originalChannel = channels[i];
      // check if channel exists in the clonedTo server
      if (
        await copyTo.channels.cache.find((c) => c.name === originalChannel.name)
      )
        continue;

      // if the original channel has no parent
      if (!originalChannel.parent) {
        // create channel with no parent
        var newChannel = await copyTo.channels
          .create(originalChannel.name, {
            reason: "Cloned by Qlutch Cloner",
            type: "text",
            topic: channels[i].topic ? channels[i].topic : "",
            permissionOverwrites: channels[i].permissionOverwrites,
          })
          .then((c) => {
            log.success(`Channel ${c.name} was created`);
          })
          .catch((err) => log.error(err.stack));
        // set the topic
      } else if (originalChannel.parent) {
        if (
          !copyTo.channels.cache.find(
            (c) => c.name === originalChannel.parent.name
          )
        ) {
          await copyTo.channels
            .create(originalChannel.parent.name, {
              reason: "Cloned by Qlutch Cloner",
              type: "category",
              permissionOverwrites: channels[i].permissionOverwrites,
            })
            .then((c) => {
              log.success(`Category ${c.name} was created`);
            })
            .catch((err) => {
              log.error(err.stack);
            });
        }
        var newChannel = await copyTo.channels
          .create(originalChannel.name, {
            reason: "Cloned by Qlutch Cloner",
            type: "text",
            parent: copyTo.channels.cache.find(
              (c) => c.name === originalChannel.parent.name
            ).id,
            topic: channels[i].topic ? channels[i].topic : "",
            permissionOverwrites: channels[i].permissionOverwrites,
          })
          .then((c) => {
            log.success(`Channel ${c.name} was created`);
          })
          .catch((err) => log.error(err.stack));
      }
    }

    /*/

    VOICE CHANNEL CLONING

    /*/

    let voice = copyFrom.channels.cache
      .filter((c) => c.type === "voice")
      .sort((a, b) => a.calculatedPosition - b.calculatedPosition)
      .map((c) => c);
    serverChannels.voice = voice;
    for (var i = 0; i < voice.length; i++) {
      // get original channel
      let originalChannel = channels[i];
      // check if channel exists in the clonedTo server
      if (await copyTo.channels.cache.find((c) => c.name === do1.name))
        continue;

      // if the original channel has no parent
      if (!originalChannel.parent) {
        // create channel with no parent
        var newChannel = await copyTo.channels
          .create(originalChannel.name, {
            reason: "Cloned by Qlutch Cloner",
            type: "voice",
            permissionOverwrites: channels[i].permissionOverwrites,
          })
          .catch((err) => log.error(err.stack));
      } else if (originalChannel.parent) {
        if (
          !copyTo.channels.cache.find(
            (c) => c.name === originalChannel.parent.name
          )
        ) {
          await copyTo.channels
            .create(originalChannel.parent.name, {
              reason: "Cloned by Qlutch Cloner",
              type: "category",
              permissionOverwrites: channels[i].permissionOverwrites,
            })
            .then((c) => {
              log.success(`Category ${c.name} was created`);
            })
            .catch((err) => {
              log.error(err.stack);
            });
        }
        var newChannel = await copyTo.channels
          .create(originalChannel.name, {
            reason: "Cloned by Qlutch Cloner",
            type: "voice",
            parent: copyTo.channels.cache.find(
              (c) => c.name === originalChannel.parent.name
            ).id,
            permissionOverwrites: channels[i].permissionOverwrites,
          })
          .catch((err) => log.error(err.stack));
      }
    }
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
          "channels.json"
        ),
        JSON.stringify(serverChannels, null, 4)
      );
    }
  },
};
