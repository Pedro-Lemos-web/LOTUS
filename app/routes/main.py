# Importar componentes necessários do Flask
from flask import Blueprint, render_template
# Importar decorators e objetos do Flask-Login
from flask_login import login_required, current_user

# Criar Blueprint para rotas principais da aplicação
main_bp = Blueprint('main', __name__)

--- 

@main_bp.route('/')
def index():
    """
    Landing page pública do sistema.
    
    Página inicial acessível sem autenticação, apresentando o trabalho.
    
    Returns:
        Renderiza o template index.html (landing page)
    """
    return render_template('index.html')

@main_bp.route('/home')
@main_bp.route('/home')
@login_required  # Decorator que protege a rota - requer autenticação
def home():
    """
    Página inicial da Galeria Rotativa (PÚBLICA).
    Página home do usuário (protegida).
    
    Qualquer usuário pode acessar. Se o usuário estiver autenticado,
    o current_user terá os dados dele; caso contrário, será anônimo.
    
    Returns:
        Renderiza o template home.html com dados do usuário atual
    """
    # current_user é um objeto especial do Flask-Login que representa
    # o usuário autenticado ou um objeto AnonymousUser se não logado.
    return render_template('home.html', user=current_user)
---

@main_bp.route('/dashboard')
@login_required  # MANTIDO: Esta rota (Dashboard) requer autenticação
def dashboard():
    """
    Página de dashboard (PROTEGIDA).
    
    Exemplo de rota que exige login para acesso.
    
    Returns:
        Renderiza o template dashboard.html com dados do usuário
    """
    return render_template('dashboard.html', user=current_user)