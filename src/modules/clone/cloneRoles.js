module.exports = {
  name: "cloneRoles",
  execute: async function (client) {
    log.info(`cloning all roles from ${copyFrom} to ${copyTo}`);
    let roles = copyFrom.roles.cache
      .sort((a, b) => b.calculatedPosition - a.calculatedPosition)
      .map((r) => r);
    let serverRoles = {};
    serverRoles = roles;
    for (var i = 0; i < roles.length; i++) {
      if (await copyTo.roles.cache.find((c) => c.name === roles[i].name))
        continue;
      copyTo.roles
        .create({
          reason: "Cloned by Qlutch Cloner",
          data: {
            name: roles[i].name,
            color: roles[i].hexColor,
            hoist: roles[i].hoist,
            mentionable: roles[i].mentionable,
            permissions: roles[i].permissions,
          },
        })
        .then((createdRole) => {
          log.success(`Role ${createdRole.name} was created`);
        });
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
          "roles.json"
        ),
        JSON.stringify(roles, null, 4)
      );
    }
  },
};
