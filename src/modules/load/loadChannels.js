module.exports = {
  name: "loadChannels",
  execute: async function (client, serverID) {
    let channels = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "..",
          "savedServers",
          `${serverID}`,
          "channels.json"
        )
      )
    );

    /*/

        CATEGORY LOADING

    /*/

    let categories = [];
    categories = channels.categories;
    let createdCategories = [];
    categories.forEach((category) => {
      copyTo.channels
        .create(category.name, {
          reason: "Cloned by Qlutch Cloner",
          type: "category",
        })
        .then((c) => {
          log.success(`Category ${c.name} was created`);
          createdCategories.push(c);
        })
        .catch((err) => {
          log.error(err.stack);
        });
    });

    /*/

        TEXT LOADING

    /*/

    let textChannels = [];
    textChannels = channels.text;
    textChannels.forEach((channel) => {
      if (!channel.parent) {
        var newChannel = copyTo.channels
          .create(channel.name, {
            reason: "Cloned by Qlutch Cloner",
            type: "text",
            nsfw: channel.nsfw,
            topic: channel.topic ? channel.topic : "",
          })
          .then((c) => {
            log.success(`Channel ${c.name} was created`);
          })
          .catch((err) => log.error(err.stack));
      } else if (channel.parent) {
        let foundCategory;
        createdCategories.forEach((category) => {
          if (category.name == channel.parent.name) {
            foundCategory = category;
          }
        });
        var newChannel = copyTo.channels
          .create(originalChannel.name, {
            reason: "Cloned by Qlutch Cloner",
            type: "text",
            parent: foundCategory,
            nsfw: channel.nsfw,
            topic: channel.topic ? channel.topic : "",
          })
          .then((c) => {
            log.success(`Channel ${c.name} was created`);
          })
          .catch((err) => log.error(err.stack));
      }
    });
  },
};
