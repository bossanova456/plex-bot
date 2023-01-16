const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { searchForShow, addShow, getRootFolder } = require('./call-services');
const CONSTANTS = require('./constants');

const MAX_ENTRIES_IN_RESPONSE_LIST = 5;

const buildShowSelectMenu = interaction => {
	searchForShow(interaction.options.getString('showname')).then(data => {
		const paginatedResults = data.slice(0, MAX_ENTRIES_IN_RESPONSE_LIST);

		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('select-search')
					.setPlaceholder('Nothing selected')
					.addOptions(
						paginatedResults.map(result => {
							return {
								label: result.title,
								description: (() => {
									if (!result.overview) return '< No description found >';
									else if (result.overview.length > 100) return result.overview.slice(0, 97) + '...';
									else return result.overview;
								})(),
								value: '' + result.tvdbId,
							};
						}),
					),
			);

		interaction.editReply({ content: 'Select one of the following:', components: [ row ] });
	});
};

const respondToMenuSelection = async interaction => {
	// Get show name from original menu component based on tvdbId from the interaction
	const selectedShowName = interaction.component.data.options
		.filter(o => o.value === interaction.values[0])[0].label;

	let selectedShow;

	// Perform search again to get all show data
	await searchForShow(selectedShowName).then(data => {
		selectedShow = data.filter(d => d.tvdbId === parseInt(interaction.values[0]))[0];
	});

	console.log("Received selection: " + selectedShow.title);

	// Set quality & language profiles
	selectedShow.qualityProfileId = CONSTANTS.QUALITY_PROFILE_1080P;
	selectedShow.languageProfileId = CONSTANTS.LANGUAGE_PROFILE_ENG;

	// Set monitored flag to true
	selectedShow.monitored = true;

	// Set options
	selectedShow.addOptions = {
		'monitor': 'all',
		'searchForMissingEpisodes': true,
		'searchForCutoffUnmetEpisodes': true,
	};

	// Use season folders when organizing episodes
	selectedShow.seasonFolder = true;

	// Get root folder for show (assume only one root folder)
	await getRootFolder().then(data => {
		selectedShow.rootFolderPath = data[0].path;
	});

	await addShow(selectedShow).then(addShowResData => {
		console.log("Res data: " + JSON.stringify(addShowResData));
	});

	interaction.editReply({ content: 'Received selection: ' + selectedShow.title, components: [] });
};

module.exports = {
	buildShowSelectMenu,
	respondToMenuSelection,
};