/**
 * Script principal da aplicação (Galeria Rotativa)
 * Contém funcionalidades JavaScript para melhorar a experiência do usuário
 */

// ========================================
// FUNÇÃO AUXILIAR PARA ALERTAS DINÂMICOS
// ========================================

/**
 * Exibe um alerta dinâmico na página
 * * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo do alerta (info, success, warning, danger)
 */
function showAlert(message, type = 'info') {
    // Buscar o container principal (ou body como fallback)
    const container = document.querySelector('.container') || document.body;
    
    // Criar elemento div para o alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.opacity = '0'; // Inicialmente invisível
    alert.innerHTML = `
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Inserir o alerta no início do conteúdo principal
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alert, mainContent.firstChild);
    } else {
        container.insertBefore(alert, container.firstChild);
    }

    // Animação de entrada
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s ease-in';
        alert.style.opacity = '1';
    }, 10);
    
    // Auto-remover após 5 segundos com animação
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s ease-out';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// ========================================
// AUTO-FECHAR ALERTAS EXISTENTES NO DOM
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar todos os elementos com classe 'alert' (mensagens flash do Flask)
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Garantir que a função de fechar manual (do HTML) funcione
        const closeButton = alert.querySelector('.alert-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                alert.remove();
            });
        }

        // Agendar remoção automática após 5 segundos (5000ms)
        setTimeout(() => {
            alert.style.transition = 'opacity 0.3s ease-out';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    });
});

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS DE AUTENTICAÇÃO
// ========================================

const authForm = document.querySelector('.auth-form');

if (authForm) {
    authForm.addEventListener('submit', function(e) {
        const username = document.getElementById('username');
        const password = document.getElementById('password');

        // 1. Tratamento e Validação de Usuário
        if (username) {
            username.value = username.value.trim();
            if (!username.value) {
                e.preventDefault();
                showAlert('O campo Usuário é obrigatório.', 'warning');
                username.focus();
                return;
            }
        }
        
        // 2. Validação de Senha
        if (password && !password.value) {
            e.preventDefault();
            showAlert('O campo Senha é obrigatório.', 'warning');
            password.focus();
            return;
        }

        // 3. Validação Específica do CADASTRO (Register)
        const isRegisterForm = window.location.pathname.includes('register') || authForm.action.includes('register');

        if (isRegisterForm) {
            const email = document.getElementById('email');
            const confirmPassword = document.getElementById('confirm_password');

            if (email && !/\S+@\S+\.\S+/.test(email.value)) {
                e.preventDefault();
                showAlert('Por favor, digite um Email válido.', 'warning');
                email.focus();
                return;
            }

            if (password && confirmPassword && password.value !== confirmPassword.value) {
                e.preventDefault();
                showAlert('As senhas digitadas não coincidem.', 'danger');
                confirmPassword.focus();
                return;
            }
            
            // Validação de força de senha (se aplicável)
            const strength = checkPasswordStrength(password.value);
            if (strength.score < 2) { 
                e.preventDefault();
                showAlert('Sua senha é muito fraca. Escolha uma senha com pelo menos 8 caracteres e letras maiúsculas/minúsculas.', 'danger');
                password.focus();
                return;
            }
        }
        
        // Se a validação passar, desabilitar botão e processar (função abaixo)
        handleFormSubmitLoading(authForm);
    });
}

// ========================================
// CONFIRMAÇÃO DE LOGOUT
// ========================================

const logoutLinks = document.querySelectorAll('.btn-logout');
logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (!confirm('Tem certeza que deseja sair da Galeria?')) {
            e.preventDefault();
        }
    });
});

// ========================================
// EFEITO DE LOADING NOS FORMULÁRIOS
// ========================================

/**
 * Lida com o feedback visual de loading em formulários
 * @param {HTMLElement} form - O elemento do formulário sendo enviado
 */
function handleFormSubmitLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processando...';
        submitBtn.style.opacity = '0.7';
    }
}

// Aplicar loading a todos os forms que não foram tratados acima (ex: upload)
const otherForms = document.querySelectorAll('form:not(.auth-form)');
otherForms.forEach(form => {
    form.addEventListener('submit', function() {
        handleFormSubmitLoading(form);
    });
});


// ========================================
// VALIDADOR E INDICADOR DE FORÇA DE SENHA
// (Mantido do original, apenas renomeado)
// ========================================

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return {
        score: strength,
        message: strength < 2 ? 'Fraca' : strength < 4 ? 'Média' : 'Forte'
    };
}

const passwordInput = document.getElementById('password');
const isRegisterPage = window.location.pathname.includes('register') || (document.querySelector('.auth-title') && document.querySelector('.auth-title').textContent.includes('Cadastre-se'));

if (passwordInput && isRegisterPage) {
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength';
    strengthIndicator.style.cssText = 'margin-top: 0.5rem; font-size: 0.875rem;';
    passwordInput.parentElement.appendChild(strengthIndicator);
    
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        const colors = {
            'Fraca': '#ef4444', 
            'Média': '#f59e0b', 
            'Forte': '#10b981'
        };
        
        strengthIndicator.textContent = `Força da senha: ${strength.message}`;
        strengthIndicator.style.color = colors[strength.message];
    });
}

// ========================================
// LÓGICA DO CARROSSEL DE IMAGENS ROTATIVAS
// (Movido do index.html para o main.js)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('imageCarousel');
    if (!carousel) return; // Sair se não houver carrossel na página

    const images = carousel.querySelectorAll('.carousel-image');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    let currentIndex = 0;
    const intervalTime = 5000; // 5 segundos
    let rotationInterval;

    function updateCarousel() {
        images.forEach((img, index) => {
            img.classList.remove('active');
            if (index === currentIndex) {
                img.classList.add('active');
            }
        });
        updateIndicators();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    function startRotation() {
        // Limpa o intervalo anterior para evitar duplicação
        clearInterval(rotationInterval); 
        rotationInterval = setInterval(showNext, intervalTime);
    }

    function resetRotation() {
        clearInterval(rotationInterval);
        startRotation();
    }

    // Criar Indicadores
    function createIndicators() {
        images.forEach((_, index) => {
            const indicator = document.createElement('span');
            indicator.classList.add('indicator');
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                resetRotation();
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    // Atualizar Indicadores
    function updateIndicators() {
        if (!indicatorsContainer) return; // Sai se não houver container de indicadores
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((ind, index) => {
            ind.classList.toggle('active', index === currentIndex);
        });
    }

    // Event Listeners (Botões)
    nextBtn.addEventListener('click', () => {
        showNext();
        resetRotation();
    });

    prevBtn.addEventListener('click', () => {
        showPrev();
        resetRotation();
    });

    // Inicialização do Carrossel
    if (images.length > 0) {
        if (indicatorsContainer) {
            createIndicators();
        }
        updateCarousel(); 
        startRotation();
    }
});


// ========================================
// ANIMAÇÃO DE CARREGAMENTO DA PÁGINA (Fade-in)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s ease-in';
        document.body.style.opacity = '1';
    }, 10);
});

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================

console.log('Galeria Rotativa Flask - IENH Dev Sistemas II 2025: Script Principal Carregado.');