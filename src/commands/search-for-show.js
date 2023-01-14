const { SlashCommandBuilder } = require('discord.js');
const { buildShowSelectMenu } = require('../sonarr');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search-for-show')
		.setDescription('Searches for a show in sonarr')
		.addStringOption(option =>
			option.setName('showname')
				.setDescription('The name of the show')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();

		buildShowSelectMenu(interaction);
	},
};