const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');


const app = express();

const newspapers = [
    {
        name: 'the times',
        address: 'https://www.thetimes.co.uk/environment/climate-change'
    },
    {
        name: 'gardian',
        address: 'https://www.theguardian.com/environment/climate-crisis'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/'
    },
];

const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {

                const title = $(this).text();
                const url = $(this).attr('href');

                if (title) {
                    articles.push({
                        title,
                        url,
                        source: newspaper.name
                    });

                }

            });


        })
        .catch(err => console.log(err));
})

app.get('/', (req, res) => {
    res.json('Welcome to my Channel')
})

app.get('/4chan/:thread', (req, res) => {
    const chanVideos = [];
    const thread = req.params.thread;
    const url = `https://boards.4chan.org/gif/thread/${thread}`;

    axios.get(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $(('a.fileThumb'), html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            chanVideos.push({
                title,
                url
            });
        });

        res.json(chanVideos)

    }).catch(err => console.log(err));
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.listen(PORT, () => console.log(`server runs on ${PORT}`))
