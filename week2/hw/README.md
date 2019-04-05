# Homework 2

The goal of the homework this week is to get you comfortable with async/await and writing your own types. Hopefully, the work this week will be a little more interesting than last week.

Before you start, fill out the "TEMPLATE.env" file in the root directory. Any of the variables in that code can be called by writing `process.env.EMAIL` or whatever your variable is. After you fill it out **AND BEFORE YOU COMMIT**, change the file's name to `.env` so it gets gitignored.

## Async stuff

You'll be doing the same task 3 times. Once with callbacks, once with promises and lastly with async/await. I'll start by outlining the task and then any quirks you'll have to address for each. The functions and calls for each have already been written.

### The Task

Basic guidelines:

- Unless otherwise noted, you should make a GET request to every API.
- You should write an interface for every API's return. Remember that you can open any API in your browser. Use that to document what the types of everything should be. I strongly recommend you read up on interfaces first. Here's a good start: https://www.typescriptlang.org/docs/handbook/interfaces.html.
- Most of the APIs here will return an array of objects which means you should be able to document an object and then say the type expected will be `ThatObject[]`.
- Interfaces should be named with capital camel case LikeThis.
- You should be able to reuse type declaration between exercises.

Let's say that I want to get the weather from an API. This is actually a significantly harder task than it sounds because the API we'll be using doesn't offer the ability to just ask for the weather from a human readable location like "Vanderbilt University". Instead, it wants the latitude and longitude. So, we'll have to query another API to get this done. That'll be [this](https://nominatim.openstreetmap.org/?format=json&q=Nashville&format=json&limit=3) API. Notice the "q=Nashville" in the middle. That's where you put the query for what you want geocoded. You can easily use a template string for this like so:

```ts
const place = 'Vanderbilt University';
// remember to use process.env to get your email
const url = `https://nominatim.openstreetmap.org/?format=json&q=${place}&format=json&limit=3&email=YOUR_EMAIL`;
// the ${} notation lets us include a variable instead of doing irritating string concatenation.
// they promise to not email your email but if you're worried, generate a temp one from mailinator.com
```

After you get the `lat` and `lon` properties from that API, we're going to use the Dark Sky API to get the weather at your chosen location. The url for that is: `https://api.darksky.net/forecast/THE_API_KEY_THAT_I_WILL_POST_IN_SLACK/37.8267,-122.4233` (that's latitude followed by longitude, separated by a comma). Use a template string to insert the API key and the correct latitude/longitude. From that API, you're going to want to return:

```ts
// json is the data from the Dark Sky API.
const rtn = `It's ${json.currently.summary} and it's ${json.currently.temperature} degrees.`; // for the temperature, round to the nearest degree.
```

NOTE: I get 1000 free API calls from the Dark Sky API. That should definitely be enough, provided no one abusively queries it. Please don't do that.

Then, make a request to:

```ts
// data matches the interface of WeatherUpdate
const url = `https://send-to-slack-nfp4cc31q.now.sh/?user=C9S0DF3BR&data=${data}`;
// if this works, you should see something in #testchannel in Slack
```

Finally, install the `sha1` module from npm (and any needed typings files). Import it into typescript (without using require). The final API will return a property `sha1`. You should do the following

```ts
// data is the object you created that matches WeatherUpdate
// slackApiJson is the return from the finalAPI
console.log(JSON.stringify(slackApiJson.sha1) === sha1(data)); // should print true
```

### Specific Callbacks Instructions/Tips

Note that the "body" parameter in the callback contains the JSON returned each time. It's a string for ??? reasons so you might have to add `body = JSON.parse(body)` to get it to properly work. You can us the `|` operator with the types to get that to work, i.e.:

```ts
let blah: boolean | string = true;
blah = 'hi'; // good
blah = 2; // bad; it isn't a number
```

Also note that you might have to access the body from a previous request in a callback to a different request (there are ways around this because several APIs return a needed piece of data). The only way to do this is to give the bodies different names (geocodeBody, darkSkyBody etc) so as to avoid scoping issues. That just involves changing the param name in the callback for `body`.

## Koa/deploy stuff!

Use `ts-node` to run `server.ts`. You should be able to open `localhost:3000` in your web browser (might have to preface with http://) and see "Hello World". Your job is to import `asyncAwait` from your HW file (it's already been exported) and have its return show up instead of "Hello World". This should involve writing one new line of code and changing one line. You'll know it works when you see the status/sha1 in `localhost:3000`. Note that you'll have to retstart the `ts-node` process to reflect changes to your code. Before you do the importing, comment out any line of code that logs anything in `hw.ts`.

After that, click the "deploy to Heroku" button in the main README. You'll have to sign up for a(free) account but you should get a URL. The same thing you saw in localhost should show up at `YOUR_HEROKU_URL:3000`. Write that URL here:
