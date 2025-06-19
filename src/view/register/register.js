import '../../styles/register.css';

const RegisterView = {
    render: () => {
        return `
            <div class="container__auth__register">
                <div class="container__auth__register__box">
                    <h2 class="register__header">Register</h2>
                    <small>StoriesData App</small>

                    <form class="register__form" id="register-form">
                        <label for="name"><strong>Name :</strong></label>
                        <input 
                            class="register__form__name" 
                            type="text" 
                            placeholder="Name" 
                            id="name" 
                            required><br>

                        <label for="email"><strong>Email :</strong></label>
                        <input 
                            class="register__form__email" 
                            type="email" 
                            placeholder="Email" 
                            id="email" 
                            required><br>

                        <label for="password"><strong>Password :</strong></label>
                        <input 
                            class="register__form__password" 
                            type="password" 
                            placeholder="Password" 
                            id="password" 
                            required><br>

                        <button 
                            class="register__form__button" 
                            type="submit">
                            Sign Up
                        </button>
                    </form>

                    <p class="register__message" id="register-message"></p>

                    <div class="router__register">
                        <p>
                            Already have an account? 
                            <a class="router__register__login" href="#/login">
                                <i class="fas fa-sign-in-alt"></i> Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        `;
    },
    
    afterRender: (onSubmit) => {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.name.value;
            const email = form.email.value;
            const password = form.password.value;
            onSubmit(name, email, password);
        });
    },

    showMessage: (message, success = null) => {
        const msg = document.getElementById('register-message');
        msg.textContent = message;
    
        if (success !== null) {
            msg.style.color = success ? 'green' : 'red';
        } else {
            msg.style.color = '';
        }
    }
};

export default RegisterView;
