import '../../styles/detail.css';
import Database from '../../api/database.js';

const DetailView = {
  render: async (id) => {
    return `
      <div class="story__detail">
          <a href="#/dashboard" class="story__detail__back">
              <i class="fas fa-arrow-alt-circle-left"></i> Back to dashboard
          </a>

          <h2 class="story__detail__header" id="story-title">Memuat...</h2>

          <img
              class="story__detail__image"
              id="story-image"
              src=""
              alt=""
              width="300"
          >

          <label><strong>Name :</strong></label>
          <p class="story__detail__name" id="story-name">...</p>

          <label><strong>Desc :</strong></label>
          <p class="story__detail__description" id="story-description">...</p>

          <label><strong>Lat  :</strong></label>
          <p class="story__detail__lat" id="story-lat">...</p>

          <label><strong>Lon  :</strong></label>
          <p class="story__detail__lon" id="story-lon">...</p>

          <label><strong>Map  :</strong></label>
          <div class="story__detail__map" id="map-detail" style="height: 300px; margin-top: 10px;"></div>

          <label><strong>Date :</strong></label>
          <small class="story__detail__date" id="story-date">Tanggal tidak tersedia</small>
      
          
          <button id="save-button" class="save__btn">Simpan Laporan</button>

        </div>
    `;
  },

  show: async (id, story) => {
    const app = document.getElementById('app');
    app.innerHTML = await DetailView.render(id);

    app.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });

    DetailView.afterRender(story);
  },

  showError: (message) => {
    const app = document.getElementById('app');
    app.innerHTML = `<p>${message}</p>`;
  },

  afterRender: (story) => {
    document.getElementById('story-title').textContent = story.name;
    document.getElementById('story-name').textContent = story.name;
    document.getElementById('story-image').src = story.photoUrl;
    document.getElementById('story-image').alt = story.name;
    document.getElementById('story-description').textContent = story.description;
    document.getElementById('story-date').textContent = `Created at: ${new Date(story.createdAt).toLocaleString()}`;
    document.getElementById('story-lat').textContent = story.lat;
    document.getElementById('story-lon').textContent = story.lon;

    if (story.lat && story.lon) {
      const map = L.map("map-detail").setView([story.lat, story.lon], 10);

      L.tileLayer('https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=g8oK19blBXwfNG5EWWeA', {
        attribution: '© MapTiler',
        tileSize: 256,
      }).addTo(map);

      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(`<b>${story.name}</b><br>${story.description}`);
    } else {
      document.getElementById("map-detail").style.display = "none";
    }

    document.querySelector('.story__detail__back').addEventListener('click', (e) => {
      e.preventDefault();

      const targetHash = '#/dashboard';

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          window.location.hash = targetHash;
        });
      } else {
        window.location.hash = targetHash;
      }
    });

    const saveButton = document.getElementById('save-button');

    function updateButton(isSaved) {
      if (isSaved) {
        saveButton.innerHTML = `<i class="fas fa-trash-alt"></i> Buang Laporan`;
        saveButton.style.backgroundColor = '#dc3545'; // merah untuk buang
      } else {
        saveButton.innerHTML = `<i class="far fa-save"></i> Simpan Laporan`;
        saveButton.style.backgroundColor = '#007bff'; // biru untuk simpan
      }
    }

    Database.isStorySaved(story.id).then((isSaved) => {
      updateButton(isSaved);
    });

    saveButton.addEventListener('click', async () => {
      const isSaved = await Database.isStorySaved(story.id);
      
      if (isSaved) {
        await Database.deleteStory(story.id);
        updateButton(false);
      } else {
        await Database.saveStory(story);
        updateButton(true);
      }
    });

  }
};

export default DetailView;
