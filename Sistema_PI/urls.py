"""
URL configuration for Sistema_PI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:     from my_app import views
    2. Add a URL to urlpatterns:   path('', views.home, name='home')
Class-based views
    1. Add an import:     from other_app.views import Home
    2. Add a URL to urlpatterns:   path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:   path('blog/', include('blog.urls'))
"""
"""
URL configuration for Sistema_PI project.
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from Sistema_Alunos import views  # ESTA É A ÚNICA IMPORTAÇÃO DE VIEWS QUE VOCÊ PRECISA

urlpatterns = [
    # Página principal (Login)
    path('', views.login_view, name='home'),
    
    path('admin/', admin.site.urls),
    path('index/', views.index, name='index'),
    path('cadastro/', views.cadastrar_aluno, name='cadastro'),
    path('buscar_aluno/', views.buscar_aluno, name='buscar_aluno'),
    path('login/', views.login_view, name='login'),
    
    # Logout do Django
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    
    # Detalhes e PDF
    path('detalhes_aluno/<str:id_aluno>/', views.detalhes_aluno, name='detalhes_aluno'),
    path('aluno/<str:id_aluno>/pdf/', views.gerar_pdf_aluno, name='gerar_pdf_aluno'),
    
    # Edição e Exclusão
    path('aluno/editar/<str:id_aluno>/', views.editar_aluno, name='editar_aluno'),
    path('aluno/excluir/<str:id_aluno>/', views.excluir_aluno, name='excluir_aluno'),

    # Dashboard
    path('dashboard/', views.dashboard, name='dashboard'),
]

# Configuração para fotos (mídia)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)