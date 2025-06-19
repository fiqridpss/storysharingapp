import '../../styles/dashboard.css';
import { subscribeUser, unsubscribeUser } from '../../api/notification-api.js';

const DashboardView = {
    render: (stories = []) =>{
      const app = document.getElementById('app');
      app.innerHTML = `
      

      <a href="#dashboard-content" class="skip__to__content__dashboard" id="skip-to-content">Skip to main content</a>

      <nav class="navbar__dashboard">
        <a href="#/dashboard" class="navbar__dashboard__link"><i class="fas fa-columns"></i></a>
        <a href="#/add" class="navbar__dashboard__link"><i class="far fa-plus-square"></i></a>
        <a href="#/save" class="navbar__dashboard__link"><i class="far fa-save"></i></a>
        <button id="notif-toggle" class="navbar__dashboard__link notif__button">
    🔔
        </button>
        <a href="#" id="logout-button" class="navbar__dashboard__link"><i class="fas fa-sign-out-alt"></i></a>
      </nav>
      

      <div class="dashboard" id="dashboard-content" tabindex="-1">
        <div class="story__grid" id="story-list"></div>
      </div>

      <footer class="footer__dashboard">
        <p class="footer__dashboard__text">
          Copyright &copy; 2024 Fiqri Dian P. Sinaga
        </p>
      </footer>
      `;

      DashboardView.afterRender(stories);
      
    }, 

    
  

    afterRender: (stories) => {
      const listContainer = document.getElementById('story-list');
      listContainer.innerHTML = stories.map((story) => `
  
          <div class="story__card">
            <h3 class="story__card__header">${story.name}</h3>

            <img 
              class="story__card__image" 
              src="${story.photoUrl}" 
              alt="${story.name}" 
              width="200"
            >

            <p class="story__card__description">
              ${story.description}
            </p>

            <!-- Tambahkan peta khusus untuk story ini -->
            <div class="map" id="map-${story.id}" style="height: 200px; margin-top: 10px;"></div>

            <small class="story__card__date">
              Created at: ${new Date(story.createdAt).toLocaleString()}
            </small>

            <a href="#/detail/${story.id}" class="story__card__readmore" data-id="${story.id}">
              <i class="fab fa-readme"></i> Read more
            </a>

          </div>

      `).join('');

      const notifToggle = document.getElementById('notif-toggle');
      const token = localStorage.getItem('token');
      const updateButton = (subscribed) => {
        notifToggle.textContent = subscribed ? '🔕' : '🔔';
      };
      navigator.serviceWorker.ready.then((registration) => {
      registration.pushManager.getSubscription().then((subscription) => {
        updateButton(!!subscription);
        });
      });
      notifToggle.addEventListener('click', async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const confirmUnsub = confirm('Are you sure you want to turn off notifications?');
          if (!confirmUnsub) return;

          await unsubscribeUser(token);
          updateButton(false);
        } else {
          const confirmSub = confirm('Do you want to enable notifications?');
          if (!confirmSub) return;

          await subscribeUser(token);
          updateButton(true);
        }
      } catch (error) {
        console.error('Error handling subscription:', error);
      }

      });


      // Render peta kecil untuk setiap story
      stories.forEach((story) => {
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

      // Aksesibilitas: skip to content
      const skipLink = document.getElementById('skip-to-content');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById('dashboard-content');
          if (target) target.focus();
        });
      }

      document.querySelectorAll('.story__card__readmore').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const storyId = link.dataset.id;
        
          const app = document.getElementById('app');
        
          // Jalankan animasi keluar dulu
          app.animate([
            { opacity: 1 },
            { opacity: 0 }
          ], {
            duration: 300,
            easing: 'ease-in'
          }).onfinish = () => {
            // Setelah animasi selesai, ganti halaman
            window.location.hash = `#/detail/${storyId}`;
          };
        });
        

      });
      
      // Keluar aplikasi/logout
      const logoutButton = document.getElementById('logout-button');
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();

        const confirmLogout = confirm('Are you sure you want to logout?');
        
        // Hapus token dan status login
        if(confirmLogout) {
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          
          // Redirect ke halaman login
          window.location.hash = '#/login';
        }
      });
    }
    
    
  };
  
  export default DashboardView;
  