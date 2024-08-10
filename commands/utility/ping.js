const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		// 1. Editing responses
		// await interaction.reply({ content: 'Secret Pong!', ephemeral: true});
		// await wait(2_000);
		// await interaction.editReply('Pong again!');

		//2. Deferred responses
		// await interaction.deferReply();
		// await wait(4_000);
		// await interaction.editReply({ content: 'Secret Pong!', ephemeral: true});

		// Or
		// await interaction.deferReply({ ephemeral: true });
		// await wait(1_000);
		// await interaction.editReply(' 1s Pong! ');

		// 3. Follow-ups
		// await interaction.reply({ content: 'Pong!', ephemeral: true });
		// await interaction.followUp({ content: 'Pong again!', ephemeral: true });

		// 4. Fetching & Deleting responses
		await interaction.reply({ content: 'Pong!', ephemeral: true });
		await wait(2_000);
		await interaction.deleteReply();
	},
};