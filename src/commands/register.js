import { SlashCommandBuilder } from 'discord.js';

const registerCommand = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register a user to the server officially');

export default registerCommand.toJSON();