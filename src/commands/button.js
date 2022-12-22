import { SlashCommandBuilder } from '@discordjs/builders';

const buttonCommand = new SlashCommandBuilder()
  .setName('button')
  .setDescription('button cmd');

export default buttonCommand.toJSON();