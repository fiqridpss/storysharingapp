import '../../styles/add.css';

const AddView = {
  render: () => {
    document.getElementById('app').innerHTML = `
      <nav class="navbar__add">
        <a href="#/dashboard" class="navbar__add__link"><i class="fas fa-columns"></i></a>
        <a href="#/add" class="navbar__add__link"><i class="far fa-plus-square"></i></a>
        <a href="#/save" class="navbar__dashboard__link"><i class="far fa-save"></i></a>
        <a href="#" id="logout-button" class="navbar__dashboard__link"><i class="fas fa-sign-out-alt"></i></a>
      </nav>

      <main tabindex="-1" id="main-content">
        <div class="story__add">
          <h2 class="story__add__header">Add Story</h2>
          <form id="addStory-form" enctype="multipart/form-data">
            <div class="form__group">
              <label for="description"><strong>Description :</strong></label><br>
              <textarea id="description" name="description" required class="form__textarea"></textarea>
            </div>

            <div class="form__group">
              <label for="openCamera-btn"><strong>Capture :</strong></label><br>
              <button type="button" id="openCamera-btn" class="story__add__button">Capture from the Camera</button>
            </div>

            <div id="camera-section" style="display:none;">
              <video id="camera-preview" autoplay playsinline width="300" class="camera__preview"></video><br>
              <button type="button" id="capture-btn" class="story__add__button">Take a Picture</button>
              <button type="button" id="closeCamera-btn" class="story__add__button">Stop Camera</button>
              <canvas id="canvas" style="display:none;"></canvas>
            </div>

            <div class="form__group" id="preview-section" style="margin-top: 10px;">
              <label><strong>Preview Picture :</strong></label>
              <img id="photo-preview" src="" alt="Preview" style="max-width: 300px; display: none;" class="story__card__image" />
            </div>

            <div class="form__group">
              <label for="map-add"><strong>Select Location on the Map (click) :</strong></label><br>
              <div id="map-add" style="height: 300px; margin-bottom: 10px;" class="story__add__map"></div>
            </div>

            <div class="form__group">
              <label for="latInput"><strong>Latitude (automatic):</strong></label><br>
              <input type="number" name="lat" id="latInput" step="any" readonly class="form__input">
            </div>

            <div class="form__group">
              <label for="lonInput"><strong>Longitude (automatic):</strong></label><br>
              <input type="number" name="lon" id="lonInput" step="any" readonly class="form__input">
            </div>

            <button type="submit" class="story__add__button">Add</button>
          </form>
        </div>
      </main>

      <footer class="footer__add">
        <p class="footer__add__text">
          Copyright &copy; 2024 Fiqri Dian P. Sinaga
        </p>
      </footer>
    `;
  },

  bindSubmitHandler(callback) {
    document.getElementById('addStory-form').addEventListener('submit', callback);
  },

  getFormData() {
    const form = document.getElementById('addStory-form');
    const formData = new FormData(form);
    return {
      description: formData.get('description'),
      lat: parseFloat(formData.get('lat')),
      lon: parseFloat(formData.get('lon')),
      photo: formData.get('photo'), // fallback
    };
  },

  showPreview(blob) {
    const photoURL = URL.createObjectURL(blob);
    const photoPreview = document.getElementById('photo-preview');
    photoPreview.src = photoURL;
    photoPreview.style.display = 'block';
  },

  initCamera(callbacks) {
    document.getElementById('openCamera-btn').addEventListener('click', callbacks.open);
    document.getElementById('capture-btn').addEventListener('click', callbacks.capture);
    document.getElementById('closeCamera-btn').addEventListener('click', callbacks.close);
  },

  startCamera(stream) {
    const video = document.getElementById('camera-preview');
    video.srcObject = stream;
    document.getElementById('camera-section').style.display = 'block';
  },

  captureImage() {
  const video = document.getElementById('camera-preview');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      AddView.showPreview(blob);
      resolve(blob);
    }, 'image/jpeg');
  });
},


  stopCamera() {
    document.getElementById('camera-section').style.display = 'none';
  },

  bindMapClick(callback) {
    const map = L.map('map-add').setView([-2.5489, 118.0149], 5);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const mapTilerLayer = L.tileLayer('https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key={APIMAPS}', {
      attribution: '&copy; MapTiler & OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key={APIMAPS}', {
      attribution: '&copy; MapTiler & OpenStreetMap contributors'
    });

    L.control.layers({
      'OpenStreetMap': osmLayer,
      'MapTiler (Street View)': mapTilerLayer,
      'MapTiler (Satellite View)': satelliteLayer
    }).addTo(map);

    osmLayer.addTo(map);
    map.on('click', callback);

    return map;
  },

  updateLatLonInputs(lat, lon) {
    document.getElementById('latInput').value = lat;
    document.getElementById('lonInput').value = lon;
  },

  updateMarker(map, marker, lat, lon) {
    if (marker) {
      marker.setLatLng([lat, lon]);
    } else {
      marker = L.marker([lat, lon]).addTo(map);
    }
    return marker;
  },
};

export default AddView;
