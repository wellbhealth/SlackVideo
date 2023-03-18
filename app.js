const { App } = require("@slack/bolt");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.command("/playvideo", async ({ command, ack, respond }) => {
  await ack();

  const videoUrl = command.text;

  if (!videoUrl) {
    await respond("Please provide a valid video URL.");
    return;
  }

  const videoBlock = {
    type: "video",
    title: {
      type: "plain_text",
      text: "Your Video",
    },
    video_url: videoUrl,
  };

  try {
    await axios.head(videoUrl);
    await respond({
      blocks: [videoBlock],
      response_type: "in_channel",
    });
  } catch (error) {
    console.error(error);
    await respond("Unable to load the video. Please check the URL.");
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Slack app is running!");
})();
