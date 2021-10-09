const { TwitterApi, ETwitterStreamEvent } = require('twitter-api-v2');
const dbService = require('./dbService');
const watson = require('./watson');

const twitterStream = async (db) => {
    const client = new TwitterApi(process.env.TWITTER_TOKEN);  // (create a client)
    const rules = await client.v2.streamRules();

    // Add our rules
    await client.v2.updateStreamRules({
        add: [ { value: '@Apple' }, { value: '#apple' }, { value: 'AAPL' } ],
    }).catch();

    const stream = await client.v2.searchStream({
        expansions: [ 'author_id' ],
        'user.fields': [ 'public_metrics' ],
        'tweet.fields': [ 'referenced_tweets', 'public_metrics' ]
    }).catch();

    // Enable auto reconnect
    stream.autoReconnect = true;

    // When tweet is sent analyse sentiment and add to db
    stream.on(ETwitterStreamEvent.Data, async tweet => {
        if (!('referenced_tweets' in tweet.data)) {
            const lowerCaseTweet = tweet.data.text.toLowerCase()
            if (lowerCaseTweet.includes('apple') || lowerCaseTweet.includes('aapl')) {
                watsonAnalysis = await watson.analyseSentiment(tweet.data.text, 'apple', 'AAPL');
                dbService.addTweetToDb(db, 'apple', tweet, watsonAnalysis, (result) => { })
            }
        }
    })

    // const stream = await client.v2.searchStream();

    // // Awaits for a tweet
    // stream.on(
    //     // Emitted when Node.js {response} emits a 'error' event (contains its payload).
    //     ETwitterStreamEvent.ConnectionError,
    //     err => console.log('Connection error!', err),
    //   );

    //   stream.on(
    //     // Emitted when Node.js {response} is closed by remote or using .close().
    //     ETwitterStreamEvent.ConnectionClosed,
    //     () => console.log('Connection has been closed.'),
    //   );

    //   stream.on(
    //     // Emitted when a Twitter payload (a tweet or not, given the endpoint).
    //     ETwitterStreamEvent.Data,
    //     eventData => console.log('Twitter has sent something:', eventData),
    //   );

    //   stream.on(
    //     // Emitted when a Twitter sent a signal to maintain connection active
    //     ETwitterStreamEvent.DataKeepAlive,
    //     () => console.log('Twitter has a keep-alive packet.'),
    //   );

    //   // Enable reconnect feature
    //   stream.autoReconnect = true;

    // Be sure to close the stream where you don't want to consume data anymore from it
    //   stream.close();
}

module.exports.twitterStream = twitterStream;
