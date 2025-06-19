import '../../styles/login.css';

const LoginView = {
    render: () => {
        return `
            <div class="container__auth__login">
                <div class="container__auth__login__box">
                    <h2 class="login__header">Login</h2>
                    <small>StoriesData App</small>

                    <form class="login__form" id="login-form">
                    <label for="email"><strong>Email :</strong></label>
                    <input 
                        class="login__form__email" 
                        type="email" 
                        placeholder="Email" 
                        id="email" 
                        required><br>

                    <label for="password"><strong>Password :</strong></label>
                    <input 
                        class="login__form__password" 
                        type="password" 
                        placeholder="Password" 
                        id="password" 
                        required><br>

                    <button 
                        class="login__form__button" 
                        type="submit">
                        Sign In
                    </button>
                    </form>

                    <!-- Ini penting! Sesuai error sebelumnya -->
                    <p class="login__message" id="login-message"></p>

                    <div class="router__login">
                    <p>
                        Click to register
                        <a class="router__login__register" href="#/register">
                        <i class="fas fa-user-circle"></i> Register
                        </a>
                    </p>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: (onSubmit) => {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.email.value;
            const password = form.password.value;
            onSubmit(email, password);
        });
    },

    showMessage: (message, success = null) => {
        const msg = document.getElementById('login-message');
        msg.textContent = message;
    
        if (success !== null) {
            msg.style.color = success ? 'green' : 'red';
        } else {
            msg.style.color = '';
        }
    }
    
};

export default LoginView;
