from django import forms
from .models import Aluno

class AlunoForm(forms.ModelForm):
    data_nascimento = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = Aluno
        fields = '__all__'
        widgets = {
            'nome': forms.TextInput(attrs={'class': 'form-control'}),
            'nome_social': forms.TextInput(attrs={'class': 'form-control'}),
            'id_aluno': forms.TextInput(attrs={'class': 'form-control'}),
            'contato': forms.TextInput(attrs={'class': 'form-control'}),
            'cpf': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '000.000.000-00'}),
            'contato_emergencial': forms.TextInput(attrs={'class': 'form-control'}),
            'responsavel': forms.TextInput(attrs={'class': 'form-control'}),
            'cep': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '00000-000'}),
            'endereco': forms.TextInput(attrs={'class': 'form-control'}),
            'numero': forms.TextInput(attrs={'class': 'form-control'}),
            'bairro': forms.TextInput(attrs={'class': 'form-control'}),
            'cidade': forms.TextInput(attrs={'class': 'form-control'}),
            'uf': forms.TextInput(attrs={'class': 'form-control'}),
            'observacoes': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'serie': forms.Select(attrs={'class': 'form-control'}),
            'turma': forms.Select(attrs={'class': 'form-control'}),
            'periodo': forms.Select(attrs={'class': 'form-control'}),
            'foto': forms.FileInput(attrs={'class': 'form-control'}),
            'sexo': forms.Select(attrs={'class': 'form-control'}),
            'deficiencia': forms.Select(attrs={'class': 'form-control'}),
            'deficiencia_qual': forms.TextInput(attrs={'class': 'form-control'}),
        }
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.instance or not self.instance.pk:
            self.fields['foto'].required = True

    def clean(self):
        cleaned_data = super().clean()
        nome = cleaned_data.get('nome')
        nome_social = cleaned_data.get('nome_social')

        if nome and not nome_social:
            cleaned_data['nome_social'] = nome

        if cleaned_data.get('deficiencia') == 'S' and not cleaned_data.get('deficiencia_qual'):
            cleaned_data['deficiencia_qual'] = 'Não Informado'

        return cleaned_data

    def clean_cpf(self):
        cpf = self.cleaned_data.get('cpf')

        # Se o CPF estiver vazio, converte para None para não dar erro de duplicidade no banco
        if not cpf:
            return None

        # Validação utilizando a lógica otimizada
        cpf_limpo = ''.join(filter(str.isdigit, cpf))

        if len(cpf_limpo) != 11:
            raise forms.ValidationError("CPF deve ter 11 dígitos.")

        if cpf_limpo == cpf_limpo[0] * 11:
            raise forms.ValidationError("CPF inválido.")

        for i in range(9, 11):
            soma = sum(int(cpf_limpo[num]) * ((i+1) - num) for num in range(i))
            digito = ((soma * 10) % 11) % 10
            if int(cpf_limpo[i]) != digito:
                raise forms.ValidationError("CPF inválido. Verifique a numeração.")

        return cpf # Retorna o CPF original (com máscara) se for válido
