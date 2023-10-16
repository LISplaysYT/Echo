const BoilerplateClient = require("./src/util/client");
const ChalkAdvanced = require("chalk-advanced");
const EmbedBuilder = require("discord.js")
const Events = require("discord.js")
const { connect } = require("mongoose");
require("dotenv").config();

const client = new BoilerplateClient();

client.login(process.env.TOKEN);

client.on("ready", async () => {
  console.log(
    `${ChalkAdvanced.white("Boilerplate Bot")} ${ChalkAdvanced.gray(
      ">"
    )} ${ChalkAdvanced.green("Bot successfully started. ")}`
  );
  await connect(process.env.databaseToken); {
    console.log(
      `${ChalkAdvanced.green("[DATABASE]")} ${ChalkAdvanced.gray(
        ">"
      )} ${ChalkAdvanced.white("Successfully connected to MongoDB")}`
    );
  }
});
