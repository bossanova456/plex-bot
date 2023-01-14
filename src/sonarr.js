const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { searchForShow } = require('./call-services');

const buildShowSelectMenu = interaction => {
	searchForShow(interaction.options.getString('showname')).then(data => {
		const paginatedResults = data.slice(0, 5);

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select-search')
					.setPlaceholder('Nothing selected')
					.addOptions(
						paginatedResults.map(result => {
							return {
								label: result.title,
								description: (result.overview.length > 100 ? result.overview.slice(0, 97) + '...' : result.overview),
								value: '' + result.tvdbId,
							};
						}),
					),
			);

		interaction.editReply({ content: 'Select one of the following:', components: [ row ] });
	});
};

const respondToMenuSelection = interaction => {
	// Get show name from original menu component based on tvdbId from the interaction
	const selectedShowName = interaction.component.data.options.filter(o => o.value === interaction.values[0])[0].label;

	// Perform search again to get all show data
	searchForShow(selectedShowName).then(data => {
		const selectedShow = data.filter(d => d.tvdbId === parseInt(interaction.values[0]))[0];

		console.log("Received selection: " + selectedShow.title);
	});
};

module.exports = {
	buildShowSelectMenu,
	respondToMenuSelection,
};