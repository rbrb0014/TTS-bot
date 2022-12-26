import { config } from 'dotenv';
import { REST } from '@discordjs/rest';
import { Client, Collection, GatewayIntentBits, Routes, } from 'discord.js';
import fs from 'fs';

config();

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith("2.js"));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  console.log(command);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(BOT_TOKEN);
    console.log(`${client.user.tag} logged in`);
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.default.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});