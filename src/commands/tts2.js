const { SlashCommandBuilder } = require('discord.js');
const Tts = require('google-tts-api');
const { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { getTtsChannel } = require('./set2.js');

const queue = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('tts bot executed'),
  execute: async (interaction) => {
    console.log(`${interaction.author.channel}, ${getTtsChannel()}`);
    if (interaction.author.channel !== getTtsChannel()) return;

    const server_queue = queue.get(interaction.guild.id);
    const voice_channel = interaction.member.voice.channel;

    if (!voice_channel)
      return interaction.channel.send("no voice channel exist.");
    let Lang = 'ko-KR';

    const playtext = Tts.getAudioUrl(interaction.content, {
      lang: Lang,
      slow: false,
      host: 'https://translate.google.com',
    })

    if (!server_queue) {
      const queue_constructor = {
        voice_channel: voice_channel,
        text_channel: interaction.channel,
        connection: null,
        texts: [],
      };
      queue.set(interaction.guild.id, queue_constructor);
      queue_constructor.texts.push(playtext);

      try {
        const connection = joinVoiceChannel({
          channelId: voice_channel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        queue_constructor.connection = connection;//연결여부
        audioPlayer(interaction.guild, queue_constructor.texts[0]);
      } catch (err) {
        queue.delete(interaction.guild.id);
        interaction.channel.send("error occurred.");
        throw err;
      }
    } else {
      server_queue.texts.push(playtext);
      return console.log('tts text added');
    }

  },
}

const audioPlayer = async (guild, text) => {
  const text_queue = await queue.get(guild.id);
  //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
  if (!text) {
    // song_queue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  const player = createAudioPlayer();
  let resource = createAudioResource(text);
  await text_queue.connection.subscribe(player);
  player.play(resource);
  player.on(AudioPlayerStatus.Idle, () => {
    text_queue.texts.shift();
    audioPlayer(guild, text_queue.texts[0]);
  })

  return console.log("Some Thing Here");
}