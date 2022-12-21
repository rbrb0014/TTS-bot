const { config } = require('dotenv');
const { Client, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

config();

const TOKEN = process.env.TUTORIAL_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.on('ready', () => { console.log(`${client.user.tag} logged in`); });

client.on('interactionCreate', (interaction) => {
  if (interaction.isChatInputCommand()) {
    const food = interaction.options.get('food').value;
    const drink = interaction.options.get('drinkt').value;
    interaction.reply({ content: `You ordered ${food} and ${drink}` });//get value of food
  }
});

async function main() {
  const commands = [
    {
      name: 'order',
      description: 'Order something',
      options: [
        {
          name: 'food',
          description: 'the type of food',
          type: 3, //string
          required: true,
          choices: [ //필수선택, 다른 값 입력 금지
            {
              name: 'Cake', //뜨는 형식
              value: 'cake', //실제 입력 폼
            },
            {
              name: 'Hamburger',
              value: 'hamburger',
            },
          ]
        },
        {
          name: 'drink',
          description: 'the type of drink',
          type: 3,
          required: true,
          choices: [
            {
              name: 'Water',
              value: 'water',
            },
            {
              name: 'Coca-Cola',
              value: 'coca-cola',
            },
            {
              name: 'Sprite',
              value: 'sprite',
            },
          ],
        },
      ],
    },
  ];

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    client.login(TOKEN);
    // console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.error(err);
  }
}

main();