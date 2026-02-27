// frontend/app.js
const API_URL = 'http://localhost:3333';

// --- Funções Utilitárias ---

function log(message, isError = false) {
    const logBox = document.getElementById('response-log');
    logBox.style.color = isError ? '#ff4444' : '#00ff00';
    
    if (typeof message === 'object') {
        logBox.textContent = JSON.stringify(message, null, 2);
    } else {
        logBox.textContent = message;
    }
}

function showTab(tab) {
    document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('register-form').style.display = tab === 'register' ? 'flex' : 'none';
    
    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tab)) btn.classList.add('active');
    });
}

function updateUI() {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'block';
        document.getElementById('user-name').textContent = user.name || 'Usuário';
        document.getElementById('user-email').textContent = user.email || '';
        document.getElementById('access-token-display').value = token;
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('dashboard-section').style.display = 'none';
    }
}

// --- Chamadas para a API ---

async function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Erro ao registrar');
        
        log('Registro realizado! Verifique seu e-mail (console do servidor) para o token, ou faça login.');
        showTab('login');
    } catch (err) {
        log(err.message, true);
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');

        // Salva tokens e dados do usuário
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));

        log('Login realizado com sucesso!');
        updateUI();
    } catch (err) {
        log(err.message, true);
    }
}

async function getProfile() {
    const token = localStorage.getItem('accessToken');

    try {
        const res = await fetch(`/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer `
            }
        });

        const data = await res.json();

        if (!res.ok) {
            if (res.status === 401) log('Token expirado ou inválido. Tente o Refresh Token.', true);
            else throw new Error(data.error);
            return;
        }

        log(data); // Mostra os dados do perfil no log
    } catch (err) {
        log(err.message, true);
    }
}

async function handleRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const res = await fetch(`/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Erro no refresh');

        // Atualiza o access token
        localStorage.setItem('accessToken', data.accessToken);
        log('Token atualizado com sucesso!');
        updateUI();
    } catch (err) {
        log(err.message, true);
        handleLogout(); // Se o refresh falhar, desloga
    }
}

async function handleLogout() {
    const token = localStorage.getItem('accessToken');

    try {
        // Chama a API para invalidar o token no Redis
        await fetch(`/logout`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer `
            }
        });
    } catch (err) {
        console.error('Erro ao notificar logout para API', err);
    } finally {
        // Limpa dados locais independente da resposta da API
        localStorage.clear();
        log('Logout realizado.');
        updateUI();
    }
}

// Inicializa a UI ao carregar a página
document.addEventListener('DOMContentLoaded', updateUI);