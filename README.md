# Create theme for CinemaPress

## Install (<a href="https://nodejs.org/" target="_blank">NodeJS</a>)
```bash
npm i cinematheme -g
```

## Usage
```bash
cinematheme --name "mytheme" --index "https://example.com"
```

- `https://example.com` - donor website;
- `mytheme` - name theme (lowercase).

After generation and editing (recommended use <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> and <a href="https://marketplace.visualstudio.com/items?itemName=DigitalBrainstem.javascript-ejs-support" target="_blank">EJS extensions</a>), you can send `mytheme` folder to the server in `themes` folder.

- `/themes/mytheme/default/` - all functions in theme (help);
- `/themes/mytheme/public/` - static files;
- `/themes/mytheme/views/` - theme files;

#### File to URL:

- `index.ejs` - `/`
- `movie.ejs` - `/movie/[id]`
- `episode.ejs` - `/movie/[id]/s11e22`
- `picture.ejs` - `/movie/[id]/picture`
- `trailer.ejs` - `/movie/[id]/trailer`
- `online.ejs` - `/movie/[id]/online`
- `download.ejs` - `/movie/[id]/download`
- `categories.ejs`
  - `/year`
  - `/genre`
  - `/actor`
  - `/country`
  - `/director`
  - `/content`
- `category.ejs`
  - `/year/[year]`
  - `/genre/[genre]`
  - `/actor/[actor]`
  - `/country/[country]`
  - `/director/[director]`
  - `/content/[content]`

## Help
```bash
~# cinemapress -h

Usage: cinematheme <command> [options]

Create theme for CinemaPress

Options:
  -i, --index <url>       index url
  -m, --movie [url]       movie url
  -c, --category [url]    category url
  -s, --categories [url]  categories url
  -e, --episode [url]     episode url
  -p, --picture [url]     picture url
  -t, --trailer [url]     trailer url
  -o, --online [url]      online url
  -d, --download [url]    download url
  -n, --name [name]       name theme
  -V, --version           output the version number
  -h, --help              output usage information
```