import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord.js';

const scheduleCommand = new SlashCommandBuilder()
  .setName('schedule')
  .setDescription('Schedule a message')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The message to be scheduled')
      .setMinLength(10)
      .setMaxLength(2000)
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('time')
      .setDescription('When to schedule the message')
      .setChoices(
        { name: '15 second', value: 15_000 },
        { name: '1 Minute', value: 60_000 },
        { name: '15 Minute', value: 900_000 },
        { name: '30 Minute', value: 1_800_000 },
        { name: '1 hour', value: 3_600_000 },
      )
      .setRequired(true)
  ).addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel the message should be sent to')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  );

export default scheduleCommand.toJSON();