const fs = require("fs");
const path = require("path");
const $ = require('cheerio');

var request = require('request').defaults({
  jar: true,
  headers: {
    agentOptions: {
      ca: fs.readFileSync(path.join( __dirname, '..', 'certs', 'nextappcz.cer' ))
    }
  }
});

async function login(username, password) {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: 'https://nextapp.cz/login-check',
      followAllRedirects: true,
      formData: {
        user_login: username,
        user_password: password,
        login_submit: 'Přihlásit se!'
      }
    }, function(error, response, body) {
      if(error) {
        return reject(error);
      }
      if( $('title', body).text() === 'Přihlášení / NEXTapp' || response.statusCode !== 200 ) {
        return resolve(false);
      } else {
        return resolve(true);
      }
    });
  });
}

module.exports.authenticate = (username, password) => {
  return new Promise(async (resolve, reject) => {
    var logged = await login(username, password);
    if(logged) return resolve();
    var logged = await login(username, password);
    if(logged) return resolve();
    var logged = await login(username, password);
    if(logged) return resolve();
    reject();
  });
}


module.exports.sendForm = (url, formData) => {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'POST',
      form: formData
    }, (error, response, html) => {
      if(error) {
        return reject({
          status: 500,
          text: `Could send export page.`
        });
      }
      if(response.statusCode != 302) {
        return reject({
          status: 500,
          text: `Server responded with unsupported status code: ${response.statusCode}`
        });
      }
      resolve();
    });
  });
}

module.exports.getTrueID = (id) => {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://nextapp.cz/search',
      method: 'GET',
      followAllRedirects: true,
      qs: {
        'search-input': id
      }
    }, (error, response, body) => {
      let pattern = /https:\/\/nextapp.cz\/listing\/([0-9]*)\/show/;
      if( !pattern.test(response.request.uri.href) ) {
        reject({
          text: `Could not find ID '${id}'`,
          status: 404
        });
      } else {
        let trueID = response.request.uri.href.match(pattern)[1];
        resolve(trueID);
      }
    });
  });
}

module.exports.downloadPropertyPage = (id, pageName) => {
  return new Promise( (resolve, reject) => {
    request({
      url: `https://nextapp.cz/listing/${id}/edit${pageName}`,
      method: 'GET'
    }, (error, response, html) => {
      if(error) {
        reject({
          status: 500,
          text: `Could not download page: ${pageName} Error: ${error}`
        });
      }
      if(response.statusCode != 200) {
        reject({
          status: 500,
          text: `Server responded with unsupported status code: ${response.statusCode}`
        });
      }
      resolve(html);
    });
  });
}