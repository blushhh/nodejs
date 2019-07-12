const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/reaplaceTemplate');

const tempOverviewData = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCardData = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);
const tempProductData = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(element =>
    slugify(element.productName, {replacement: '_', lower: true})
);
console.log(slugs);

//SERVER

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    //Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObject
            .map(element => replaceTemplate(tempCardData, element))
            .join();
        const output = tempOverviewData.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
        //Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObject[query.id];
        const output = replaceTemplate(tempProductData, product);
        res.end(output);
        //API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
        //Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1>This page could not be found!<h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000!');
});
