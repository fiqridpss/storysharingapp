import LoginPresenter from '../view/login/login-presenter.js';
import RegisterPresenter from '../view/register/register-presenter.js';
import DashboardPresenter from '../view/dashboard/dashboard-presenter.js';
import DetailView from '../view/detail/detail.js';
import AddPresenter from '../view/add/add-presenter.js';
import SavePresenter from '../view/save/save-presenter.js';

const routes = {
    '/login': LoginPresenter.init,
    '/register': RegisterPresenter.init,
    '/dashboard': DashboardPresenter.init,
    '/detail': DetailView.init,
    '/add': AddPresenter.init,
    '/save': SavePresenter.init
};

const router = async () => {
    const hash = window.location.hash || '#/login';
    const path = hash.replace('#', '');

    // Fungsi untuk menjalankan navigasi dengan transisi halus
    const navigateWithTransition = async (callback) => {
        if (document.startViewTransition) {
            document.startViewTransition(async () => {
                // Tampilkan transisi halus
                await callback();
            });
        } else {
            // Jika browser tidak mendukung View Transition API, langsung jalankan
            await callback();
        }
    };

    if (routes[path]) {
    // Proteksi halaman tertentu agar hanya bisa diakses jika sudah login
    const protectedRoutes = ['/dashboard', '/add', '/save'];
    const token = localStorage.getItem('token');

    if (protectedRoutes.includes(path) && !token) {
        window.location.hash = '#/login';
        return;
    }

    // Route normal (login, register, dashboard)
    await navigateWithTransition(routes[path]);
    } else if (path.startsWith('/detail/')) {
        // Route dinamis untuk detail
        const id = path.split('/')[2]; // Ambil ID dari #/detail/:id
        const app = document.getElementById('app');
        await navigateWithTransition(async () => {
            app.innerHTML = await DetailView.render(id);
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.hash = '#/login';
                return;
            }

            const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (response.ok) {
                DetailView.afterRender(result.story);
            } else {
                app.innerHTML = `<p>Gagal memuat detail: ${result.message}</p>`;
            }
        });
    } else {
        // Route tidak dikenal
        window.location.hash = '#/login';
        
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
