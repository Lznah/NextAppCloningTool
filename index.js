const express = require('express');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');
const nextapp = require('./lib/nextapp.js');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
})); 
app.listen(3000);

app.post("/login", (req, res) => {
    console.log(req.body);
    nextapp.authenticate(req.body.username, req.body.password)
    .then(() => {
        res.end("Logged in");
    })
    .catch((err) => {
        res.end("Not logged in");
    });
})

app.post("/copy", (req, res) => {
    console.log(req.body);
    let data = [];
    nextapp.authenticate(req.body.username, req.body.password)
    .then(() => {
        return nextapp.getTrueID(req.body.id)
    })
    .then((trueID) => {
        console.log(trueID)
        return Promise.all([
            nextapp.downloadPropertyPage(trueID, '/basic-info'),
            nextapp.downloadPropertyPage(trueID, ''),
            nextapp.downloadPropertyPage(trueID, '/price'),
            nextapp.downloadPropertyPage(trueID, '/clients'),
        ]);
    })
    .then(async (htmls) => {
        console.log(htmls.length)
        htmls.forEach((html, index) => {
            let $ = cheerio.load(html);
            if(index == htmls.length-1) {
                let client_id = $(":contains('Vlastník')")
                                .closest('tr')
                                .find('a')
                                .attr('href')
                                .replace('/client/', '')
                                .replace('/edit', '')
                data.push({name: 'advert_client', value: client_id});
                return false;
            }
            data = [...data, ...$("#listing").serializeArray()];
        });

        let formData = {};
        data.forEach( val => {
            formData[val.name] = val.value;
        });

        //await nextapp.sendForm('https://nextapp.cz/listing/add', formData);
        res.send('Successfully copied')
    })
    .catch((err) => {
        console.log("Invalid ID", err);
        res.end("Invalid ID");
    })
    
})