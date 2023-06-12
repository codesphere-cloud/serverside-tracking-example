const path = require('path');
const fetch = require('cross-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const {URL} = require("url");

const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
const PORT = process.env.PORT || 3000;

const buildUrl = (url,
                  searchParams) => {
    const u = new URL(url);
    Object.entries(searchParams).forEach(([n, val]) => {
        (val instanceof Array ? val : [val])
            .filter(has)
            .forEach((v) => {
                u.searchParams.append(n, `${v}`);
            });
    });
    return u;
};

app.post('/track',
    async (req, res) => {
        const args = req.body;
        const url = buildUrl('https://www.google-analytics.com/collect', {
            ci: args.utmSource,
            cid: args.id,
            dclid: args.dclid,
            dl: args.url,
            ea: '<add a price for your product>',
            ec: args.event,
            ev: '<add a product id>',
            gclid: args.gclid,
            referrer: args.referrer,
            t: 'event',
            tid: '<Add your Google Tracking Id>',
            ua: args.userAgent,
            uid: '<Add the user id if you have one>',
            uip: context.requestHeaders['x-forwarded-for'],
            v: 1,
        });
        fetch(url.toString()).catch(console.error);
        res.end(200)
    });

(async () => {
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    }
)();