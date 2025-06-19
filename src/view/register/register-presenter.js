import AuthModel from '../../model/auth-model.js';
import RegisterView from './register.js';

const RegisterPresenter = {
    init: async () => {
        const app = document.getElementById('app');
        app.innerHTML = RegisterView.render();

        RegisterView.afterRender(async (name, email, password) => {
            RegisterView.showMessage('Please wait...');

            // Lanjut ke hasil
            const result = await AuthModel.registerUser(name, email, password);
            RegisterView.showMessage(result.message, result.success);

            if (result.success) {
                // Redirect ke halaman login
                window.location.hash = '#/login';
            }
        });
    }
};

export default RegisterPresenter;
