console.log("Arquivo script.js carregado!"); // Log para confirmar carregamento do arquivo

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf === '') return true; // Não obrigatório

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++)
        soma += parseInt(cpf.charAt(i)) * (10 - i);

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++)
        soma += parseInt(cpf.charAt(i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
}

function buscarAluno() {
    const termoBusca = document.getElementById("busca").value;
    // A busca real será implementada no backend
    alert(`Buscando por: ${termoBusca}`);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM carregado. Iniciando configuração dos eventos...");

    // 1. Configuração do Formulário (Validação no Submit)
    const cadastroForm = document.getElementById("cadastro-form");
    if (cadastroForm) {
        console.log("Formulário de cadastro encontrado.");
        cadastroForm.addEventListener("submit", function(event) {
            const cpfInput = document.getElementById("id_cpf"); // ID padrão do Django para o campo CPF
            if (cpfInput && !validarCPF(cpfInput.value)) {
                event.preventDefault();
                alert("CPF inválido! Por favor, verifique a numeração.");
            }
        });
    }

    // 2. Configuração do CPF (Máscara) - Independente do formulário
    const cpfInput = document.getElementById("id_cpf");
    if (cpfInput) {
        console.log("Campo CPF encontrado.");
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    // 3. Configuração do CEP (API ViaCEP)
    const cepInput = document.getElementById("id_cep");
    if (cepInput) {
        console.log("Campo CEP encontrado. Adicionando eventos...");
        let ultimoCep = ""; // Cache simples para evitar consultas repetidas
        
        // Máscara CEP
        cepInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value.slice(0, 9);
        });

        // Evento Blur (Busca API)
        cepInput.addEventListener('blur', function(e) {
            console.log("Evento BLUR disparado no CEP.");
            
            const cep = e.target.value.replace(/\D/g, '');

            // 1. Validação do formato e cache (Sugestões 1 e 2)
            if (!/^[0-9]{8}$/.test(cep)) {
                console.log("CEP inválido ou incompleto. Nenhuma ação tomada.");
                return; // Interrompe se o CEP não tiver 8 dígitos
            }
            if (cep === ultimoCep) {
                console.log("CEP já consultado. Usando cache.");
                return; // Interrompe se o CEP for o mesmo da última consulta
            }
            ultimoCep = cep; // Atualiza o cache
            
            const enderecoInput = document.getElementById('id_endereco');
            const bairroInput = document.getElementById('id_bairro');
            const cidadeInput = document.getElementById('id_cidade');
            const ufInput = document.getElementById('id_uf');
            const numeroInput = document.getElementById('id_numero');

            const fields = [enderecoInput, bairroInput, cidadeInput, ufInput];

            function setFieldsState(disabled, message = '') {
                fields.forEach(field => {
                    if (field) {
                        field.disabled = disabled;
                        if (disabled && message) field.value = message;
                    }
                });
            }

            setFieldsState(true, 'Buscando...');
            console.log(`Consultando API para o CEP: ${cep}`);

            // 2. Timeout da API (Sugestão 3)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

            fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controller.signal })
                .then(response => response.json())
                .then(data => {
                    console.log("Retorno da API:", data);
                    if (!data.erro) {
                        if(enderecoInput) enderecoInput.value = data.logradouro;
                        if(bairroInput) bairroInput.value = data.bairro;
                        if(cidadeInput) cidadeInput.value = data.localidade;
                        if(ufInput) ufInput.value = data.uf;
                        if(numeroInput) numeroInput.focus();
                    } else {
                        fields.forEach(field => { if(field) field.value = ''; });
                        alert("CEP não encontrado.");
                    }
                })
                .catch(error => {
                    // 3. Melhor tratamento de erro (Sugestão 5)
                    if (error.name === 'AbortError') {
                        alert("A busca pelo CEP demorou muito. Verifique sua conexão e tente novamente.");
                    } else {
                        alert("Ocorreu um erro ao buscar o CEP. Tente novamente mais tarde.");
                    }
                    console.error('Erro na requisição:', error);
                    fields.forEach(field => { if(field) field.value = ''; }); // Limpa os campos em caso de erro
                })
                .finally(() => {
                    clearTimeout(timeoutId); // Limpa o timeout
                    setFieldsState(false); // Reabilita os campos
                });
        });
    } else {
        console.warn("Campo CEP (id_cep) não encontrado nesta página.");
    }
});
