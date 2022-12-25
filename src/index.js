import { config } from 'dotenv';
import schedule from 'node-schedule';
import { REST } from '@discordjs/rest';
import { createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice';
import { ActionRowBuilder, Client, GatewayIntentBits, Routes, StringSelectMenuBuilder, } from 'discord.js';
import Commands from './commands/commands.js';
import { registerUserModal, ReportUserModal } from './modals/modals.js';
import { buttonClickedMessage } from './messages/messages.js';
import tts from 'google-tts-api';
config();

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

let tts_channel = null;//데이터베이스에 불러오기

client.on('ready', () => { console.log(`${client.user.tag} logged in`); });

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.author.system) return;

  if (message.channel !== tts_channel) return;

  const play = tts.getAudioUrl(message.content, {
    lang: 'ko-KR',
    slow: false,
    host: 'https://translate.google.com',
  })

  const connection = joinVoiceChannel({
    channelId: message.member.voice.channelId,
    guildId: message.guildId,
    adapterCreator: message.guild.voiceAdapterCreator,
  });

  const player = createAudioPlayer();
  const resource = createAudioResource(play);

  connection.subscribe(player);
  player.play(resource);

  console.log('TTS Command executed');
});

client.on('channelCreate', async (createdChannel) => {
  console.log(`${createdChannel.name} 채널 생성됨`);
  createdChannel.send('여기가 터가 그렇게 좋다던데~');
});

client.on('interactionCreate', async (interaction) => {
  console.log(`command name : ${interaction.commandName}, customId : ${interaction.customId}`);
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'order') {
      const actionRowFoodMenu = new ActionRowBuilder().setComponents(
        new StringSelectMenuBuilder().setCustomId('food_options').setOptions([
          { label: 'Cake', value: 'cake' },
          { label: 'Pizza', value: 'pizza' },
          { label: 'Sushi', value: 'sushi' },
        ])
      );
      const actionRowDrinkMenu = new ActionRowBuilder().setComponents(
        new StringSelectMenuBuilder().setCustomId('drink_options').setOptions([
          { label: 'Orange Juice', value: 'orange_juice' },
          { label: 'Coca-Cola', value: 'coca_cola' },
        ])
      );

      await interaction.reply({
        components: [
          actionRowFoodMenu.toJSON(),
          actionRowDrinkMenu.toJSON()
        ],
      });

    } else if (interaction.commandName === 'register') {
      interaction.showModal(registerUserModal);
    } else if (interaction.commandName === 'button') {
      interaction.reply(buttonClickedMessage);
    } else if (interaction.commandName === 'schedule') {
      const message = interaction.options.getString('message');
      const delaytime = interaction.options.getInteger('time');
      const channel = interaction.options.getChannel('channel');

      const date = new Date(new Date().getTime() + delaytime);
      interaction.reply({
        content: `Your message has been scheduled for ${date.toTimeString()}`,
        ephemeral: true,
      });
      schedule.scheduleJob(date, () => { channel.send({ content: message, }); });

      console.log(`send "${message}" on ${date} to ${channel}.`);
    } else if (interaction.commandName === 'set') {
      tts_channel = interaction.options.getChannel('channel');
      interaction.reply({ content: `TTS activated in ${tts_channel}.` });
      //데이터베이스에 저장 필요
    }
  } else if (interaction.isAnySelectMenu()) {
    console.log('Select Menu');

    if (interaction.customId === 'food_options') {
      console.log(interaction.values);
      interaction.showModal(registerUserModal);
    } else if (interaction.customId === 'drink_options') {
      console.log(interaction.values);
      interaction.reply('No, you must need Coke Zero.');
    }

  } else if (interaction.isModalSubmit()) {
    console.log('Modal Submitted...');
    if (interaction.customId === 'registerUserModal') {
      console.log(interaction.fields.getTextInputValue('username'));
      interaction.reply({
        content: 'You successfully submitted your details!',
      });
    }
    // else if (interaction.customId === 'reportUserModal') {
    //   console.log(interaction.fields.getTextInputValue('reportMessage'));
    //   interaction.reply({
    //     content: `Successfully report user ${interaction.targetUser}`
    //   });
    // }
  } else if (interaction.isButton()) {
    console.log(`Button interaction ${interaction.componentType}, ${interaction.customId}`);
    interaction.reply({ content: `Thanks for clicking on the '${interaction.customId}' button!` });
  } else if (interaction.isUserContextMenuCommand()) {
    console.log(interaction.commandName);
    if (interaction.commandName === 'ReportUser') {
      await interaction.showModal(ReportUserModal);
      await interaction.awaitModalSubmit({
        filter: (i) => {
          console.log('Await Modal Submit...');
          return i.customId === 'reportUserModal';
        },
        time: 10_000,//ms
      }).then((reportUserModalSubmitInteraction) => {
        console.log({
          type: 'ReportUser',
          reportingUserId: interaction.user.id,
          reportedUserId: interaction.targetMember.user.id,
          reason: reportUserModalSubmitInteraction.fields.getTextInputValue('reportMessage'),
        });

        reportUserModalSubmitInteraction.reply({
          content: `Thank you for reporting ${interaction.targetMember
            }.\nReason : ${reportUserModalSubmitInteraction.fields.getTextInputValue(
              'reportMessage'
            )}`,
          ephemeral: true,//작성자만 보이게
        });
      }).catch(console.log);
    }
  } else if (interaction.isMessageContextMenuCommand()) {
    console.log(interaction.commandName);
    if (interaction.commandName === 'ReportText') {
      await interaction.showModal(ReportUserModal);
      await interaction.awaitModalSubmit({
        filter: (i) => {
          console.log('Await Modal Submit...');
          return i.customId === 'reportTextModal';
        },
        time: 10_000,//ms
      }).then((reportTextModalSubmitInteraction) => {
        console.log({
          type: 'ReportText',
          reportingUserId: interaction.user.id,
          reportedUserId: interaction.targetMessage.author.id,
          reason: reportTextModalSubmitInteraction.fields.getTextInputValue('reportMessage'),
          content: interaction.targetMessage.content,
          component: interaction.targetMessage.components,
          attachment: interaction.targetMessage.attachments,
        });

        reportTextModalSubmitInteraction.reply({
          content: `Thank you for reporting ${interaction.targetMessage.author.id
            }.\nReason : ${reportTextModalSubmitInteraction.fields.getTextInputValue(
              'reportMessage'
            )}`,
          ephemeral: true,//작성자만 보이게
        });
      }).catch(console.log);
    }
  }
});

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), {
      body: Commands,
    });
    client.login(BOT_TOKEN);
  } catch (err) {
    console.error(err);
  }
}

main();