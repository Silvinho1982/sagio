# 🛥️ Sagio Turismo - Plataforma de Captação e Agendamento

Uma aplicação web de alta performance desenvolvida para a Sagio Turismo, focada na captação de leads e agendamento de passeios. O sistema foi arquitetado com ênfase em segurança de dados, responsividade e total conformidade com a Lei Geral de Proteção de Dados (LGPD).

## 🚀 Tecnologias Utilizadas

**Frontend:**
*   **HTML5 & CSS3:** Interface estruturada e responsiva (Mobile First).
*   **JavaScript (Vanilla):** Requisições assíncronas via `Fetch API` para uma experiência de usuário (UX) fluida sem recarregamento de página. Gerenciamento de estado de consentimento via `localStorage`.

**Backend & Infraestrutura:**
*   **PHP 8+:** API RESTful leve para processamento do formulário e validação de regras de negócio.
*   **PostgreSQL:** Banco de dados relacional garantindo integridade e transações ACID. Conexão via PDO com *Prepared Statements* contra SQL Injection.
*   **Neon.tech:** Hospedagem Serverless do banco de dados na nuvem.
*   **Render:** Hospedagem da aplicação web com deploy contínuo e certificado SSL/HTTPS automático.

## ⚙️ Arquitetura e Funcionalidades

*   **Conformidade LGPD Dinâmica:** Banner de consentimento de cookies e políticas de privacidade. O aceite é registrado tanto no `localStorage` do navegador do cliente quanto persistido no banco de dados para segurança jurídica da empresa.
*   **Processamento Assíncrono:** O tempo de resposta da API para gravação do lead no banco opera na casa dos milissegundos, com feedback visual instantâneo para o usuário na interface.
*   **Segurança (Blindagem):** 
    *   Ocultação de credenciais de banco de dados utilizando variáveis de ambiente (`getenv`).
    *   Prevenção contra XSS (Cross-Site Scripting) na entrada de dados.

## 🛠️ Como executar o projeto localmente

### 1. Pré-requisitos
*   Servidor web local (Apache/Nginx) com suporte a PHP (ex: XAMPP, WAMP ou Docker).
*   PostgreSQL instalado localmente (ou uma conta no Neon.tech para o banco na nuvem).

### 2. Passos para Instalação

1. Clone este repositório:
```bash
   git clone [https://github.com/SEU_USUARIO/sagio-turismo.git](https://github.com/SEU_USUARIO/sagio-turismo.git)
