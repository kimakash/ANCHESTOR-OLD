const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "『[✰AYAN💌』"; // don't change neme

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: " MR.AYAN", // original author AYAN
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╔═════▓࿇࿇▓═════╗\n             𝐀𝐋𝐋 𝐂𝐌𝐃 𝐋𝐈𝐒𝐓 𝗜𝗡 𝗠𝗔𝗛𝗜'𝗦 𝔅𝔞𝔫𝔨𝔞𝔦 𝔟𝔬𝔱 𝗕𝗢𝗧\n╚═════▓࿇࿇▓═════╝\n\n`; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n➪ ༆─☞︎︎︎ [${category.toUpperCase()}] 》👑`;


          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => ` ✯${item}|\n`);
            msg += `\n ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += ``;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝗧𝗢𝗧𝗔𝗟 𝙲𝚖𝚍 ${totalCommands}\n𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚝𝚑𝚊t 𝚞 𝚌𝚊𝚗 𝚞𝚜𝚎 in lord aizens bankai bot -`;
      msg += `𝚝𝚢𝚙𝚎: 「${prefix} 𝗵𝗲𝗹𝗽」+「 𝐇𝐄𝐋𝐏 𝐂𝐌𝐃」𝚝𝚘 𝚟𝚒𝚎𝚠 𝚍𝚎𝚝𝚊𝚒𝚕𝚜 𝚘𝚏 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜\n`;
      msg += `👑 | 𝐓𝐇𝐀𝐍𝐊𝐒 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 𝐋𝐎𝐑𝐃 𝐀𝐈𝐙𝐄𝐍 𝐉𝐑'𝐒 𝐁𝐎𝐓 𝐖𝐄'𝐋𝐋 𝐂𝐎𝐌𝐄 𝐖𝐈𝐓𝐇 𝐍𝐄𝐖 𝐔𝐏𝐃𝐀𝐓𝐄 𝐄𝐕𝐄𝐑𝐘 𝐖𝐄𝐄𝐊`; // its not decoy so change it if you want 

      const helpListImages = [
        "", // don't change imgur
        "",
        "",
        "",
        "",
        // don't change imgur
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── 𝐍𝐀𝐌𝐄 𝐎𝐖𝐍𝐄𝐑 - 𝐋𝐎𝐑𝐃 𝐀𝐈𝐙𝐄𝐍 𝐉𝐑 (𝐌𝐀𝐇𝐈) ────⭓
  │ ${configCommand.name}
  ├── INFO
  │ Description: ${longDescription}
  │ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  │ Other names in your group: Do not have
  │ Version: ${configCommand.version || "1.0"}
  │ Role: ${roleText}
  │ Time per command: ${configCommand.countDown || 1}s
  │ Author: ${author}
  ├── Usage
  │ ${usage}
  ├── Notes
  │ THIS BOT HAS BEEN MADE BY LORD AIZEN JR (MAHI) WITH THE HELP OF ANONYMOUS SANAM
  │ FOR ANY HELP YOU CAN CONTRACT WITH OWNER AIZEN JR 👑 -https://www.facebook.com/100072881080249
  ╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
