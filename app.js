const ytdl = require('ytdl-core');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
var cors = require('cors');
const express = require('express');
const app = express();

// Open the page
const open = require('open');
const port = 5000;

// cors
app.use(cors());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));

// create application/json parser
app.use(bodyParser.json());

// config - Template Egnine
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

let data = [];
open(`http://localhost:${port}/index`);

// app.get('/', (req, res) => {
//   const url = req.query['https://www.youtube.com/watch?v'];
//   if (url) {
//     res.header('Content-Disposition', 'Attachmentt; filename="videu.mp4"');
//     ytdl(url).pipe(res);
//   } else {
//     res.send('Not found');
//   }
// });

//**  Inicia o HTML  **//
app.get('/index', (req, res) => {
  res.render('index');
});

app.post('/api/ytdl', (req, res) => {
  const { url, types } = req.body;

  if (ytdl.validateURL(url)) {
    async function ytInfo() {
      await ytdl.getBasicInfo(url).then((info) => {
        data = [info.formats, info.videoDetails, types];
        res
          .status(200)
          .json({ data: [info.formats, info.videoDetails, types] });
      });
    }
    ytInfo();
  } else {
    res.status(404).send('Not found');
  }
});

app.get(
  '/dl',
  (req, res, next) => {
    let type = '';

    switch (data[2]) {
      case 'mp3':
        type = 'audioonly';
        break;
      case 'mp4':
        type = 'audioandvideo';
        break;
    }

    const stream = ytdl(data[1].video_url, { filter: type });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${data[1].title}.${data[2]}"`,
    );

    if (ytdl.validateURL(data[1].video_url)) {
      stream.pipe(res);
      next();
    } else {
      res.send('error');
    }
  },
  (req, res) => {},
);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listeninng on PORT: ${port}`);
});
