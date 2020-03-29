var http =require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    <style>
      .container {
        display:flex;
        flex-direction:column;
      }
      header {
        border-bottom:1px solid gray;
        padding-left:20px;
      }
      #text {
        text-decoration:none;
      }
      .content {
        display:flex;
        flex-direction:raw;
      }
      .content ul {
          border-right:1px;
          flex-basis:200px;
          flex-shrink:0;
          list-style:none;
          float:left;
      }
      footer {
        border-top:1px;
        padding-left:20px;
        text-align:center;
        background-color:lightgray;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <h1><a id=text href="/">AWS SDK Exercise</a></h1>
      </header>
      <section class="content">
        ${list}
        ${body}
      </section>
      <footer>
        <h2> "Lucky Number : ${Lucky}" </h2>
      </footer>
    </div>
  </body>
  </html>
  `;
}

function lottoNum () {
  let lotto = [];
  let i=0;
  while ( i<6 ) {
    let n = Math.floor(Math.random() * 45) + 1;
    if (! sameNum(n)) {
      lotto.push(n);
      i++;
    }
}
  function sameNum (n) {
     for (var i=0; i < lotto.length; i++) {
        if (n === lotto[i]){
          return true;
        }
    }
    return false
  }
  return lotto;
}

var Lucky = lottoNum()

function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, let us start';
          var list = templateList(filelist);
          var template = templateHTML(title, list, `
            <div class="article">
              <h3>${title}</h3>
                ${description}
            </div>
            `);
          response.writeHead(200);
          response.end(template);
        })
      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
              <div class="article">
                <h3>${title}</h3>
                  ${description}
              </div>
              `);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(8080);
