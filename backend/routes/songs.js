const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Song = require('../models/song');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, artist } = req.body;
    const audioUrl = '/uploads/' + req.files['audio'][0].filename;
    const logoUrl = '/uploads/' + req.files['logo'][0].filename;

    const newSong = new Song({ title, artist, audioUrl, logoUrl });
    await newSong.save();

    res.status(201).json({ success: true, message: 'Canción subida exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al subir la canción.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las canciones.' });
  }
});

// Obtener la lista de canciones disponibles
// router.get('/available', async (req, res) => {
//   try {
//     const songs = await Song.find(); // Busca todas las canciones en la base de datos

//     // Extrae solo la información relevante de las canciones
//     const availableSongs = songs.map(song => ({
//       _id: song._id,
//       title: song.title,
//       artist: song.artist,
//     }));

//     res.json(availableSongs);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Error al obtener la lista de canciones disponibles.' });
//   }
// });

module.exports = router;
