import { login, register } from '../api/auth-api.js';

const AuthModel = {
    loginUser: async (email, password) => await login(email, password),
    registerUser: async (name, email, password) => await register(name, email, password)
};

export default AuthModel;
