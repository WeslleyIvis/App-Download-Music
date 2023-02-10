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

let data = [];

app.get('/', (req, res) => {
  const url = req.query['https://www.youtube.com/watch?v'];
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

app.post('/api/ytdl', (req, res) => {
  const { url } = req.body;

  if (ytdl.validateURL(url)) {
    async function ytInfo() {
      await ytdl.getBasicInfo(url).then((info) => {
        data = [info.formats, info.videoDetails];
        res.status(200).json({ data: [info.formats, info.videoDetails] });
      });
    }
    ytInfo();
  } else {
    res.status(404).send('Not found');
  }
});

app.get('/dl', (req, res) => {
  const stream = ytdl(data[1].video_url, { filter: 'audioandvideo' });

  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');

  if (ytdl.validateURL(data[1].video_url)) {
    stream.pipe(res);
  } else {
    res.send('error');
  }
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listeninng on PORT: ${port}`);
});
