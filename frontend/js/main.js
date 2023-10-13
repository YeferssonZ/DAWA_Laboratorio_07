document.addEventListener('DOMContentLoaded', () => {
  const songList = document.getElementById('songList');
  
  fetch('/songs')
    .then(response => response.json())
    .then(data => {
      data.forEach(song => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <h2>${song.title}</h2>
          <p>Artista: ${song.artist}</p>
          <a href="/reproductor.html?audioUrl=${encodeURIComponent(song.audioUrl)}">Reproducir</a>
        `;
        songList.appendChild(listItem);
      });
    })
    .catch(error => console.error('Error:', error));
});
