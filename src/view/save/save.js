import '../../styles/save.css';

const SaveView = {
  render: async () => {
    return `
      <nav class="navbar__save">
        <a href="#/dashboard" class="navbar__save__link"><i class="fas fa-columns"></i></a>
        <a href="#/add" class="navbar__save__link"><i class="far fa-plus-square"></i></a>
        <a href="#/save" class="navbar__save__link"><i class="far fa-save"></i></a>
      </nav>

      <div class="saved__container">
        <div id="saved-list" class="saved__list">Loading...</div>
      </div>

      <footer class="footer__save">
        <p class="footer__save__text">
          Copyright &copy; 2024 Fiqri Dian P. Sinaga
        </p>
      </footer>
    `;
  },

  show: async (savedStories) => {
    const app = document.getElementById('app');
    app.innerHTML = await SaveView.render();

    // Animasi muncul
    app.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });

    await SaveView.afterRender(savedStories);
  },

  afterRender: (savedStories) => {
    const container = document.getElementById('saved-list');

    
    if (!savedStories || savedStories.length === 0) {
      container.innerHTML = `
      <div class="save__zero">
        <p>No saved reports found.</p>
      </div>`;
      return;
    }

    container.innerHTML = `
    <div class="save__grid">
    ${savedStories.map((story) => `
      <div class="save__card">
        <h3 class="save__card__header">${story.name}</h3>

        <img 
          class="save__card__image" 
          src="${story.photoUrl}" 
          alt="${story.name}" 
        >

        <p class="save__card__description">
          ${story.description}
        </p>

        <div class="map" id="map-${story.id}" style="height: 150px; margin-top: 10px;"></div>

        <small class="save__card__date">
          Created at: ${new Date(story.createdAt).toLocaleString()}
        </small>

        <a href="#/detail/${story.id}" class="save__card__readmore" data-id="${story.id}">
          <i class="fab fa-readme"></i> Read more
        </a>
      </div>
    `).join('')}
  </div>
`;

// Inisialisasi map Leaflet untuk setiap saved story yang punya koordinat
  savedStories.forEach((story) => {
    if (story.lat && story.lon) {
      const mapId = `map-${story.id}`;
      const mapContainer = document.getElementById(mapId);

      if (mapContainer) {
        const map = L.map(mapId).setView([story.lat, story.lon], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    }
   });
  }
};

export default SaveView;
