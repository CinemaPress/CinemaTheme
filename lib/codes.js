const formatter = require('./formatter');
const path = require('path');
const fs = require('fs-extra');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = parameters => {

    let n = typeof parameters.name === 'string' && parameters.name
        ? parameters.name
        : 'theme';
    let h = (new URL(parameters.index)).hostname || 'example.com';

    let pub = path.join(process.cwd(), n, 'public');
    let views = path.join(process.cwd(), n, 'views');
    let def = path.join(process.cwd(), n, 'default');
    let includes = path.join(views, 'includes');
    let domain = path.join(process.cwd(), h);

    fs.ensureDirSync(pub);
    fs.ensureDirSync(includes);

    fs.copySync(path.join(__dirname, '..', 'default'), def);
    fs.copySync(path.join(__dirname, '..', 'default', 'public'), pub);

    ['images', 'js', 'css', 'fonts', 'media', 'other'].forEach(d => {
        fs.ensureDirSync(path.join(domain, d));
        fs.copySync(path.join(domain, d), path.join(pub, d));
    });

    let head = [
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title><%= page.title %></title>',
        '<meta name="description" content="<%= page.description %>">',
        '<link rel="stylesheet" href="/themes/' + n + '/public/css/all.min.css?v=<%- page.ver %>">',
        '<link rel="shortcut icon" href="/themes/' + n + '/public/favicon.ico?v=<%- page.ver %>">'
    ];
    let links = [];
    let footer = [];
    let footer_one = true;

    ['index', 'movie', 'episode', 'picture', 'trailer', 'download', 'online', 'category', 'categories'].forEach(f => {
        fs.ensureFileSync(path.join(process.cwd(), h, f + '.html'));

        let { document: page } = new JSDOM(fs.readFileSync(path.join(domain, f + '.html'))).window;

        page.querySelector('body').innerHTML = page.querySelector('body').innerHTML
            .replace(/(["('])(images|js|css|fonts|media|other)\//ig, '$1/themes/' + n + '/public/' + '$2/');
        page.querySelector('head').innerHTML = page.querySelector('head').innerHTML
            .replace(/(["('])(images|js|css|fonts|media|other)\//ig, '$1/themes/' + n + '/public/' + '$2/');

        let h1_page = page.querySelector('h1');
        if (h1_page) {
            h1_page.innerHTML = '<%- page.h1 %>';
        }
        let footer_body = page.querySelector('footer');
        if (footer_body && footer_body.innerHTML) {
            if (footer_one) {
                footer.push(formatter.html(footer_body.innerHTML));
                footer_one = false;
            }
            footer_body.innerHTML = '\n<%- include(\'includes/footer.ejs\'); -%>\n';
        }
        let head_page = page.querySelector('head');
        if (head_page) {
            let link_head = head_page.querySelectorAll('link');
            if (link_head) {
                link_head.forEach(l => {
                    if (
                        l.getAttribute('rel') === 'stylesheet' ||
                        l.getAttribute('type') === 'text/css'
                    ) {
                        let href = l.getAttribute('href');
                        if (href && !/^(http|\/\/)/i.test(href)) {
                            href = href + '?v=<%- page.ver %>';
                        }
                        href = '<link rel="stylesheet" type="text/css" href="' + href + '">';
                        if (links.indexOf(href) === -1) {
                            links.push(href);
                        }
                    }
                });
            }
            let js_head = head_page.querySelectorAll('script');
            if (js_head) {
                js_head.forEach(j => {
                    if (j.getAttribute('src')) {
                        let src = j.getAttribute('src');
                        if (src && !/^(http|\/\/)/i.test(src)) {
                            src = src + '?v=<%- page.ver %>';
                        }
                        src = '<script src="' + src + '"></script>';
                        if (footer.indexOf(src) === -1) {
                            footer.push(src);
                        }
                    }
                });
            }
        }
        let js_body = page.querySelectorAll('script');
        if (js_body) {
            js_body.forEach(j => {
                if (j.getAttribute('src')) {
                    let src = j.getAttribute('src');
                    if (src && !/^(http|\/\/)/i.test(src)) {
                        src = src + '?v=<%- page.ver %>';
                    }
                    src = '<script src="' + src + '"></script>';
                    if (footer.indexOf(src) === -1) {
                        footer.push(src);
                    }
                    j.parentNode.removeChild(j);
                }
            });
        }
        let header_body = page.querySelector('header');
        if (header_body && header_body.innerHTML) {
            fs.writeFileSync(path.join(includes, 'header.ejs'), formatter.html(header_body.innerHTML));
            header_body.innerHTML = '\n<%- include(\'includes/header.ejs\'); -%>\n';
        }
        let nav_body = page.querySelector('nav');
        if (nav_body && nav_body.innerHTML) {
            fs.writeFileSync(path.join(includes, 'nav.ejs'), formatter.html(nav_body.innerHTML));
            nav_body.innerHTML = '\n<%- include(\'includes/nav.ejs\'); -%>\n';
        }
        if (page.body) {
            if (page.body.innerHTML === '') {
                if (/(movie|episode|picture|trailer|online|download)/i.test(f)) {
                    fs.copySync(path.join(def, 'views', 'movie.ejs'), path.join(views, f + '.ejs'));
                } else {
                    fs.copySync(path.join(def, 'views', f + '.ejs'), path.join(views, f + '.ejs'));
                }
            } else {
                let body_class = page.querySelector('body').getAttribute('class');
                let html_class = page.querySelector('html').getAttribute('class');
                fs.writeFileSync(path.join(views, f + '.ejs'), formatter.html(
                    '<!DOCTYPE html>' + (/(movie|episode|picture|trailer|online|download)/i.test(f)
                        ? '<html lang="<%- page.language %>" class="' + (html_class || '') + '">'
                        : '<html lang="<%- page.language %>" class="' + (html_class || '') + '" prefix="og: http://ogp.me/ns# video: http://ogp.me/ns/video# ya: http://webmaster.yandex.ru/vocabularies/">') +
                    '<head>\n<%- include(\'includes/head.ejs\'); -%>\n</head>' +
                    '<body class="' + (body_class || '') + '">' +
                    '\n' + page.body.innerHTML + (page.body.innerHTML.indexOf('includes/footer') === -1 ? '<%- include(\'includes/footer.ejs\'); -%>\n' : '\n') +
                    '</body>' +
                    '</html>'
                ));
            }
        }
    });

    head.push(...links);
    head.push('<%- page.codes.head %>');
    footer.push('<%- page.codes.footer %>');

    fs.writeFileSync(path.join(includes, 'head.ejs'), formatter.html(head.join('\n')));
    fs.writeFileSync(path.join(includes, 'footer.ejs'), formatter.html(footer.join('\n')));

    fs.removeSync(domain);

    return Promise.resolve();
};