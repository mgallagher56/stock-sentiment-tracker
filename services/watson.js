const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { setIntervalAsync } = require('set-interval-async/dynamic');
const { clearIntervalAsync } = require('set-interval-async');
const delay = require('delay');
const dbService = require('./dbService');
const calculations = require('../functions/helpers/calculations');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-08-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API,
    }),
    serviceUrl: process.env.WATSON_URL,
});

const analyseSentiment = async (db, tweetArray, companyNameLower, stockNameLower, interval) => {
    let watsonScoreArray = [];

    if (tweetArray.length) {
        const tweetNumber = tweetArray.length;
        const timer = setIntervalAsync(async () => {
            for (let i = 0; i < tweetNumber; i++) {
                const tweet = tweetArray[ i ];

                if ('undefined' !== tweet && tweet) {
                    const lowerCaseTweet = tweet.data.text.toLowerCase();
                    const analyzeParams = {
                        'text': lowerCaseTweet,
                        'features': {
                            'sentiment': {
                                'targets': [
                                    companyNameLower,
                                    '@' + companyNameLower,
                                    '#' + companyNameLower,
                                    stockNameLower
                                ]
                            }
                        }
                    };

                    // make sure tweet contains company name or stock name
                    if (lowerCaseTweet.includes(companyNameLower) || lowerCaseTweet.includes(stockNameLower)) {
                        await naturalLanguageUnderstanding.analyze(analyzeParams)
                            .then(analysisResults => {
                                const tweetScore = calculations.calculateTweetScore(tweet, analysisResults);
                                if (0 !== tweetScore && analysisResults.status === 200 && !watsonScoreArray.includes(tweetScore)) {
                                    watsonScoreArray.push(tweetScore);
                                }
                            })
                            .catch(err => {
                                console.log('error:', err);
                            });
                    }
                }
            }
        }, 250)

        // get average score and time and add to db
        await delay(interval);
        await clearIntervalAsync(timer)
        if (watsonScoreArray.length) {
            const watsonScoreAvg = calculations.getAverageFromArray(watsonScoreArray);
            const dateTime = calculations.getNearestTime(interval);
            let tweetData = {
                dateTime: dateTime,
                tweetScore: watsonScoreAvg
            };

            dbService.addToDb(db, companyNameLower, tweetData, (result) => { })
            watsonScoreArray = [];
        }

    }
}

module.exports.naturalLanguageUnderstanding = naturalLanguageUnderstanding;
module.exports.analyseSentiment = analyseSentiment;
