import { SlashCommandBuilder } from 'discord.js';

const banCommand = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Bans a user from the guild.')
  .addSubcommandGroup((group) =>
    group
      .setName('group_a')
      .setDescription('group a')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('temp')
          .setDescription('Temporary bans a user')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('user to be banned')
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('perma')
          .setDescription('Permanently bans a user')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('user to be banned')
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName('group_b')
      .setDescription('group b')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('soft')
          .setDescription('soft ban')
          .addUserOption((option) =>
            option
              .setName('user')
              .setDescription('user to be banned')
          )
      )
  );

export default banCommand.toJSON();