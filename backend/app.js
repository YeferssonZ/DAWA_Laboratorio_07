const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const app = express();
const Song = require('./models/song');
const songsRoutes = require('./routes/songs');

mongoose.connect('mongodb://127.0.0.1/MusicPlayerDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));

app.use('/songs', songsRoutes);

app.get('/songs/audioInfo', async (req, res) => {
  const audioUrl = req.query.url;

  try {
    const song = await Song.findOne({ audioUrl });
    if (!song) {
      res.status(404).json({ message: 'Canción no encontrada.' });
      return;
    }

    res.json({
      title: song.title,
      artist: song.artist,
      logoUrl: song.logoUrl
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error al obtener información de la canción.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/reproductor.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/reproductor.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/upload.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
