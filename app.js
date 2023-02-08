const ytdl = require('ytdl-core');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
var cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

// cors

app.use(cors());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// create application/json parser
app.use(bodyParser.json());

// config - Template Egnine

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const { url } = req.query;
  if (url) {
    res.header('Content-Disposition', 'Attachmentt; filename="videu.mp4"');
    ytdl(url).pipe(res);
  } else {
    res.send('Not found');
  }
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.post('/api/dados', (req, res) => {
  const { url, name, type } = req.body;

  if (ytdl.validateURL(url)) {
    async function ytInfo() {
      await ytdl
        .getBasicInfo(url)
        .then((info) =>
          res.status(200).json({ data: [info.formats, info.videoDetails] }),
        );
    }
    ytInfo();
  } else {
    res.status(404).send('Not found');
  }
});

app.get('/download/:name/:type', (req, res) => {
  const { name, type } = req.params;
  const url = req.query['https://www.youtube.com/watch?v'];
  if (url) {
    res.header(
      'Content-Disposition',
      `Attachmentt; filename="${name}.${type}"`,
    );
    ytdl(url).pipe(res);
  } else {
    res.send('Error 404: Video not found');
  }
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listeninng on PORT: ${port}`);
});
