const { TwitterApi, ETwitterStreamEvent } = require('twitter-api-v2');
const dbService = require('./dbService');
const watson = require('./watson');
const calculations = require('../functions/helpers/calculations')

const twitterStream = async (db, companyName, stockName, addToDbIntervalMins) => {
    const client            = new TwitterApi(process.env.TWITTER_TOKEN);  // (create a client)
    const rules             = await client.v2.streamRules();
    const companyNameLower  = companyName.toLowerCase();
    const stockNameLower    = stockName.toLowerCase();
    const interval          = 1000 * 60 * addToDbIntervalMins
    let   twitterScoreArray = [];

    // Add our rules
    await client.v2.updateStreamRules({
        add: [ { value: '@' + companyName }, { value: '#' + companyNameLower }, { value: stockName } ],
    }).catch();

    const stream = await client.v2.searchStream({
        expansions: [ 'author_id' ],
        'user.fields': [ 'public_metrics' ],
        'tweet.fields': [ 'referenced_tweets', 'public_metrics' ]
    }).catch();

    // Enable auto reconnect
    stream.autoReconnect = true;

    // When tweet is sent, analyse sentiment, push to array, average after 1 minute and add average to db
    stream.on(ETwitterStreamEvent.Data, async tweet => {
        // check if original tweet, not quote or retweet
        if (!('referenced_tweets' in tweet.data)) {
            // make sure tweet contains company name or stock name
            const lowerCaseTweet = tweet.data.text.toLowerCase()
            if (lowerCaseTweet.includes(companyNameLower) || lowerCaseTweet.includes(stockNameLower)) {
                const watsonAnalysis = await watson.analyseSentiment(lowerCaseTweet, companyNameLower, stockNameLower).catch();
                if( 200 === watsonAnalysis.status) {
                    twitterScoreArray.push(calculations.calculateTweetScore(tweet, watsonAnalysis));
                }
            }
        }
    })

    setInterval(() => {
        const twitterScoreAvg = calculations.getAverageFromArray(twitterScoreArray)
        const dateTime        = calculations.getNearestTime(interval);
        let   tweetData       = {
            dateTime  : dateTime,
            tweetScore: twitterScoreAvg
        };

        dbService.addToDb(db, companyNameLower, tweetData, (result) => { })
        twitterScoreArray = [];
    }, interval);

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
