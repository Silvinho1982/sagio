// CONTROLE DE CONSENTIMENTO DA LGPD (DEFINITIVO)
function inicializarLGPD() {
    const lgpdBanner = document.getElementById("lgpd-banner");
    const btnAccept = document.getElementById("btn-lgpd-accept");

    if (!lgpdBanner || !btnAccept) return;

    // Se o usuário nunca aceitou, exibe o banner tirando a classe 'hidden'
    if (!localStorage.getItem("lgpd_consent")) {
        setTimeout(() => {
            lgpdBanner.classList.remove("hidden");
        }, 500); 
    }

    // Evento de clique no botão Aceitar
    btnAccept.addEventListener("click", function () {
        localStorage.setItem("lgpd_consent", "accepted");
        lgpdBanner.classList.add("hidden");
    });
}

// Lógica de envio do formulário encapsulada com segurança
function inicializarFormulario() {
    const formLead = document.getElementById('form-lead');
    
    // Se o formulário não existir nesta página, sai da função sem dar erro
    if (!formLead) return;

    formLead.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede a página de recarregar

        // 1. Recupera o status de consentimento do localStorage
        const consentimentoLGPD = localStorage.getItem('lgpd_consent') || 'not_accepted';

        // 2. Captura os dados do formulário dinamicamente
        const formData = new FormData(this);
        
        // Injeta o status da LGPD nos dados que vão para o PHP
        formData.append('lgpd_consentimento', consentimentoLGPD);

        // 3. Dispara a requisição AJAX para a nossa API do Postgres
        fetch('../api/salvar_lead.php', { 
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'sucesso') {
                console.log(`Salvo no Postgres em: ${data.performance.tempo_ms}`);
                alert('Inscrição realizada com sucesso! Entraremos em contato.');
                this.reset(); // Limpa o formulário
            } else {
                alert('Ops! Ocorreu um erro ao salvar seus dados.');
                console.error('Erro no banco:', data.erro_detalhado);
            }
        })
        .catch(error => {
            console.error('Erro na requisição Fetch:', error);
            alert('Erro de comunicação com o servidor.');
        });
    });
}

// Garante que as duas inicializações aguardem o DOM estar 100% pronto
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        inicializarLGPD();
        inicializarFormulario();
    });
} else {
    inicializarLGPD();
    inicializarFormulario();
}