/*global await*/
const https = require("https");
const Clubhouse = require("clubhouse-lib");

exports.handler = async (event, context, callback) => {
  console.log("Received event: " + JSON.stringify(event));
  var payloadText = undefined;
  if (
    event.actions[0].entity_type == "story" &&
    event.actions[0].action == "update" &&
    event.actions[0].changes.completed.new
  ) {
    const client = Clubhouse.create(process.env.CLUBHOUSE_API_TOKEN);
    const story = await client.getStory(event.actions[0].id);
    let completeMessage = "Story completed: " + story.story_type;
    if (story.story_type == "bug") {
      completeMessage = "Bug fixed";
    } else if (story.story_type == "feature") {
      completeMessage = "Feature shipped";
    } else if (story.story_type == "chore") {
      completeMessage = "Chore completed";
    }
    payloadText =
      "*" +
      completeMessage +
      "*: *<" +
      event.actions[0].app_url +
      "|" +
      event.actions[0].name +
      ">* [#" +
      event.actions[0].id +
      "]";
    if (story.owner_ids.length) {
      const member = await client.getMember(story.owner_ids[0]);
      payloadText += " owned by " + member.profile.name;
    }
    if (story.estimate === 1) {
      payloadText += " (1 pt)";
    } else if (story.estimate) {
      payloadText += " (" + story.estimate + " pts)";
    }
  }

  if (payloadText) {
    console.log("Sending Slack message: " + payloadText);
    const payload = JSON.stringify({
      text: payloadText,
      channel: process.env.SLACK_CHANNEL,
      icon_url:
        "https://avatars.slack-edge.com/2018-11-01/469021388864_b4432f702d54503e0e03_192.png",
      username: "Clubhouse"
    });

    const options = {
      hostname: "hooks.slack.com",
      method: "POST",
      path: process.env.SLACK_WEBHOOK_URL.substring(
        "https://hooks.slack.com".length
      )
    };

    const req = https.request(options, res =>
      res.on("data", () => callback(null, "OK"))
    );
    req.on("error", error => callback(JSON.stringify(error)));
    req.write(payload);
    req.end();
  }
};
