import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem('token')
    );

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/me');

                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/login', {
            email,
            password,
        });

        const newToken = response.data.token;

        localStorage.setItem('token', newToken);
        setToken(newToken);

        setUser(response.data.user);

        return response.data;
    };

    const register = async (
        name,
        email,
        password,
        password_confirmation
    ) => {
        const response = await api.post('/register', {
            name,
            email,
            password,
            password_confirmation,
        });

        return response.data;
    };

const logout = async () => {
    console.log('🔵 logout() started');

    const currentToken = localStorage.getItem('token');

    console.log('🔵 Token from localStorage:', currentToken);

    if (!currentToken) {
        console.log('🟡 No token found');

        setToken(null);
        setUser(null);

        return;
    }

    try {
        console.log('🔵 Sending POST /logout to Laravel...');

        const response = await api.post('/logout');

        console.log('🟢 Laravel logout response:', response.data);

    } catch (error) {
        console.error('🔴 Laravel logout failed');

        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);

    } finally {
        console.log('🔵 Clearing frontend authentication...');

        localStorage.removeItem('token');
        setToken(null);
        setUser(null);

        console.log('🟢 Frontend authentication cleared');
    }
};

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}