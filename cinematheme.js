#!/usr/bin/env node

const program = require('commander');

program
    .storeOptionsAsProperties(true)
    .passCommandToAction(false);

program
    .usage('<command> [options]')
    .description('Create theme for CinemaPress')
    .option('-i, --index <url>',      'index url', /^(http|https):\/\/[^ "]+$/i)
    .option('-m, --movie [url]',      'movie url', /^(http|https):\/\/[^ "]+$/i)
    .option('-c, --category [url]',   'category url', /^(http|https):\/\/[^ "]+$/i)
    .option('-s, --categories [url]', 'categories url', /^(http|https):\/\/[^ "]+$/i)
    .option('-e, --episode [url]',    'episode url', /^(http|https):\/\/[^ "]+$/i)
    .option('-p, --picture [url]',    'picture url', /^(http|https):\/\/[^ "]+$/i)
    .option('-t, --trailer [url]',    'trailer url', /^(http|https):\/\/[^ "]+$/i)
    .option('-o, --online [url]',     'online url', /^(http|https):\/\/[^ "]+$/i)
    .option('-d, --download [url]',   'download url', /^(http|https):\/\/[^ "]+$/i)
    .option('-n, --name [name]',      'name theme', /^[A-Za-z0-9]+$/i)
    .option('-u, --uncss',            'removes unused CSS')
    .version('0.0.12')
    .parse(process.argv);

require('./')(program)
    .then(() => process.exit())
    .catch(error => {console.error(error); process.exit()});