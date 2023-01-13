const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { searchForShow } = require('../call-services');

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

		searchForShow(interaction.options.getString('showname')).then(data => {
			const paginatedResults = data.slice(0, 5);

			const row = new ActionRowBuilder()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('select')
						.setPlaceholder('Nothing selected')
						.addOptions(
							paginatedResults.map(result => {
								return {
									selectMenuName: 'search-for-show',
									label: result.title,
									description: (result.overview.length > 100 ? result.overview.slice(0, 97) + '...' : result.overview),
									value: '' + result.tvdbId,
								};
							}),
						),
				);

			interaction.editReply({ content: 'Select one of the following:', components: [ row ] });
		});
	},
};