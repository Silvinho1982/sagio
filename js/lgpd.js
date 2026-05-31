// CONTROLE DE CONSENTIMENTO DA LGPD (DEFINITIVO)
function inicializarLGPD() {
    const lgpdBanner = document.getElementById("lgpd-banner");
    const btnAccept = document.getElementById("btn-lgpd-accept");

    if (!lgpdBanner || !btnAccept) return;

    if (!localStorage.getItem("lgpd_consent")) {
        setTimeout(() => {
            lgpdBanner.classList.remove("hidden");
        }, 500); 
    }

    btnAccept.addEventListener("click", function () {
        localStorage.setItem("lgpd_consent", "accepted");
        lgpdBanner.classList.add("hidden");
    });
}

// Lógica de envio do formulário encapsulada com segurança
function inicializarFormulario() {
    const formLead = document.getElementById('form-lead');
    
    if (!formLead) return;

    formLead.addEventListener('submit', function(e) {
        e.preventDefault(); 

        const consentimentoLGPD = localStorage.getItem('lgpd_consent') || 'not_accepted';
        const formData = new FormData(this);
        
        // Se a checkbox do HTML não enviou o valor, injetamos via localStorage
        if (!formData.has('lgpd_consentimento')) {
            formData.append('lgpd_consentimento', consentimentoLGPD);
        }

        // 3. Dispara a requisição AJAX CORRIGIDA
        fetch('api/salvar_lead.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro HTTP: ' + response.status);
            }
            return response.json(); // Tenta ler a resposta como JSON
        })
        .then(data => {
            if (data.status === 'sucesso') {
                alert('Inscrição realizada com sucesso! Entraremos em contato.');
                this.reset(); 
            } else {
                // Mostra a mensagem de erro que veio do PHP
                alert('Ops! Erro no servidor: ' + data.mensagem);
                console.error('Erro detalhado:', data);
            }
        })
        .catch(error => {
            console.error('Erro na requisição Fetch:', error);
            alert('O servidor respondeu com um erro. Verifique o console (F12) para detalhes.');
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        inicializarLGPD();
        inicializarFormulario();
    });
} else {
    inicializarLGPD();
    inicializarFormulario();
}