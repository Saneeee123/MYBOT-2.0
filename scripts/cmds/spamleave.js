// Create an object to store spam data for each thread
const threadSpamData = {};

module.exports = {
  config: {
    name: "spamleave",
    version: "1.0",
    author: "JV Barcenas",
    countDown: 5,
    role: 1,
    shortDescription: {
      en: "automatically leave the chat if spammed multiple times in a short interval"
    },
    longDescription: {
      en: "automatically leave the chat if spammed multiple times in a short interval"
    },
    category: "NOT COMMANDS",
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage(
      `Automatically leave the chat if spammed multiple times in a short interval`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async function ({ api, event, usersData, threadsData }) {
    let { senderID, messageID, threadID, body } = event;

    const prefix = global.GoatBot.config.prefix;
    const otherPrefix = [
      'bard',
      'prefix',
      'ask',
      '.chi',
      '¶sammy',
      '_nano',
      'nano',
      'ai',
      '.ask',
      '!ask',
      '@ask',
      '#ask',
      '$ask',
      '%ask',
      '^ask',
      '*ask',
      '.ai',
      '!ai',
      '@ai',
      '#ai',
      '$ai',
      '%ai',
      '^ai',
      '*ai',
      '?ai',
    ];

    const allPrefixes = [prefix, ...otherPrefix]; // Combine the original prefix and otherPrefix arrays

    // Check if the message starts with any of the prefixes
    if (!body || allPrefixes.every(p => body.indexOf(p) !== 0)) return;

    if (!threadSpamData[threadID]) {
      threadSpamData[threadID] = {
        timeStart: 0,
        count: 0
      };
    }

    const timee = 20; // During `timee` seconds, if spam occurs `num` times, the bot will leave the chat
    const num = 8; // Number of times spam gets detected -1, for example, 5 times 6 times will trigger the auto leave

    const currentTime = Date.now();

    if (currentTime - threadSpamData[threadID].timeStart >= timee * 1000) {
      threadSpamData[threadID].timeStart = currentTime;
      threadSpamData[threadID].count = 1;
    } else {
      threadSpamData[threadID].count++;
      if (threadSpamData[threadID].count >= num) {

        const threadData = await threadsData.get(threadID);
        const userData = await usersData.get(senderID);

        for (const adminID of global.GoatBot.config.adminBot) {
          const leavingMessage = `✧===== Bot Leave =====✧
🚷🚷
Event: Spam Bot Leave
- ThreadID: ${threadID}
- Name: ${threadData.threadName}
- Time: ${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
- Spammer Name: ${userData.name}
- Spammer ID: ${senderID}`;
          api.sendMessage(leavingMessage, adminID);
        }

        api.sendMessage("Spam detected, leaving the group...", threadID);

        api.removeUserFromGroup(api.getCurrentUserID(), threadID);

        threadSpamData[threadID].count = 0;
      }
    }
  }
};