const calculateTweetScore = (tweet, watsonData) => {
    const watsonScore = watsonData.result.sentiment.targets[ 0 ].score;
    const tweetFollowers = tweet.includes.users[ 0 ].public_metrics.followers_count;
    return watsonScore * tweetFollowers;
}

const getAverageFromArray = (arr) => {
    console.log(arr);
    let total = 0;
    let count = 0;

    arr.forEach(value => {
        total += value;
        count++;
    });

    return total / count;
}

const getNearestTime = (interval) => {
    let date = new Date();
    return Date(Math.round(date.getTime() / interval) * interval);
}

module.exports.getAverageFromArray = getAverageFromArray;
module.exports.calculateTweetScore = calculateTweetScore;
module.exports.getNearestTime = getNearestTime;
