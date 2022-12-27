//const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = require('../config.json');
const dotenv = require('dotenv');
const Path = require('node:path');
const { Client, Collection, GatewayIntentBits, Routes, Events } = require('discord.js');
const fs = require('fs');

dotenv.config();
const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.commands = new Collection();

const commandsPath = Path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('2.js'));//need to be editted

for (const file of commandFiles) {
  const filePath = Path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

client.once(Events.ClientReady, async () => {
  console.log(`${client.user.tag} logged in`);
});

client.login(BOT_TOKEN);