module.exports = {
  name: "cloneEmojis",
  execute: async function (client) {
    log.info(`cloning all emojis from ${copyFrom} to ${copyTo}`);
    let serverEmojis = {};
    let emojis = copyFrom.emojis.cache.map((r) => r);
    serverEmojis = emojis;
    copyFrom.emojis.cache.forEach((emoji) => {
      if (copyFrom.emojis.cache.find((c) => c.name === emoji.name)) return;
      copyFrom.emojis.create(emoji.url, emoji.name).then((createdEmoji) => {
        serverEmojis.push(createdEmoji);
        log.success(`Emoji ${createdEmoji} was created`);
      });
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
          "emojis.json"
        ),
        JSON.stringify(emojis, null, 4)
      );
    }
  },
};
