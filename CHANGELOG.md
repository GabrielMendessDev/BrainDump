# Changelog - Brain Dump

## [2.0.0] - 28 de Fevereiro de 2026

### ✨ Novas Funcionalidades

#### PDF Import 📥

- **Integração PDF.js**: Parse automático de arquivos PDF
- Extração de conteúdo de múltiplas páginas
- Criação de nota com conteúdo extraído
- Validação e tratamento de erros

#### Sistema de Temas 🎨

- **Tema Escuro** (padrão): Design all-black com acentos
- **Tema Claro**: Interface limpa e legível
- Transições suaves entre temas
- Persistência em localStorage
- Botão toggle no menu (⋮)

#### Atalhos de Teclado ⌨️

- `Ctrl+B` → Aplicar negrito
- `Ctrl+I` → Aplicar itálico
- `Ctrl+U` → Aplicar sublinhado
- `Ctrl+S` → Exportar nota como .txt
- Suporte para Mac (`Cmd` funciona como `Ctrl`)

#### Melhorias em Export

- **PDF Export**: Agora abre com formatação adequada
- Diálogo de impressão automático
- Metadados inclusos (categoria, data)
- Compatibilidade com todos os navegadores

#### Menu de Ajuda 📚

- Botão **❓ Atalhos** no menu
- Exibe todos os atalhos disponíveis
- Dicas de uso e sincronização

### 🔧 Melhorias Técnicas

- **PDF.js CDN**: Carregamento de biblioteca de parsing de PDF
- **CSS Variables**: Sistema de cores dinâmico para temas
- **Async/Await**: Processamento assíncrono de PDFs
- **Event Listeners**: Gerenciamento melhorado de eventos

### 📝 Arquivos Modificados

```
index.html
  ├─ Adicionada biblioteca PDF.js
  ├─ Novo input para importar PDF
  ├─ Novo botão "📥 Importar PDF" no menu
  ├─ Novo botão "🌙 Tema Escuro" no menu
  └─ Novo botão "❓ Atalhos" no menu

script.js
  ├─ Nova função: loadTheme()
  ├─ Nova função: toggleTheme()
  ├─ Nova função: updateThemeButton()
  ├─ Nova função: importPdfFile()
  ├─ Nova função: showHelp()
  ├─ Melhorado: exportNoteAsPdf() com formatação
  ├─ Adicionados listeners para atalhos de teclado
  └─ Adicionados listeners para PDF import

style.css
  ├─ Variáveis CSS para light mode
  ├─ :root.light-mode para tema claro
  ├─ Transições suaves de cor
  └─ Estilos melhorados para readabilidade

README.md
  ├─ Documentação de PDF import
  ├─ Documentação de temas
  ├─ Guia de atalhos de teclado
  └─ Seção "Guia de Uso"

CHANGELOG.md (novo)
  └─ Este arquivo
```

### 🐛 Bugs Corrigidos

- Melhor tratamento de erros em PDF

### 🚀 Performance

- Carregamento de PDF.js via CDN (sem dependência local)
- Transições CSS para suavidade

### 🔐 Privacidade & Segurança

- PDF parsing acontece localmente no navegador
- Nenhum arquivo é enviado para servidores externos
- Tema é armazenado apenas no localStorage

### 📦 Dependências Adicionadas

- **PDF.js (3.11.174)** via CDNJS - Para parsing de PDFs

### ✅ Testado Em

- Chrome/Chromium (v90+)
- Firefox (v88+)
- Edge (v90+)
- Safari (v14+)

---

## [1.0.0] - 28 de Fevereiro de 2026

### Inicial Release ✨

#### Core Features

- ✅ Criação, edição e exclusão de notas
- ✅ 3 Categorias (Ideias, Estudos, Trabalho)
- ✅ Auto-save em tempo real
- ✅ Busca de notas
- ✅ Afixar notas
- ✅ Estatísticas (notas e palavras)

#### Editor Rico

- ✅ Negrito, Itálico, Sublinhado
- ✅ Títulos H1 e H2
- ✅ Listas com bullets e numeradas
- ✅ Blocos de código

#### Import/Export

- ✅ Importar .txt
- ✅ Exportar .txt individual
- ✅ Exportar todas as notas

#### Sincronização

- ✅ Servidor Node.js de sincronização
- ✅ Backup automático em pasta local
- ✅ Exportação de notas como .txt

#### Design

- ✅ Design all-black (#000000)
- ✅ Acentos ciano (#00d4ff) e violeta (#bb86fc)
- ✅ Layout sidebar + editor
- ✅ Animações suaves
- ✅ Responsividade

---

## 🔮 Futuro (Roadmap)

### v2.1.0 - Cloud Sync

- [ ] Integração Google Drive
- [ ] Integração OneDrive
- [ ] Sincronização automática na nuvem

### v3.0.0 - Colaboração

- [ ] Compartilhar notas
- [ ] Comentários
- [ ] Controle de acesso

### v3.1.0 - Extensões

- [ ] API de plugins
- [ ] Temas customizáveis
- [ ] Extensões de teclado

---

## 📞 Suporte

Para reportar bugs ou sugerir features, verifique a seção Troubleshooting no README.md
