const http = require('http');
const CONSTANTS = require('./constants');

// Environment variables
let environment;
if (process.env.NODE_ENV !== 'production') {
	environment = require("dotenv").config().parsed;
} else {
	environment = process.env;
}

const { SONARR_URI, SONARR_PORT, SONARR_API_KEY } = environment;

const callSonarr = (path, method, data = null) => {
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
			const req = http.request(options, (res) => {
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
			});

			if (data) req.write(JSON.stringify(data));
			req.end();
		} catch (e) {
			reject(e);
		}
	});
};

const searchForShow = showName => {
	return callSonarr(CONSTANTS.SONARR_SEARCH_SERIES_PATH + encodeURIComponent(showName), CONSTANTS.HTTP_GET);
};

const addShow = showData => {
	return callSonarr(CONSTANTS.SONARR_ADD_SERIES_PATH, CONSTANTS.HTTP_POST, showData);
};

const getRootFolder = () => {
	return callSonarr(CONSTANTS.SONARR_GET_ROOT_FOLDER_PATH, CONSTANTS.HTTP_GET);
};

module.exports = {
	searchForShow,
	addShow,
	getRootFolder,
};