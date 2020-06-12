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
        sources: [
            {selector: 'style'},
            {selector: '[style]', attr: 'style'},
            {selector: 'img', attr: 'src'},
            {selector: 'img', attr: 'srcset'},
            {selector: 'img', attr: 'data-src'},
            {selector: 'input', attr: 'src'},
            {selector: 'object', attr: 'data'},
            {selector: 'embed', attr: 'src'},
            {selector: 'param[name="movie"]', attr: 'value'},
            {selector: 'script', attr: 'src'},
            {selector: 'link[rel="stylesheet"]', attr: 'href'},
            {selector: 'link[rel*="icon"]', attr: 'href'},
            {selector: 'svg *[xlink\\:href]', attr: 'xlink:href'},
            {selector: 'svg *[href]', attr: 'href'},
            {selector: 'picture source', attr: 'srcset'},
            {selector: 'meta[property="og\\:image"]', attr: 'content'},
            {selector: 'meta[property="og\\:image\\:url"]', attr: 'content'},
            {selector: 'meta[property="og\\:image\\:secure_url"]', attr: 'content'},
            {selector: 'meta[property="og\\:audio"]', attr: 'content'},
            {selector: 'meta[property="og\\:audio\\:url"]', attr: 'content'},
            {selector: 'meta[property="og\\:audio\\:secure_url"]', attr: 'content'},
            {selector: 'meta[property="og\\:video"]', attr: 'content'},
            {selector: 'meta[property="og\\:video\\:url"]', attr: 'content'},
            {selector: 'meta[property="og\\:video\\:secure_url"]', attr: 'content'},
            {selector: 'video', attr: 'src'},
            {selector: 'video source', attr: 'src'},
            {selector: 'video track', attr: 'src'},
            {selector: 'audio', attr: 'src'},
            {selector: 'audio source', attr: 'src'},
            {selector: 'audio track', attr: 'src'},
            {selector: 'frame', attr: 'src'},
            {selector: 'iframe', attr: 'src'},
            {selector: '[background]', attr: 'background'}
        ],
        subdirectories: [
            {directory: 'images', extensions: ['.jpg', '.png', '.jpeg', '.gif', '.webp']},
            {directory: 'js', extensions: ['.js']},
            {directory: 'css', extensions: ['.css']},
            {directory: 'fonts', extensions: ['.svg', '.eot', '.ttf', '.woff', '.woff2']},
            {directory: 'media', extensions: ['.mp4', '.mp3', '.ogg', '.webm', '.mov', '.wave', '.wav', '.flac']},
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
        registerAction('error', async ({error}) => {console.error(error)});
    }
}