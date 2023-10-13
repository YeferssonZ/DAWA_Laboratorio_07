document.getElementById('uploadForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('artist', document.getElementById('artist').value);
  formData.append('audio', document.getElementById('audio').files[0]);
  formData.append('logo', document.getElementById('logo').files[0]);

  fetch('/songs/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      const modal = document.getElementById('customModal');
      const modalContent = modal.querySelector('.modal-content');

      if (data.success) {
        modalContent.innerHTML = `<p class="success-message">${data.message}</p>`;
        modalContent.innerHTML += `
      <button class="modal-button" id="returnButton">Volver a lista de reproducción</button>
      <button class="modal-button" id="continueButton">Seguir subiendo</button>
    `;

        document.getElementById('returnButton').addEventListener('click', () => {
          window.location.href = '/';
        });

        document.getElementById('continueButton').addEventListener('click', () => {
          window.location.reload();
        });
      } else {
        modalContent.innerHTML = `<p class="error-message">${data.message}</p>`;
        modalContent.innerHTML += `
      <button class="modal-button" id="retryButton">Volver a intentarlo</button>
    `;

        document.getElementById('retryButton').addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }

      modal.style.display = 'block';
    })

    .catch(error => console.error('Error:', error));
});

document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('customModal').style.display = 'none';
});
