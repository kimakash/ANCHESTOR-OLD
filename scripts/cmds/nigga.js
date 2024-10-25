const axios = require('axios');

// Function to get the base API URL from a GitHub-hosted JSON file
const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports = {
  config: {
    name: "savage",
    aliases: ["savage", "sv"],
    version: "1.0.0",
    author: "Redwan",
    countDown: 0,
    role: 0,
    description: "Replies to all messages when it's on, and can be turned on/off.",
    category: "chat",
    guide: {
      en: "Type 'savage on' to activate or 'savage off' to deactivate the bot."
    }
  },

  onStart: async function ({ api, args, event, threadsData }) {
    // Check if 'on' or 'off' command is issued
    if (args[0] === 'on' || args[0] === 'off') {
      await threadsData.set(event.threadID, args[0] === "on", "settings.savage");
      return api.sendMessage(args[0] === "on" ? "Savage is now active." : "Savage has been deactivated.", event.threadID, event.messageID);
    }

    // If no command, process the message
    const link = `${await baseApiUrl()}/baby`; // Get the API link
    const yourMessage = args.join(" ").toLowerCase(); // Combine message arguments

    try {
      // Check if Savage is active
      const isSavageOn = await threadsData.get(event.threadID, "settings.savage");
      if (!isSavageOn) return; // Do nothing if the bot is off

      // Process and reply to the message
      const response = await axios.get(`${link}?text=${yourMessage}`);
      const reply = response.data.reply || "Sorry, I couldn't understand that.";
      return api.sendMessage(reply, event.threadID, event.messageID);
      
    } catch (error) {
      console.error("Error occurred:", error);
      return api.sendMessage("Oops, something went wrong!", event.threadID, event.messageID);
    }
  },

  onChat: async function ({ api, event, threadsData }) {
    // Check if Savage is active
    const isSavageOn = await threadsData.get(event.threadID, "settings.savage");
    if (!isSavageOn) return; // Do nothing if the bot is off

    const link = `${await baseApiUrl()}/baby`; // Get the API link
    const yourMessage = event.body.toLowerCase(); // Get the incoming message

    try {
      // Process and reply to the message
      const response = await axios.get(`${link}?text=${yourMessage}`);
      const reply = response.data.reply || "Sorry, I couldn't understand that.";
      return api.sendMessage(reply, event.threadID, event.messageID);
      
    } catch (error) {
      console.error("Error occurred:", error);
      return api.sendMessage("Oops, something went wrong!", event.threadID, event.messageID);
    }
  }
};
