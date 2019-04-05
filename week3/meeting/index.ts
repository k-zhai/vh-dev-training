/**
 * Simple Koa server with some examples of routing and middleware extension
 * Written by @IrfaanKhalid
 */

import Koa from 'koa';
import KoaRouter from 'koa-router';
import fetch from 'node-fetch';

const PORT = 3000;

const app = new Koa();
const router = new KoaRouter(); // Middleware library!

// Here's an empty path
router.get('/', ctx => {
	ctx.body = 'The Bushes sponsor VandyHacks';
});

// Let's get a bit more interesting...
router.get('/log', ctx => {
	ctx.body = 'Check your console ;)';
	console.log(`Logged at ${new Date()}`);
});

// Okay, but what can we really do?
router.get('/weather', async ctx => {
	// Let's assume we get a request with a "zip"; we'll grab the query
	const { query } = ctx.request;

	// Next, let's use this ZIP code to hit the OpenStreetMap API
	const geoDataJson: any = await (await fetch(
		`https://nominatim.openstreetmap.org/?format=json&q=${query.zip}`
	)).json();

	const latitude: any = geoDataJson[0].lat;
	const longitude: any = geoDataJson[1].lon;

	// Great! Now we can get some weather data.
	const weatherDataJson: any = await (await fetch(
		`https://api.darksky.net/forecast/436b7ccabd9a90440c7fed694e71d54f/${latitude},${longitude}`
	)).json();

	ctx.body = {
		lat: latitude,
		lon: longitude,
		weather: `It's ${weatherDataJson.currently.summary} and it's ${
			weatherDataJson.currently.temperature
		} degrees.`,
	};
});

// Set up our app to use our defined routes
app.use(router.routes()).use(router.allowedMethods());

// Let's launch!
app.listen(PORT, () => {
	console.log(`>>> Server started at http://localhost:${PORT}`);
});
