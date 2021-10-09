const calculateTweetScore = (tweet, watsonData) => {
    const watsonScore    = watsonData.result.sentiment.targets[0].score;
    const tweetFollowers = tweet.includes.users[0].public_metrics.followers_count;
    return watsonScore * tweetFollowers;
}

const getAverageFromArray = (arr) => {
    const sum = arr.reduce((a, b) => a + b, 0);
    return (sum / arr.length) || 0;
}

const getNearestTime = (interval) => {
    let date = new Date();
    return Date(Math.round(date.getTime() / interval) * interval);
}

module.exports.getAverageFromArray = getAverageFromArray;
module.exports.calculateTweetScore = calculateTweetScore;
module.exports.getNearestTime      = getNearestTime;
