import { config } from 'dotenv';
import { Client, GatewayIntentBits, Routes, User } from 'discord.js';
import { ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import OrderCommand from './commands/order.js';
import RolesCommand from './commands/roles.js';
import UsersCommand from './commands/user.js';
import ChannelsCommand from './commands/channel.js';
import BanCommand from './commands/ban.js';

config();

const TOKEN = process.env.TUTORIAL_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => { console.log(`${client.user.tag} logged in`); });

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'order') {
      console.log('Order Command');
      console.log(interaction);
      const actionRowComponent = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder().setCustomId('food_options').setOptions([
          { label: 'Cake', value: 'cake' },
          { label: 'Pizza', value: 'pizza' },
          { label: 'Sushi', value: 'sushi' },
        ])
      );
      const actionRowDrinkMenu = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder().setCustomId('drink_options').setOptions([
          { label: 'Orange Juice', value: 'orange_juice' },
          { label: 'Coca-Cola', value: 'coca_cola' },
        ])
      );
      interaction.reply({
        components: [actionRowComponent.toJSON(), actionRowDrinkMenu.toJSON()],
      });
    }
  } else if (interaction.isAnySelectMenu()) {
    if(interaction.customId === 'food_options'){
      console.log(interaction.values);
    }
    if(interaction.customId === 'drink_options'){
      console.log(interaction.values);
    }

    interaction.reply({
      content:'wow',
    })
  }
});

async function main() {
  const commands = [OrderCommand, RolesCommand, UsersCommand, ChannelsCommand, BanCommand];
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
  } catch (err) {
    console.error(err);
  }
}

main();