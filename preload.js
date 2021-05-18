window.addEventListener('DOMContentLoaded', () => {

  const express = require('express')
  const ytdl = require('ytdl-core')
  const cors = require('cors')
  const app = express()
  const PORT = 4000

  app.use(cors())
  app.listen(PORT, () => console.log(`Express running at http://localhost:${PORT}/`))
  app.get('/', (req, res) => res.sendStatus(200))
  app.get('/downloadmp3', async (req, res, next) => {
    try {
      var url = req.query.url;
      if (!ytdl.validateURL(url)) {
        return res.sendStatus(400);
      }
      let title = 'audio';

      await ytdl.getBasicInfo(url, {
        format: 'mp4'
      }, (err, info) => {
        if (err) throw err;
        title = info.player_response.videoDetails.title.replace(/[^\x00-\x7F]/g, "");
      });

      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
      ytdl(url, {
        format: 'mp3',
        filter: 'audioonly',
      }).pipe(res);

    } catch (err) {
      console.error(err);
    }
  });


  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})