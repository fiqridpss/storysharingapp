import './styles/reset.css';
import './router/router.js';

document.body.innerHTML = `<div id="app"></div>`;

// Pendaftaran Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('✅ Service Worker registered!', reg);
      })
      .catch(err => {
        console.error('❌ Service Worker failed to register:', err);
      });
  });
}

// Izin notifikasi untuk user
if ('Notification' in window && navigator.serviceWorker) {
  Notification.requestPermission().then(permission => {
    console.log('Notification permission:', permission);
  });
}
