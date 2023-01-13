const http = require('http');
const { SlashCommandBuilder } = require('discord.js');
const { SONARR_URI, SONARR_PORT, SONARR_API_KEY } = require("dotenv").config().parsed;

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

		const options = {
			host: SONARR_URI,
			port: SONARR_PORT,
			path: '/api/v3/series/lookup?term=' + encodeURIComponent(interaction.options.getString('showname')),
			method: 'GET',
			headers: {
				'X-Api-Key': SONARR_API_KEY,
				'Content-Type': 'application/json',
				'Connection': 'keep-alive',
			},
		};

		// options.agent = new http.Agent();

		http.request(options, (res) => {
			console.log(res.statusCode + ": " + res.statusMessage);
			const body = [];
			res.on("data", d => {
				body.push(d);
			});

			res.on("end", () => {
				const resData = JSON.parse(Buffer.concat(body).toString());
				// console.log("Data: " + JSON.stringify(resData));
			});
		}).on('error', err => {
			console.log("Error: " + err);
		}).end();

		await interaction.editReply('WIP');
	},
};