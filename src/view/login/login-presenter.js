import AuthModel from '../../model/auth-model.js';
import LoginView from './login.js';

const LoginPresenter = {
    init: async () => {
        const app = document.getElementById('app');
        app.innerHTML = LoginView.render();

        LoginView.afterRender(async (email, password) => {
            LoginView.showMessage('Please wait...');

            // Lanjut ke hasil
            const result = await AuthModel.loginUser(email, password);
            LoginView.showMessage(result.message, result.success);


            if (result.success) {
                // Simpan status login
                localStorage.setItem('isLoggedIn', 'true');

                // Redirect ke halaman dashboard
                window.location.hash = '#/dashboard'; 
            }
        });
    }
};

export default LoginPresenter;
