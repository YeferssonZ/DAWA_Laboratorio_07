document.addEventListener('DOMContentLoaded', () => {
    const songInfo = document.getElementById('songInfo');

    // Obtén la URL de la canción y la información de la canción desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const audioUrl = urlParams.get('audioUrl');

    fetch(`/songs/audioInfo?url=${audioUrl}`)
        .then(response => response.json())
        .then(data => {
            // Mostrar información de la canción
            const songTitle = document.createElement('h2');
            songTitle.textContent = data.title;
            const artist = document.createElement('p');
            artist.textContent = `Artista: ${data.artist}`;
            const logo = document.createElement('img');
            logo.src = data.logoUrl;
            logo.alt = 'Logo de la canción';

            songInfo.appendChild(songTitle);
            songInfo.appendChild(artist);
            songInfo.appendChild(logo);

            // Inicializar el reproductor con Howler.js
            const sound = new Howl({
                src: [audioUrl],
                html5: true, // Usa el reproductor HTML5 si está disponible
                onplay: () => {
                    // Actualizar duración total de la canción
                    const durationElement = document.getElementById('duration');
                    durationElement.textContent = formatTime(sound.duration());
                },
                onend: () => {
                    // La canción ha terminado de reproducirse
                }
            });

            const playPauseBtn = document.getElementById('playPauseBtn');
            const resetSpeedBtn = document.getElementById('resetSpeedBtn');
            const seekSlider = document.getElementById('seekSlider');
            const currentTime = document.getElementById('currentTime');
            const volumeBtn = document.getElementById('volumeBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const accelerateBtn = document.getElementById('accelerateBtn');
            const decelerateBtn = document.getElementById('decelerateBtn');
            const downloadBtn = document.getElementById('downloadBtn');
            //const rewindBtn = document.getElementById('rewindBtn');

            // Función para formatear el tiempo en minutos y segundos
            const formatTime = (seconds) => {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
            };

            const updateSeekSlider = () => {
                const seekPosition = sound.seek() || 0;
                seekSlider.value = seekPosition;
                currentTime.textContent = formatTime(seekPosition);
                requestAnimationFrame(updateSeekSlider);  // Continuar actualizando
            };

            // Reproducir o pausar la canción
            playPauseBtn.addEventListener('click', () => {
                if (sound.playing()) {
                    sound.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                } else {
                    sound.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    // Actualizar la duración total de la canción
                    const duration = Math.round(sound.duration());
                    seekSlider.max = duration;
                    durationElement.textContent = formatTime(duration);
                    requestAnimationFrame(updateSeekSlider);
                }
            });

            // Función para restaurar la velocidad de reproducción a la normalidad
            resetSpeedBtn.addEventListener('click', () => {
                sound.rate(1.0);  // Restaura la tasa de reproducción a la normalidad
            });

            // Actualizar la posición de reproducción cuando se desliza el slider
            seekSlider.addEventListener('input', () => {
                sound.seek(seekSlider.value);
                currentTime.textContent = formatTime(seekSlider.value);
            });

            sound.on('play', () => {
                requestAnimationFrame(updateSeekSlider);
            });

            sound.on('pause', () => {
                cancelAnimationFrame(updateSeekSlider);
            });
            const durationElement = document.getElementById('duration');
            let isMuted = false;

            volumeBtn.addEventListener('click', () => {
                isMuted = !isMuted;

                if (isMuted) {
                    sound.volume(0);
                    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                } else {
                    sound.volume(volumeSlider.value);
                    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            });

            // Actualizar el volumen cuando se desliza el slider de volumen
            volumeSlider.addEventListener('input', () => {
                if (!isMuted) {
                    sound.volume(volumeSlider.value);
                }
            });


            accelerateBtn.addEventListener('click', () => {
                sound.rate(1.25);
            });

            // Función para desacelerar la reproducción
            decelerateBtn.addEventListener('click', () => {
                sound.rate(0.75);
            });

            // Función para retroceder la reproducción
            //rewindBtn.addEventListener('click', () => {
            //const seekPosition = sound.seek() || 0;
            //const rewindTime = 10;  // Ajusta el tiempo de retroceso según sea necesario (en segundos)
            // sound.seek(Math.max(seekPosition - rewindTime, 0));
            //});

            downloadBtn.addEventListener('click', () => {
                const a = document.createElement('a');
            
                // Obtener el nombre y artista de la canción
                const title = data.title.replace(/\s+/g, '_'); // Reemplazar espacios con guiones bajos
                const artist = data.artist.replace(/\s+/g, '_'); // Reemplazar espacios con guiones bajos
            
                // Crear un nombre de archivo combinando título y artista
                const fileName = `${title}_${artist}.mp3`;
            
                a.href = audioUrl;
                a.download = fileName;  // Asignar el nombre del archivo
                a.click();
            });
        })
        .catch(error => console.error('Error:', error));
});

