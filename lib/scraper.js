const scrape = require('website-scraper');
const formatter = require('./formatter');
const path = require('path');

module.exports = parameters => {
    let urls = [parameters.index];
    if (parameters.movie) {
        urls.push({url: parameters.movie, filename: 'movie.html'});
    }
    if (parameters.category) {
        urls.push({url: parameters.category, filename: 'category.html'});
    }
    if (parameters.categories) {
        urls.push({url: parameters.categories, filename: 'categories.html'});
    }
    if (parameters.episode) {
        urls.push({url: parameters.episode, filename: 'episode.html'});
    }
    if (parameters.picture) {
        urls.push({url: parameters.picture, filename: 'picture.html'});
    }
    if (parameters.trailer) {
        urls.push({url: parameters.trailer, filename: 'trailer.html'});
    }
    if (parameters.online) {
        urls.push({url: parameters.online, filename: 'online.html'});
    }
    if (parameters.download) {
        urls.push({url: parameters.download, filename: 'download.html'});
    }
    const options = {
        urls: urls,
        directory: path.join(process.cwd(), ((new URL(parameters.index)).hostname || 'example.com')),
        request: {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36'
            }
        },
        subdirectories: [
            {directory: 'images', extensions: ['.jpg', '.png', '.jpeg', '.gif']},
            {directory: 'js', extensions: ['.js']},
            {directory: 'css', extensions: ['.css']},
            {directory: 'fonts', extensions: ['.svg', '.eot', '.ttf', '.woff', '.woff2']},
            {directory: 'media', extensions: ['.mp4', '.webm']},
            {directory: 'other', extensions: ['']}
        ],
        urlFilter: url => {
            return !/(googleapis|jsdelivr|cdnjs)\./i.test(url);
        },
        plugins: [
            new Beautify()
        ]
    };

    return scrape(options).then(() => parameters);
};

class Beautify {
    apply(registerAction) {
        registerAction('afterResponse', async ({response}) => {
            if (response.statusCode === 200 && response.headers['content-type'].indexOf('text/html') + 1) {
                return {body: formatter.html(response.body)};
            } else if (response.statusCode === 200 && response.headers['content-type'].indexOf('text/css') + 1) {
                return {body: formatter.css(response.body)};
            } else {
                return {body: response.body, metadata: {headers: response.headers}};
            }
        });
    }
}