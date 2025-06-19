import AddView from './add.js';
import StoryModel from '../../model/story-model.js';

const AddPresenter = {
  init: () => {
    if (!localStorage.getItem('token')) {
      window.location.hash = '#/login';
      return;
    }

    AddView.render();
    document.getElementById('logout-button').addEventListener('click', (e) => {
      e.preventDefault();

      const confirmLogout = confirm('Are you sure you want to logout?')

      if (confirmLogout) {
        localStorage.removeItem('token'); // Hapus token dari localStorage
        window.location.hash = '#/login'; // Arahkan ke halaman login
      }
    });

    let marker = null;
    const map = AddView.bindMapClick((e) => {
      const { lat, lng } = e.latlng;
      marker = AddView.updateMarker(map, marker, lat, lng);
      AddView.updateLatLonInputs(lat, lng);
    });

    let capturedBlob = null;
    let videoStream = null;


    
    AddView.initCamera({
      open: async () => {
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          AddView.startCamera(videoStream);
        } catch (err) {
          alert('Kamera gagal dibuka: ' + err.message);
        }
      },
      capture: async () => {
        capturedBlob = await AddView.captureImage();
      },
      close: () => {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          videoStream = null;
        }
        AddView.stopCamera();
      }
    });

    AddView.bindSubmitHandler(async (e) => {
      e.preventDefault();
      const { description, photo, lat, lon } = AddView.getFormData();
      const finalPhoto = capturedBlob || photo;

      if (!finalPhoto || finalPhoto.size > 2 * 1024 * 1024) {
        alert('Foto wajib dan max 2MB.');
        return;
      }

      const result = await StoryModel.addStory(localStorage.getItem('token'), {
        description, photo: finalPhoto, lat, lon,
      });

      if (result.success) {
        alert('Story berhasil ditambahkan!');
        location.hash = '#/dashboard';
      } else {
        alert('Gagal: ' + result.message);
      }
    });

    window.addEventListener('beforeunload', () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    });

    window.addEventListener('hashchange', () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
      }
    });
  }
};

export default AddPresenter;
