const CassidyBridge = require("cassidy-bridge");

// Supports Local Balance!

module.exports = {
  config: {
    name: 'casino',
    version: '1.0',
    aliases: ["cs", "csino"],
    author: 'LiANE @nealianacagara',
    role: 0,
    category: 'Cassidy',
    shortDescription: {
      en: `Casino Command`
    },
    longDescription: {
      en: `Casino Command`
    },
    guide: {
      en: '{pn} [query]'
    },
  },
  async onStart({ message, event, usersData, commandName, args }) {
    const cass = CassidyBridge.fromGoatBot({ usersData, soloMode: true });
    const info = await cass.goatQuery(message, {
      ...event, 
      body: `cs ${args.join(" ")}`,
    });
    global.GoatBot.onReply.set(info?.messageID, {
      cass,
      commandName,
    });
  },
  async onReply({ Reply, message, event, args, commandName }) {
    const { cass } = Reply;
    const info = await cass.goatQuery(message, {
      ...event, 
      body: `${event.body}`,
    });
    global.GoatBot.onReply.set(info?.messageID, {
      cass,
      commandName,
    });
  }
};
