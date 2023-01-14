const http = require('http');
const { SONARR_URI, SONARR_PORT, SONARR_API_KEY } = require("dotenv").config().parsed;
const CONSTANTS = require('./constants');

const callSonarr = (path, method) => {
	return new Promise(function(resolve, reject) {
		const options = {
			host: SONARR_URI,
			port: SONARR_PORT,
			path: path,
			method: method,
			headers: {
				'X-Api-Key': SONARR_API_KEY,
				'Content-Type': 'application/json',
				'Connection': 'keep-alive',
			},
		};

		try {
			http.request(options, (res) => {
				console.log(res.statusCode + " : " + path + " : " + res.statusMessage);

				const body = [];
				res.on("data", d => {
					body.push(d);
				});

				res.on("end", () => {
					resolve(JSON.parse(Buffer.concat(body).toString()));
				});
			}).on('error', err => {
				console.log("Error: " + err);
			}).end();
		} catch (e) {
			reject(e);
		}
	});
};

const searchForShow = showName => {
	return callSonarr(CONSTANTS.SONARR_SEARCH_SERIES_PATH + encodeURIComponent(showName), CONSTANTS.HTTP_GET);
};

module.exports = {
	searchForShow,
};