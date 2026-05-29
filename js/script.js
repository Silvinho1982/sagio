/* ==========================================================================
   MÁSCARA AUTOMÁTICA PARA O CAMPO DE WHATSAPP (HOME)
   ========================================================================== */
const inputTel = document.getElementById('homeWhatsapp');

if (inputTel) {
    inputTel.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        
        // Aplica a formatação dinamicamente conforme digita
        if (value.length > 0) {
            value = '(' + value;
        }
        if (value.length > 3) {
            value = [value.slice(0, 3), ') ', value.slice(3)].join('');
        }
        if (value.length > 10) {
            value = [value.slice(0, 10), '-', value.slice(10)].join('');
        }
        
        // Limita o tamanho máximo da string formatada
        e.target.value = value.slice(0, 15);
    });
}

/* ==========================================================================
   PROCESSAMENTO E ENVIO DO FORMULÁRIO PARA O WHATSAPP (HOME ANTIGO)
   ========================================================================== */
// Envolve o formulário antigo em uma checagem de segurança para não travar o DOM
const homeForm = document.getElementById('homeContactForm');

if (homeForm) {
    homeForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede a página de recarregar

        // Captura os valores digitados pelo usuário
        const nome = document.getElementById('homeNome')?.value?.trim();
        const whatsappInput = document.getElementById('homeWhatsapp')?.value?.trim();
        const mensagemCliente = document.getElementById('homeMensagem')?.value?.trim();

        // Validação básica extra de segurança
        if (!nome || !whatsappInput || !mensagemCliente) {
            alert("Por favor, preencha todos os campos do formulário.");
            return;
        }

        // Número de destino da Sagio
        const numeroSagio = "5586998287948"; 

        // Monta o texto da mensagem usando quebras de linha (%0A) e negrito (*)
        const textoMensagem = `Olá, equipe Sagio Turismo!%0A%0A` +
                              `Gostaria de solicitar informações através do site:%0A%0A` +
                              `*Nome:* ${nome}%0A` +
                              `*WhatsApp de Contato:* ${whatsappInput}%0A%0A` +
                              `*Mensagem:*%0A${mensagemCliente}`;

        // Monta o link final da API do WhatsApp
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroSagio}&text=${textoMensagem}`;

        // Abre a conversa em uma nova aba do navegador de forma limpa
        window.open(urlWhatsApp, '_blank');
    });
}

/* ==========================================================================
   EXTENSÃO DO SCRIPT PARA A PÁGINA PREMIUM
   ========================================================================== */

// Função para auto-selecionar a lancha ao clicar no botão do card
function selecionarEmbarcacao(nomeLancha) {
    const selectEmbarcacao = document.getElementById('premiumEmbarcacao');
    if (selectEmbarcacao) {
        selectEmbarcacao.value = "Lancha " + nomeLancha;
    }
}

// Máscara do WhatsApp para o formulário Premium
const premiumTel = document.getElementById('premiumWhatsapp');
if (premiumTel) {
    premiumTel.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) value = '(' + value;
        if (value.length > 3) value = [value.slice(0, 3), ') ', value.slice(3)].join('');
        if (value.length > 10) value = [value.slice(0, 10), '-', value.slice(10)].join('');
        e.target.value = value.slice(0, 15);
    });
}

// Envio do formulário Premium para o WhatsApp
const premiumForm = document.getElementById('premiumContactForm');
if (premiumForm) {
    premiumForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('premiumNome').value.trim();
        const whatsapp = document.getElementById('premiumWhatsapp').value.trim();
        const data = document.getElementById('premiumData').value;
        const passageiros = document.getElementById('premiumPassageiros').value;
        const embarcacao = document.getElementById('premiumEmbarcacao').value;

        // Formata data para DD/MM/AAAA
        const dataFormatada = data.split('-').reverse().join('/');
        
        const numeroSagio = "5586998287948"; // Número oficial

        const mensagem = `Olá! Gostaria de solicitar um orçamento premium para locação exclusiva:%0A%0A` +
                         `*Nome:* ${nome}%0A` +
                         `*WhatsApp:* ${whatsapp}%0A` +
                         `*Data Pretendida:* ${dataFormatada}%0A` +
                         `*Nº de Passageiros:* ${passageiros}%0A` +
                         `*Embarcação Escolhida:* ${embarcacao}`;

        window.open(`https://api.whatsapp.com/send?phone=${numeroSagio}&text=${mensagem}`, '_blank');
    });
}