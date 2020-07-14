const jokes = require('./jokes.json')

exports.handler = async (event) => {
    
    
    let joke = jokes[Math.floor(Math.random()*jokes.length)];
    return joke;
};
