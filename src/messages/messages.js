import { ButtonBuilder, ButtonStyle } from 'discord.js';

export const buttonClickedMessage = {
  content: 'Hello, World!',
  components: [
    new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId('button1')
        .setLabel('Button 1')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('button2')
        .setLabel('Button 2')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setLabel('Discord.js Docs')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.js.org/'),
      new ButtonBuilder()
        .setCustomId('button4')
        .setLabel('Button 4')
        .setStyle(ButtonStyle.Danger),
    )
  ]
};