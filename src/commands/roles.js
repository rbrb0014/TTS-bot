import { SlashCommandBuilder } from 'discord.js';

const rolesCommand = new SlashCommandBuilder()
  .setName('addrole')
  .setDescription('Add a role')
  .addRoleOption((option) =>
    option
      .setName('newrole')
      .setDescription('Adds the New Role')
      .setRequired(true)
  );

export default rolesCommand.toJSON();