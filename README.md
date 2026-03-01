# 📝 Brain Dump - Bloco de Notas Minimalista

Um bloco de notas elegante e minimalista com design all-black, editor rico feito em HTML5, CSS3 e JavaScript vanilla.

## 📖 Páginas Disponíveis

| Página                | Descrição                          | Acesso                                    |
| --------------------- | ---------------------------------- | ----------------------------------------- |
| **start.html**        | 🏠 Página inicial com navegação    | `http://localhost:8000/start.html`        |
| **index.html**        | ✏️ App principal de notas          | `http://localhost:8000/index.html`        |
| **about.html**        | ℹ️ Conheça o App (funcionalidades) | `http://localhost:8000/about.html`        |
| **features.html**     | ✨ Features detalhadas             | `http://localhost:8000/features.html`     |
| **project-info.html** | 📁 Estrutura do projeto            | `http://localhost:8000/project-info.html` |
| **creator.html**      | 👨‍💻 Conheça o criador               | `http://localhost:8000/creator.html`      |
| **README.md**         | 📚 Documentação completa           | N/A                                       |
| **CHANGELOG.md**      | 📝 Histórico de versões            | N/A                                       |
| **TESTING.md**        | 🧪 Guia de testes                  | N/A                                       |

## ✨ Funcionalidades

### Core Features

- ✅ **Criação de notas** - Botão + rápido para nova nota
- ✅ **Categorias** - Organize em 3 categorias: Ideias, Estudos, Trabalho
- ✅ **Auto-save** - Salva automaticamente enquanto você digita
- ✅ **Busca** - Procure suas notas rapidamente
- ✅ **Afixar notas** - Fixe as notas importantes no topo
- ✅ **Estatísticas** - Veja contagem de notas e palavras

### Editor Rico (Rich Text)

- 🔤 **Negrito, Itálico, Sublinhado**
- 📋 **Títulos H1 e H2**
- ◦ **Listas com bullets e numeradas**
- 💻 **Blocos de código**

### Import/Export

- 📥 **Importar .txt** - Carregue arquivos de texto como notas
- � **Importar PDF** - Parse automático com PDF.js
- 📤 **Exportar .txt** - Salve uma nota ou todas como arquivo de texto
- 📄 **Exportar PDF** - Gera PDF formatado para imprimir

### Sincronização Local

- 🔄 **Sincronizar com pasta** - Backup automático em pasta local
- 🛡️ **Proteção de dados** - Nunca perca suas notas

### Temas

- 🌙 **Tema Escuro** - Design all-black (padrão)
- ☀️ **Tema Claro** - Interface clara e legível
- 💾 **Persistência** - Tema é salvo automaticamente

### Atalhos de Teclado

- `Ctrl+B` - **Negrito**
- `Ctrl+I` - **Itálico**
- `Ctrl+U` - **Sublinhado**
- `Ctrl+S` - **Exportar como .txt**

## 🚀 Como Usar

### Navegador

Abra `start.html` (página inicial) ou `index.html` (app direto) no seu navegador preferido. Não precisa de instalação!

```bash
# Abrir página inicial (recomendado)
start start.html
# ou
open start.html  # macOS

# Ou abrir app direto
start index.html
# ou
open index.html  # macOS
```

### Sincronização com Pasta Local

🖱️ **Pelo Navegador (recomendado)**

1. Abra o app (`start.html` ou `index.html`).
2. Clique no menu **⋮** e escolha **🔄 Sincronizar pasta**.
3. Um diálogo do sistema será exibido para você **selecionar a pasta desejada**.
4. O aplicativo grava dentro dela apenas dois subdiretórios:
   - `txt/` contendo um `.txt` para cada nota (nome baseado no título + id)
   - `pdf/` contendo um `.pdf` para cada nota gerado automaticamente

> Você pode escolher notas individuais na barra lateral (marque as caixas) e usar o menu 🔄 **Sincronizar selecionadas** para exportar somente elas.
>
> Para apagar várias notas de uma vez, marque-as e escolha 🗑️ **Excluir selecionadas** no mesmo menu. Esse comando limpa as notas do app sem precisar abrir cada uma.

> Esta opção usa a API de acesso ao sistema de arquivos. Se o seu
> navegador não a suportar, será exibida a instrução abaixo.

🖥️ **Via servidor Node.js (fallback/opcional)**

Caso prefira ou se o navegador não suportar a seleção de pastas, execute:

```bash
# 1. Abra o terminal no diretório do projeto
cd "c:\Users\USER\Desktop\BLOCO DE NOTAS"

# 2. Inicie o servidor de sincronização
node sync-server.js
```

Durante a inicialização o servidor perguntará o caminho da pasta onde
salvará as notas. Ele irá criar a mesma estrutura:

- `notas.json` - Todas suas notas em JSON
- `txt/` - cada nota como `.txt` (dentro da pasta principal de backup)
- `pdf/` - cada nota como `.pdf`

## � Guia de Uso

### Importar PDF

1. Clique no menu **⋮** (três pontos)
2. Selecione **📥 Importar PDF**
3. Escolha um arquivo PDF no seu computador
4. O conteúdo será extraído e criada uma nova nota

### Alterar Tema

1. Clique no menu **⋮**
2. Selecione **🌙 Tema Escuro** ou **☀️ Tema Claro**
3. O tema é sempre salvado

### Atalhos Rápidos

- **Formatação**: `Ctrl+B`, `Ctrl+I`, `Ctrl+U`
- **Exportar**: `Ctrl+S` para salvar nota como .txt
- **Ajuda**: Clique em **❓ Atalhos** no menu

- **Tema**: All-black (#000000) com acentos ciano (#00d4ff) e violeta (#bb86fc)
- **Layout**: Sidebar (280px) + Editor principal responsivo
- **Animações**: Suaves e intuitivas
- **Otimizado para**: Desktop (1920x1080+)

## 💾 Armazenamento

- **localStorage** - Dados salvos localmente no navegador (instantâneo)
- **Pasta local** - Backup via servidor Node.js (adicional)

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Variáveis CSS, Flexbox, gradientes
- **JavaScript Vanilla** - Sem frameworks!
- **Node.js** - Servidor de sincronização (opcional)

## 📋 Estrutura de Arquivos

```
BLOCO DE NOTAS/
├── index.html          # Estrutura HTML
├── style.css           # Estilos CSS
├── script.js           # Lógica JavaScript
├── sync-server.js      # Servidor de sincronização (Node.js)
└── README.md          # Este arquivo
```

## 🔐 Privacidade

Todas suas notas são armazenadas **localmente**:

- No localStorage do navegador (automático)
- Em uma pasta local no seu PC (opcional com servidor)

**Nenhum dado é enviado para servidores externos!**

## 🐛 Troubleshooting

### Notas não aparecem após fechar o navegador

- Verificar se localStorage está habilitado
- Limpar cache do navegador e recarregar

### Servidor de sincronização não conecta

- Confirmar que Node.js está instalado: `node --version`
- Porta 3456 está disponível?
- Verifique firewall

### Importar PDF não funciona

- Converter PDF para .txt primeiro
- Copiar e colar o conteúdo diretamente

## 📞 Suporte

Para problemas, verifique:

1. Console do navegador (F12 > Console)
2. Terminal do servidor de sincronização

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

**Dica**: Use `Ctrl+S` para exportar sua nota atual como .txt
