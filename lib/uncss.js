const uncss = require('uncss');
const path = require('path');
const axios = require('axios');
const util = require('util');
const { readdirSync, writeFile, writeFileSync, existsSync, unlinkSync } = require('fs');
const u = util.promisify(uncss);
const w = util.promisify(writeFile);

module.exports = parameters => {

    const getDirectories = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

    const getFiles = source =>
        readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);

    function getIndex() {
        return axios.get(parameters.index);
    }

    function getMovie() {
        return axios.get(parameters.movie);
    }

    function getCategory() {
        return axios.get(parameters.category);
    }

    function getCategories() {
        return axios.get(parameters.categories);
    }

    let urls = [];
    let index_html = '';
    let movie_html = '';
    let category_html = '';
    let categories_html = '';

    let htmlroot = '';
    let home = '';
    let themes = '';
    let theme = '';
    let all = '';

    if (existsSync(path.join('/home'))) {
        home = path.join('/home');
        let home_list = getDirectories(home);
        (home_list || []).forEach(function (website) {
            if (existsSync(path.join(home, website, 'themes'))) {
                themes = path.join(home, website, 'themes');
                if (existsSync(path.join(themes, parameters.name))) {
                    theme = path.join(themes, parameters.name);
                    htmlroot = path.join(home, website);
                    all = path.join(theme, 'public', 'css', 'all.css');
                }
            }
        });
    }

    return Promise.all([getIndex(), getMovie(), getCategory(), getCategories()])
        .then(function (results) {
            const [index, movie, category, categories] = results;
            if (index && index.data) {
                index_html = path.join(theme, 'index.html');
                writeFileSync(index_html, index.data.replace(/\.(js|css)\?v=[a-z0-9]*/ig, '.$1').replace(/<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/ims, ''));
                urls.push(index_html);
            }
            if (movie && movie.data) {
                movie_html = path.join(theme, 'movie.html');
                writeFileSync(movie_html, movie.data.replace(/\.(js|css)\?v=[a-z0-9]*/ig, '.$1').replace(/<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/ims, ''));
                urls.push(movie_html);
            }
            if (category && category.data) {
                category_html = path.join(theme, 'category.html');
                writeFileSync(category_html, category.data.replace(/\.(js|css)\?v=[a-z0-9]*/ig, '.$1').replace(/<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/ims, ''));
                urls.push(category_html);
            }
            if (categories && categories.data) {
                categories_html = path.join(theme, 'categories.html');
                writeFileSync(movie_html, categories.data.replace(/\.(js|css)\?v=[a-z0-9]*/ig, '.$1').replace(/<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/ims, ''));
                urls.push(categories_html);
            }
        })
        .then(function () {
            urls = urls.filter(Boolean);

            let options = {
                htmlroot     : htmlroot,
                jsdom        : {
                    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4230.1 Safari/537.36',
                },
                timeout      : 1000,
                report       : false,
                strictSSL    : false,
                userAgent    : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4230.1 Safari/537.36',
            };

            return u(urls, options)
                .then(output => {
                    return w(all, output)
                        .then(res => {
                            unlinkSync(index_html);
                            unlinkSync(movie_html);
                            unlinkSync(category_html);
                            unlinkSync(categories_html);
                            return Promise.resolve();
                        })
                        .catch(err => {
                            console.error(err);
                        });
                })
                .catch(err => {
                    console.error(err);
                });
        })
        .then(function () {
            return true;
        });
};