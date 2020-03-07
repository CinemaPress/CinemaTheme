const ora = require('ora');

module.exports = parameters => {

    const spinner = ora('Loading ...').start();

    return Promise.resolve(parameters)
        .then(require('./lib/scraper'))
        .then(require('./lib/codes'))
        .then(r => {
            spinner.succeed('Success!');
            return r;
        });
};