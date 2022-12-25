import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export const registerUserModal = new ModalBuilder()
  .setTitle('Register User Form')
  .setCustomId('registerUserModal')
  .setComponents(
    new ActionRowBuilder().setComponents(
      new TextInputBuilder()
        .setCustomId('username')
        .setLabel('username')
        .setStyle(TextInputStyle.Short)
    ),
    new ActionRowBuilder().setComponents(
      new TextInputBuilder()
        .setCustomId('email')
        .setLabel('email')
        .setStyle(TextInputStyle.Short)
    ),
    new ActionRowBuilder().setComponents(
      new TextInputBuilder()
        .setCustomId('comment')
        .setLabel('comment')
        .setStyle(TextInputStyle.Paragraph)
    )
  );

export const ReportUserModal = new ModalBuilder()
  .setCustomId('reportUserModal')
  .setTitle('Report a User')
  .setComponents(
    new ActionRowBuilder().setComponents(
      new TextInputBuilder()
        .setCustomId('reportMessage')
        .setLabel('Report Message')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMinLength(10)
        .setMaxLength(500)
    )
  );