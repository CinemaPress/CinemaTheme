const ora = require('ora');

module.exports = parameters => {

    const spinner = ora('Loading ...').start();

    if (typeof parameters.index === 'undefined') {
        spinner.warn('--index required!');
        return Promise.resolve();
    }

    if (typeof parameters.uncss === 'undefined') {
        return Promise.resolve(parameters)
            .then(require('./lib/scraper'))
            .then(require('./lib/codes'))
            .then(r => {
                spinner.succeed('Success!');
                return r;
            });
    } else {
        if (typeof parameters.name === 'undefined' || typeof parameters.movie === 'undefined' || typeof parameters.category === 'undefined' || typeof parameters.categories === 'undefined') {
            spinner.warn('--name --movie --category --categories required!');
            return Promise.resolve();
        }
        return Promise.resolve(parameters)
            .then(require('./lib/uncss'))
            .then(r => {
                spinner.succeed('Success!');
                return r;
            });
    }
};