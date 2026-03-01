# 🧪 Guia de Testes - Brain Dump v2.0

## Pré-requisitos

- Node.js instalado (para servidor)
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Arquivo PDF para teste (opcional)

---

## 🧪 Testes Manuais

### 1️⃣ PDF Import

#### Setup

```bash
# Nenhuma configuração necessária - PDF.js é carregado via CDN
```

#### Testes

- [ ] **Teste 1**: Abra a aplicação, clique em ⋮ Menu → 📥 Importar PDF
- [ ] **Teste 2**: Selecione um arquivo PDF válido
- [ ] **Teste 3**: Verifique se a nota foi criada com conteúdo do PDF
- [ ] **Teste 4**: Tente importar um arquivo não-PDF (deve exibir erro)
- [ ] **Teste 5**: Teste com PDF de múltiplas páginas
- [ ] **Teste 6**: Verifique se a categoria é "Estudos" por padrão

**Resultado Esperado**: ✅ Nota criada com conteúdo extraído do PDF

---

### 2️⃣ Sistema de Temas

#### Teste 1: Toggle Tema Escuro ↔ Claro

- [ ] Clique em ⋮ Menu → 🌙 Tema Escuro (ou ☀️ Tema Claro)
- [ ] Verifique se cores mudaram instantaneamente
- [ ] Recarregue a página (F5)
- [ ] Tema deve persistir

**Teste 2**: Verifique cores em Light Mode

- [ ] Texto escuro deve ser legível em fundo claro
- [ ] Acentos devem ser #0099cc e #9944dd
- [ ] Sidebar deve ser #fafafa

**Teste 3**: Verifique cores em Dark Mode

- [ ] Editor deve ser #000000
- [ ] Acentos devem ser #00d4ff e #bb86fc
- [ ] Transições devem ser suaves

**Resultado Esperado**: ✅ Tema persiste e cores são corretas

---

### 3️⃣ Atalhos de Teclado

#### Teste 1: Bold (Ctrl+B)

- [ ] Clique no editor de notas
- [ ] Selecione texto
- [ ] Pressione Ctrl+B
- [ ] Texto deve ficar em negrito

#### Teste 2: Italic (Ctrl+I)

- [ ] Clique no editor
- [ ] Selecione texto
- [ ] Pressione Ctrl+I
- [ ] Texto deve ficar em itálico

#### Teste 3: Underline (Ctrl+U)

- [ ] Clique no editor
- [ ] Selecione texto
- [ ] Pressione Ctrl+U
- [ ] Texto deve ficar sublinhado

#### Teste 4: Save as TXT (Ctrl+S)

- [ ] Clique em uma nota existente
- [ ] Pressione Ctrl+S
- [ ] Arquivo .txt deve fazer download
- [ ] Conteúdo do arquivo deve corresponder à nota

#### Teste 5: Mac (Cmd em vez de Ctrl)

- [ ] Em Mac, use Cmd+B, Cmd+I, Cmd+U, Cmd+S
- [ ] Deve funcionar igual

**Resultado Esperado**: ✅ Todos atalhos funcionam corretamente

---

### 4️⃣ Export PDF

#### Teste 1: Open Print Dialog

- [ ] Selecione uma nota
- [ ] Clique em ⋮ Menu → 📄 Exportar como PDF
- [ ] Diálogo de impressão deve abrir
- [ ] Conteúdo deve ser formatado com título, data, categoria

#### Teste 2: Save as PDF

- [ ] No diálogo de impressão, selecione "Salvar como PDF"
- [ ] Nomeie o arquivo e salve
- [ ] Verifique se o PDF contém todo o conteúdo

**Resultado Esperado**: ✅ PDF é gerado com formatação correta

---

### 5️⃣ Menu e Ajuda

#### Teste 1: Menu Dropdown

- [ ] Clique em ⋮
- [ ] Menu deve aparecer com opções
- [ ] Clique em um item e menu deve fechar
- [ ] Clique fora e menu deve fechar

#### Teste 2: Botão Ajuda

- [ ] Clique em ⋮ Menu → ❓ Atalhos
- [ ] Diálogo com atalhos deve aparecer
- [ ] Todas opções devem estar documentadas

**Resultado Esperado**: ✅ Menu funciona corretamente

---

## 🔄 Testes de Sincronização

### Setup

```bash
# Terminal 1: Servidor da aplicação
cd "c:\Users\USER\Desktop\BLOCO DE NOTAS"
node server.js

# Terminal 2: Servidor de sincronização
cd "c:\Users\USER\Desktop\BLOCO DE NOTAS"
node sync-server.js
```

### Testes

- [ ] Clique em ⋮ Menu → 🔄 Sincronizar pasta
- [ ] Mensagem deve exibir instruções
- [ ] Verifique se pasta `notas-backup` foi criada
- [ ] Arquivo `notas.json` deve conter todas as notas
- [ ] Pastas `txt/` e `pdf/` devem conter um arquivo de cada nota

**Resultado Esperado**: ✅ Sincronização funciona e pasta é criada

---

## 🌐 Testes de Navegador

### Firefox ✅

```bash
firefox http://localhost:8000
```

- [ ] PDF import funciona
- [ ] Temas funcionam
- [ ] Atalhos funcionam

### Chrome/Chromium ✅

```bash
chrome http://localhost:8000
```

- [ ] PDF import funciona
- [ ] Temas funcionam
- [ ] Atalhos funcionam

### Edge ✅

```bash
msedge http://localhost:8000
```

- [ ] Mesmo teste

### Safari (Mac) ✅

```bash
open -a Safari http://localhost:8000
```

- [ ] Atalhos Cmd funcionam
- [ ] Temas funcionam

---

## 🐛 Debug

### Abrir Console (F12)

```javascript
// Verificar tema atual
document.documentElement.classList.contains("light-mode");

// Forçar tema escuro
document.documentElement.classList.remove("light-mode");
localStorage.setItem("braindump_theme", "dark");

// Forçar tema claro
document.documentElement.classList.add("light-mode");
localStorage.setItem("braindump_theme", "light");

// Verificar notas
console.log(JSON.parse(localStorage.getItem("braindump_notes")));

// Limpar dados
localStorage.clear();
```

---

## ✅ Checklist de Release

- [ ] PDF Import funciona em todos navegadores
- [ ] Temas escuro/claro funcionam e persistem
- [ ] Todos atalhos funcionam (Windows + Mac)
- [ ] Export PDF abre com formatação
- [ ] Sincronização funciona
- [ ] Sem erros no console
- [ ] Sem memory leaks
- [ ] Performance aceitável
- [ ] Responsive em mobile (se aplicável)
- [ ] Documentação atualizada

---

## 🚀 Deploy Checklist

- [ ] README.md atualizado
- [ ] CHANGELOG.md criado
- [ ] TESTING.md criado
- [ ] features.html criado
- [ ] Todos arquivos .js, .css, .html validados
- [ ] Sem console errors
- [ ] Sem console warnings
- [ ] localStorage funciona
- [ ] PDF.js CDN acessível

---

## 📝 Notas de Teste

### Problemas Conhecidos

- Nenhum identificado no teste atual

### Navegadores Testados

- Windows: Chrome, Firefox, Edge
- Mac: Safari, Chrome

### Devices Testados

- Desktop 1920x1080
- Laptop 1366x768

---

**Última Atualização**: 28 de Fevereiro de 2026
**Versão Testada**: 2.0.0
