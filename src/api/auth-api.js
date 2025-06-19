export const login = async (email, password) => {
    try {
        const response = await fetch('https://story-api.dicoding.dev/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Login Failed' };
        }

        localStorage.setItem('token', data.loginResult.token);

        return {
            success: true,
            message: 'Login successful',
            user: data.loginResult
        };

    } catch (error) {
        return { success: false, message: 'Network error or server not reachable' };
    }
};

export const register = async (name, email, password) => {
    try {
        const response = await fetch('https://story-api.dicoding.dev/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Register Failed' };
        }

        return { success: true, message: data.message || 'Register successful' };

    } catch (error) {
        return { success: false, message: 'Network error or server not reachable' };
    }
};
