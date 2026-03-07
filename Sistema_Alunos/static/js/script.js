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

const cadastroForm = document.getElementById("cadastro-form");
if (cadastroForm) { // Verifica se o formulário existe na página
    cadastroForm.addEventListener("submit", function(event) {
        const cpfInput = document.getElementById("id_cpf"); // ID padrão do Django para o campo CPF
        if (cpfInput && !validarCPF(cpfInput.value)) {
            event.preventDefault();
            alert("CPF inválido! Por favor, verifique a numeração.");
        }
    });

    // Máscara automática para CPF enquanto digita
    const cpfInput = document.getElementById("id_cpf");
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
}