const js = require('js-beautify');
const css = require('js-beautify').css;
const html = require('js-beautify').html;

module.exports = {
    js: body => {
        return js(js(body)
            .replace(/\/\*\*?[^]*?\*\//ig, '')
            .replace(/\/\/\/.*?\n/ig, '')
            .replace(/[ \f\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]+/g, ' ')
            .replace(/(\r?\n)+/g, '\n')
            .replace(/\n+/g, '\n')
            .replace(/\n\s*?/g, '\n')
            .replace(/\s*?\n/g, '\n')
            .replace(/\r+/g, '\r')
            .replace(/\r\s*?/g, '\r')
            .replace(/\s*?\r/g, '\r')
            .replace(/(\r?\n)+/g, '\n')
            .replace(/\n+/g, '\n')
            .replace(/(^\s*)|(\s*)$/g, ''));
    },
    css: body => {
        return css(css(body)
            .replace(/\/\*\*?[^]*?\*\//ig, '')
            .replace(/[ \f\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]+/g, ' ')
            .replace(/(\r?\n)+/g, '\n')
            .replace(/\n+/g, '\n')
            .replace(/\n\s*?/g, '\n')
            .replace(/\s*?\n/g, '\n')
            .replace(/\r+/g, '\r')
            .replace(/\r\s*?/g, '\r')
            .replace(/\s*?\r/g, '\r')
            .replace(/(\r?\n)+/g, '\n')
            .replace(/\n+/g, '\n')
            .replace(/(^\s*)|(\s*)$/g, ''));
    },
    html: body => {
        return html((html(body)
            .replace(/<!--[^]*?-->/ig, ''))
            .replace(/[ \f\t\v​\u00a0\u1680​\u180e\u2000​\u2001\u2002​\u2003\u2004​\u2005\u2006​\u2007\u2008​\u2009\u200a​\u2028\u2029​​\u202f\u205f​\u3000]+/g, ' ')
            .replace(/(\r?\n)+/g, '\n')
            .replace(/\n+/g, '\n')
            .replace(/\n\s*?/g, '\n')
            .replace(/\s*?\n/g, '\n')
            .replace(/\r+/g, '\r')
            .replace(/\r\s*?/g, '\r')
            .replace(/\s*?\r/g, '\r')
            .replace(/(\r?\n)+/g, '\n')
            .replace(/\n+/g, '\n')
            .replace(/(^\s*)|(\s*)$/g, '')
            .replace(/&lt;%/g,'<%')
            .replace(/%&gt;/g,'%>')
            .replace(/&amp;&amp;/g,'&&'))
    }
};