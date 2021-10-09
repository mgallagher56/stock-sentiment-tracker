const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2021-08-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API,
    }),
    serviceUrl: process.env.WATSON_URL,
});

const analyseSentiment = async (text, companyName, stockName) => {
    const analyzeParams = {
        'text': text,
        'features': {
            'sentiment': {
                'targets': [
                    companyName,
                    '@' + companyName,
                    '#' + companyName,
                    stockName
                ]
            }
        }
    };

    await naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return JSON.stringify(analysisResults, null, 2);
        })
        .catch(err => {
            console.log('error:', err);
        });
}

module.exports.naturalLanguageUnderstanding = naturalLanguageUnderstanding;
module.exports.analyseSentiment = analyseSentiment;
