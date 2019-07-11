const fs = require('fs');
const http = require('http');
const url = require('url');

//SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = temp.replace(/{%IMAGE%}/g, product.image);
    output = temp.replace(/{%FROM%}/g, product.from);
    output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = temp.replace(/{%QUANTITY%}/g, product.quantity);
    output = temp.replace(/{%PRICE%}/g, product.price);
    output = temp.replace(/{%DESCRIPTION%}/g, product.description);
    output = temp.replace(/{%ID%}/g, product.id);
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
};

const tempOverviewData = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempCardData = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const tempProductData = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
        const pathName = req.url;

        //Overview Page
        if (pathName === '/' || pathName === '/overview') {
            res.writeHead(200, {'Content-type': 'text/html'});

            const cardsHtml = dataObject.map(el => replaceTemplate(tempCardData, el)).join('');
            const output = tempOverviewData.replace('{%PRODUCT_CARDS%}', cardsHtml);
            res.end(output);

        //Product Page
        } else if (pathName === '/product') {
            res.end('This is the PRODUCT!');

        //API
        } else if (pathName === '/api') {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);

        //Not Found
        } else {
            res.writeHead(404, {
                'Content-type': 'text/html',
                'my-own-header': 'hello world',
            });
            res.end('<h1>This page could not be found!<h1>');
        }
    });

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000!')
});








