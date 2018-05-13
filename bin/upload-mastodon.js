#!/usr/bin/env node
/*eslint no-console:0 */

require('dotenv').config();

const path = require('path');
const Masto = require('mastodon');
const fs = require('fs');
const reporter = require('./tools/reporter.js');
const config = require('../.pancakerc');

if(process.env.MC_MASTO_TOKEN){
	var M = new Masto({
		access_token: process.env.MC_MASTO_TOKEN,
		timeout_ms: 120*1000,
		api_url: process.env.MC_MASTO_API,
	})
	var media = path.join(config.paths.build,config.filenames.base+'.jpg');
	var id;
	M.post('media', {
		file: fs.createReadStream(media)
	}).then(resp => {
		id = resp.data.id;
		M.post('statuses', {
			status: '',
			media_ids: [id]
		})
	})
} else {
	reporter.error('Missing env variables');
}
