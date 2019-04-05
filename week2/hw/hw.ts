import request from 'request';
import { Response } from 'request'; // I hate myself everytime I type this
import sha1 from 'sha1';

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

interface WeatherUpdate {
	location: string; // i.e. "Vanderbilt University"
	weather: string; // the format specified in the README
	lat: number;
	lon: number;
	name: string; // your name - use this from process.env
}

interface OSM {
	licence: string,
	osm_type: string,
	osm_id: number,
	boundingbox: string[];
	lat: string,
	lon: string,
	display_name: string,
	class: string,
	type: string,
	importance: number,
	icon: string,
}

interface DarkSky {
	latitude: number,
	longitude: number,
	timezone: string,
	currently: CurrentStatus,
	minutely: object,
	hourly: object,
	daily: object,
	flags: object,
}

interface CurrentStatus {
	time: number,
	summary: string,
	icon: string,
	nearestStormDistance: number,
	precipIntensity: number,
	precipIntensityError: number,
	precipProbability: number,
	precipType: string,
	temperature: number,
	apparentTemperature: number,
	dewPoint: number,
	humidity: number,
	pressure: number,
	windSpeed: number,
	windGust: number,
	windBearing: number,
	cloudCover: number,
	uvIndex: number,
	visibility: number,
	ozone: number,
}

const callbacks = (
	location: string,
	slackUsername: string,
	callback: (body: any) => void
): void => {
	const email = process.env.EMAIL;
	const place = 'Vanderbilt University';
	request(
		// this is just the first call to request. You'll need multiple
		`https://nominatim.openstreetmap.org/?format=json&q=${place}&format=json&limit=3&email=${email}`,
		(error: Error, response: Response, body: string): void => {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
				const newbody = JSON.parse(body) as OSM;
				request(`https://api.darksky.net/forecast/${process.env.DARK_SKY_TOKEN}/${newbody.lat},${newbody.lon}`,
					(error: Error, response: Response, body: string): void => {
						if (error) {
							console.log(error);
						} else {
							const json = JSON.parse(body) as DarkSky;
							const rtn = `It's ${json.currently.summary} and it's ${json.currently.temperature} degrees.`;
							const data = {
								location: newbody.display_name,
								weather: rtn,
								lat: +newbody.lat,
								lon: +newbody.lon,
								name: process.env.NAME as string,
							} as WeatherUpdate;
							request(`https://send-to-slack-nfp4cc31q.now.sh/?user=C9S0DF3BR&data=${data}`,
								(error: Error, response: Response, body: any): void => {
									if (error) {
										console.log(error);
									} else {
										console.log(JSON.stringify(body.sha1) === sha1(data))
									}
								}
							);
						}
					}
				);
			}
		}
	);
};

// // change Promise<object> to Promise<TheTypeThatYouAreMaking> for both functions
// const promises = (location: string, slackUsername: string): Promise<object> => {
// 	// use fetch
// };
// export const asyncAwait = async (location: string, slackUsername: string): Promise<object> => {
// 	// use fetch
// };

// // all the console.logs should log what the send-to-slack API returns
// callbacks('Vanderbilt University', 'YOUR_SLACK_USER_ID', body => {
// 	console.log(body);
// }); // feel free to change the place. It'll be more interesting if everyone's not doing the same place.

// promises('Vanderbilt University', 'D44FTVCHJ').then(data => console.log(data));

// (async () => {
// 	console.log(await asyncAwait('Vanderbilt University', 'D44FTVCHJ'));
// })();
