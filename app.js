const express = require('express');
const { getInfo } = require('ytdl-core');
const app = express();
const port = 3000;
const ytdl = require('ytdl-core');

app.get('/', (req, res) => {
  res.header('Content-Disposition', 'Attachmentt; filename="videu.mp4"');
  ytdl('https://www.youtube.com/watch?v=h-12i_ouKTM&ab_channel=mtrk').pipe(res);
});

app.get('/yt', (req, res) => {
  const url = req.query['https://www.youtube.com/watch?v'];
  res.header('Content-Disposition', 'Attachmentt; filename="videu.mp4"');
  ytdl(url).pipe(res);
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

app.get('/test', (req, res) => {
  let valid = [];
  async function getInfoYou() {
    const response = await ytdl.getBasicInfo(
      'https://www.youtube.com/watch?v=h-12i_ouKTM&ab_channel=mtrk',
    );

    // const data = await response.json();
    return console.log(response);
  }

  getInfoYou();
  res.send(valid);
});

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listeninng on PORT: ${port}`);
});
