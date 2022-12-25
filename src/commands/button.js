import { SlashCommandBuilder } from 'discord.js';

const buttonCommand = new SlashCommandBuilder()
  .setName('button')
  .setDescription('button cmd');

export default buttonCommand.toJSON();