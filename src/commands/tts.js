import { SlashCommandBuilder } from 'discord.js';

const ttsCommand = new SlashCommandBuilder()
  .setName('tts')
  .setDescription('tts bot executed')

export default ttsCommand.toJSON();