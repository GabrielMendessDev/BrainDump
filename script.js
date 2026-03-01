// Estado da Aplicação
const app = {
  notes: [],
  currentNoteId: null,
  currentCategory: "all",
  selectedNotes: new Set(),

  // Inicializar app
  init() {
    this.loadTheme();
    this.loadNotes();
    this.setupEventListeners();
    this.renderSidebar();
    this.updateStats();
    this.clearEditor();
  },

  // Carregar notas do localStorage
  loadNotes() {
    const stored = localStorage.getItem("braindump_notes");
    this.notes = stored ? JSON.parse(stored) : [];
  },

  // Salvar notas no localStorage
  saveNotes() {
    localStorage.setItem("braindump_notes", JSON.stringify(this.notes));
  },

  // Mobile sidebar helpers
  setupMobileSidebar() {
    const toggle = document.getElementById("sidebarToggle");
    const closeBtn = document.getElementById("sidebarClose");
    const overlay = document.getElementById("sidebarOverlay");

    if (toggle) {
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openSidebar();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeSidebar();
      });
    }

    if (overlay) {
      overlay.addEventListener("click", () => {
        this.closeSidebar();
      });
    }
  },

  openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle = document.getElementById("sidebarToggle");
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
    if (toggle) toggle.classList.add("hidden");
  },

  closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle = document.getElementById("sidebarToggle");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
    if (toggle) toggle.classList.remove("hidden");
  },

  isMobile() {
    return window.innerWidth <= 768;
  },

  // Configurar event listeners
  setupEventListeners() {
    // Mobile sidebar
    this.setupMobileSidebar();

    // Nova nota
    document.getElementById("btnNewNote").addEventListener("click", () => {
      this.createNewNote();
    });

    // Menu dropdown
    document.getElementById("btnMenu").addEventListener("click", (e) => {
      const menu = document.getElementById("dropdownMenu");
      menu.classList.toggle("active");
      e.stopPropagation();
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", () => {
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    // Botões do menu
    document.getElementById("btnImportTxt").addEventListener("click", () => {
      document.getElementById("importTxtFile").click();
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    document.getElementById("btnExportAll").addEventListener("click", () => {
      this.exportAllNotesAsTxt();
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    document.getElementById("btnExportPdf").addEventListener("click", () => {
      this.exportNoteAsPdf();
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    document.getElementById("btnSync").addEventListener("click", () => {
      this.showSyncMessage();
      document.getElementById("dropdownMenu").classList.remove("active");
    });
    document.getElementById("btnSyncSelected").addEventListener("click", () => {
      this.syncSelectedNotes();
      document.getElementById("dropdownMenu").classList.remove("active");
    });
    document
      .getElementById("btnDeleteSelected")
      .addEventListener("click", () => {
        this.deleteSelectedNotes();
        document.getElementById("dropdownMenu").classList.remove("active");
      });

    // Import PDF
    document.getElementById("btnImportPdf").addEventListener("click", () => {
      document.getElementById("importPdfFile").click();
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    document.getElementById("importPdfFile").addEventListener("change", (e) => {
      this.importPdfFile(e);
    });

    // Toggle Theme
    document.getElementById("btnToggleTheme").addEventListener("click", () => {
      this.toggleTheme();
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    // Botão de ajuda
    document.getElementById("btnHelp").addEventListener("click", () => {
      this.showHelp();
      document.getElementById("dropdownMenu").classList.remove("active");
    });

    // Atalhos de teclado
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            this.formatText("bold");
            break;
          case "i":
            e.preventDefault();
            this.formatText("italic");
            break;
          case "u":
            e.preventDefault();
            this.formatText("underline");
            break;
          case "s":
            e.preventDefault();
            this.exportNoteTxt(this.currentNoteId);
            break;
        }
      }
    });

    // Import txt file
    document.getElementById("importTxtFile").addEventListener("change", (e) => {
      this.importTxtFile(e);
    });

    // Editor inputs - auto-save
    document.getElementById("noteTitle").addEventListener("input", () => {
      if (this.currentNoteId) {
        const note = this.getNoteById(this.currentNoteId);
        if (note) {
          note.title = document.getElementById("noteTitle").value;
          note.updatedAt = new Date().toISOString();
          this.saveNotes();
          this.updateNoteInfo();
          this.renderSidebar();
        }
      }
    });

    document.getElementById("noteContent").addEventListener("input", () => {
      if (this.currentNoteId) {
        const note = this.getNoteById(this.currentNoteId);
        if (note) {
          note.content = document.getElementById("noteContent").innerHTML;
          note.updatedAt = new Date().toISOString();
          this.saveNotes();
          this.updateNoteInfo();
          this.renderSidebar();
        }
      }
    });

    document.getElementById("noteCategory").addEventListener("change", (e) => {
      if (this.currentNoteId) {
        const note = this.getNoteById(this.currentNoteId);
        if (note) {
          note.category = e.target.value;
          this.saveNotes();
          this.renderSidebar();
        }
      }
    });

    // Botões de ação
    document.getElementById("btnPin").addEventListener("click", () => {
      if (this.currentNoteId) {
        const note = this.getNoteById(this.currentNoteId);
        if (note) {
          note.pinned = !note.pinned;
          this.saveNotes();
          this.updatePinButton();
          this.renderSidebar();
        }
      }
    });

    document.getElementById("btnDelete").addEventListener("click", () => {
      if (this.currentNoteId && confirm("Deletar esta nota?")) {
        this.deleteNote(this.currentNoteId);
        this.clearEditor();
        this.renderSidebar();
      }
    });

    // Filtros
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentCategory = e.target.dataset.category;
        this.renderSidebar();
      });
    });

    // Search na sidebar
    document.getElementById("sidebarSearch").addEventListener("input", (e) => {
      this.filterSidebarNotes(e.target.value);
    });

    // Toolbar buttons
    document.getElementById("btnBold").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("bold");
    });

    document.getElementById("btnItalic").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("italic");
    });

    document.getElementById("btnUnderline").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("underline");
    });

    document.getElementById("btnH1").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("formatBlock", "<h1>");
    });

    document.getElementById("btnH2").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("formatBlock", "<h2>");
    });

    document.getElementById("btnUL").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("insertUnorderedList");
    });

    document.getElementById("btnOL").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("insertOrderedList");
    });

    document.getElementById("btnCode").addEventListener("click", (e) => {
      e.preventDefault();
      this.formatText("formatBlock", "<pre>");
    });
  },

  // Criar nova nota
  createNewNote() {
    const note = {
      id: Date.now(),
      title: "Nova nota",
      content: "",
      category: "ideias",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };
    this.notes.unshift(note);
    this.saveNotes();
    this.selectNote(note.id);
    if (this.isMobile()) {
      this.closeSidebar();
    }
  },

  // Selecionar nota
  selectNote(id) {
    this.currentNoteId = id;
    const note = this.getNoteById(id);
    if (note) {
      document.getElementById("noteTitle").value = note.title;
      document.getElementById("noteContent").innerHTML = note.content || "";
      document.getElementById("noteCategory").value = note.category;
      document.getElementById("emptyState").style.display = "none";
      document.querySelector(".editor-top-bar").style.display = "flex";
      document.querySelector(".editor-toolbar").style.display = "flex";
      document.querySelector(".editor-content").style.display = "flex";
      document.querySelector(".editor-footer").style.display = "flex";
      this.updateNoteInfo();
      this.updatePinButton();
      this.renderSidebar();
      // Close sidebar on mobile after selecting a note
      if (this.isMobile()) {
        this.closeSidebar();
      }
      setTimeout(() => document.getElementById("noteContent").focus(), 100);
    }
  },

  // Limpar editor
  clearEditor() {
    this.currentNoteId = null;
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").innerHTML = "";
    document.getElementById("emptyState").style.display = "flex";
    document.querySelector(".editor-top-bar").style.display = "none";
    document.querySelector(".editor-toolbar").style.display = "none";
    document.querySelector(".editor-content").style.display = "none";
    document.querySelector(".editor-footer").style.display = "none";
    this.renderSidebar();
  },

  // Deletar nota
  deleteNote(id) {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.saveNotes();
    this.vibrate();
  },

  // Obter nota por ID
  getNoteById(id) {
    return this.notes.find((note) => note.id === id);
  },

  // Renderizar sidebar com suporte a seleção
  renderSidebar() {
    const container = document.getElementById("notesSidebar");
    let notes = this.notes;

    // Filtrar por categoria
    if (this.currentCategory !== "all") {
      notes = notes.filter((note) => note.category === this.currentCategory);
    }

    // Separar fixadas
    const pinned = notes.filter((n) => n.pinned);
    const unpinned = notes.filter((n) => !n.pinned);
    const sorted = [...pinned, ...unpinned];

    if (sorted.length === 0) {
      container.innerHTML = '<div class="empty-notes">Nenhuma nota</div>';
      this.updateSelectionInfo();
      return;
    }

    container.innerHTML = "";
    sorted.forEach((note) => {
      const item = document.createElement("div");
      item.className = `note-item ${this.currentNoteId === note.id ? "active" : ""} ${note.pinned ? "pinned" : ""}`;
      item.dataset.id = note.id;

      // checkbox
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "note-checkbox";
      cb.dataset.id = note.id;
      cb.checked = this.selectedNotes.has(note.id);
      cb.addEventListener("change", (e) => {
        const id = Number(e.target.dataset.id);
        if (e.target.checked) this.selectedNotes.add(id);
        else this.selectedNotes.delete(id);
        this.updateSelectionInfo();
      });
      item.appendChild(cb);

      // create left wrapper for checkbox + title
      const left = document.createElement("div");
      left.className = "note-item-left";
      left.style.display = "flex";
      left.style.alignItems = "center";
      left.style.overflow = "hidden";

      const titleSpan = document.createElement("span");
      titleSpan.className = "note-item-title";
      titleSpan.textContent = note.title || "Sem título";
      left.appendChild(titleSpan);
      item.appendChild(left);

      // right wrapper for preview/time
      const right = document.createElement("div");
      right.className = "note-item-right";
      right.style.display = "flex";
      right.style.alignItems = "center";
      right.style.gap = "6px";

      const preview = document.createElement("span");
      preview.className = "note-item-preview";
      preview.textContent = (note.content || "").substring(0, 60);
      right.appendChild(preview);

      const time = document.createElement("span");
      time.className = "note-item-time";
      time.textContent = this.formatDate(new Date(note.updatedAt));
      right.appendChild(time);

      item.appendChild(right);

      item.addEventListener("click", (e) => {
        if (e.target.matches("input")) return; // clique no checkbox
        this.selectNote(parseInt(item.dataset.id));
      });

      container.appendChild(item);
    });

    this.updateSelectionInfo();
  },

  // Filtrar notas na sidebar
  filterSidebarNotes(query) {
    const container = document.getElementById("notesSidebar");
    const items = container.querySelectorAll(".note-item");
    const q = query.toLowerCase();

    items.forEach((item) => {
      const title = item
        .querySelector(".note-item-title")
        .textContent.toLowerCase();
      const preview = item
        .querySelector(".note-item-preview")
        .textContent.toLowerCase();
      const matches = title.includes(q) || preview.includes(q);
      item.style.display = matches ? "block" : "none";
    });
  },

  // Atualizar info da nota
  updateNoteInfo() {
    if (!this.currentNoteId) return;
    const note = this.getNoteById(this.currentNoteId);
    if (!note) return;

    const plainText = this.htmlToPlainText(note.title + " " + note.content);
    const wordCount = plainText.split(/\s+/).filter((w) => w).length;
    const timeStr = this.formatDate(new Date(note.updatedAt));

    document.getElementById("noteInfo").textContent =
      `${note.category} • ${wordCount} palavras`;
    document.getElementById("noteTime").textContent = timeStr;
  },

  // Atualizar botão pin
  updatePinButton() {
    if (!this.currentNoteId) return;
    const note = this.getNoteById(this.currentNoteId);
    const btn = document.getElementById("btnPin");
    if (note) {
      btn.innerHTML = note.pinned
        ? '<i class="fa-solid fa-thumbtack" style="color: var(--accent-alt)"></i>'
        : '<i class="fa-solid fa-thumbtack"></i>';
      btn.title = note.pinned ? "Desafixar" : "Fixar";
    }
  },

  // Atualizar estatísticas
  updateStats() {
    const totalNotes = this.notes.length;
    const totalWords = this.notes.reduce((sum, note) => {
      const plainText = this.htmlToPlainText(note.title + " " + note.content);
      return sum + plainText.split(/\s+/).filter((w) => w).length;
    }, 0);

    document.getElementById("totalNotesCount").textContent = totalNotes;
    document.getElementById("totalWordsCount").textContent = totalWords;
  },

  // Formatear data
  formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" });
  },

  // Escapar HTML
  escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  // Vibração
  vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  },

  // Formatação de texto
  formatText(command, value = null) {
    const editor = document.getElementById("noteContent");
    editor.focus();
    if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, null);
    }
    // Trigger input event para salvar
    editor.dispatchEvent(new Event("input", { bubbles: true }));
  },

  // Exportar nota como .txt
  exportNoteTxt(noteId) {
    const note = this.getNoteById(noteId);
    if (!note) return;

    const plainText = this.htmlToPlainText(note.content);
    const content = `${note.title}\n${"=".repeat(note.title.length)}\n\nCategoria: ${note.category}\nData: ${new Date(note.updatedAt).toLocaleString("pt-BR")}\n\n${plainText}`;
    const blob = new Blob([content], { type: "text/plain" });
    this.downloadBlob(blob, `${note.title || "nota"}.txt`);
  },

  // Exportar todas as notas como .txt
  exportAllNotesAsTxt() {
    if (this.notes.length === 0) {
      alert("Nenhuma nota para exportar!");
      return;
    }

    let allContent = "EXPORTAÇÃO COMPLETA - BRAIN DUMP\n";
    allContent += `Data: ${new Date().toLocaleString("pt-BR")}\n`;
    allContent += `Total de notas: ${this.notes.length}\n`;
    allContent += "=".repeat(50) + "\n\n";

    this.notes.forEach((note, index) => {
      const plainText = this.htmlToPlainText(note.content);
      allContent += `[${index + 1}] ${note.title}\n`;
      allContent += `Categoria: ${note.category} | Criada: ${new Date(note.createdAt).toLocaleDateString("pt-BR")}\n`;
      allContent += "-".repeat(40) + "\n";
      allContent += plainText + "\n\n";
    });

    const blob = new Blob([allContent], { type: "text/plain" });
    this.downloadBlob(blob, `braindump-${new Date().getTime()}.txt`);
  },

  // Importar arquivo .txt
  importTxtFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n");
      let title = lines[0] || "Nota Importada";
      const noteContent = lines.slice(1).join("\n").trim();

      const note = {
        id: Date.now(),
        title: title.replace(/^#+\s*/, ""),
        content: noteContent,
        category: "ideias",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
      };

      this.notes.unshift(note);
      this.saveNotes();
      this.selectNote(note.id);
      alert(`✅ Nota "${title}" importada com sucesso!`);
    };
    reader.readAsText(file);

    // Reset input
    event.target.value = "";
  },

  // Exportar como PDF
  exportNoteAsPdf() {
    if (!this.currentNoteId) {
      alert("Selecione uma nota para exportar!");
      return;
    }

    const note = this.getNoteById(this.currentNoteId);
    if (!note) return;

    // Criar uma janela com conteúdo formatado para imprimir
    const printWindow = window.open("", "_blank");
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${note.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 900px;
              margin: 40px auto;
              color: #333;
              line-height: 1.6;
            }
            h1 {
              color: #0099cc;
              border-bottom: 2px solid #0099cc;
              padding-bottom: 10px;
            }
            .meta {
              color: #666;
              font-size: 12px;
              margin-bottom: 20px;
            }
            .content {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="meta">
            <p>Categoria: ${note.category} | Data: ${new Date(note.updatedAt).toLocaleString("pt-BR")}</p>
          </div>
          <div class="content">${this.htmlToPlainText(note.content)}</div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },

  // Mostrar mensagem de sincronização (seleção de pasta + escrita local)
  // se "notes" for passado, sincroniza apenas esse array, caso contrário todas
  async showSyncMessage(notes) {
    // usar novo File System Access API sempre que disponível
    if (window.showDirectoryPicker) {
      try {
        const dirHandle = await window.showDirectoryPicker();
        // salvar notas na pasta escolhida
        await this.saveNotesToDirectory(dirHandle, notes);
        showModal(
          `✅ Pasta selecionada e sincronização concluída!\n\nDentro dela há:\n` +
            `• pasta "txt" com os arquivos .txt de cada nota\n` +
            `• pasta "pdf" com os arquivos .pdf de cada nota\n\n` +
            `Você pode repetir este passo sempre que quiser atualizar os arquivos.`,
        );
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    } else {
      // fallback antigo com instruções se API não for suportada
      showModal(
        `🔄 SINCRONIZAÇÃO\n\nSeu navegador não suporta seleção de pastas via API.\n` +
          `Abra o terminal e execute:\n` +
          `node sync-server.js\n` +
          `Ao rodar o servidor, ele pedirá o caminho da pasta onde salvará as notas.`,
      );
    }
  },

  // Salvar notas diretamente em um diretório escolhido pelo usuário
  async saveNotesToDirectory(dirHandle, notesArray) {
    const notes = notesArray || this.notes;
    try {
      // anterior escrevíamos notas.json aqui, mas agora apenas TXT/PDF

      // criar subpastas txt e pdf
      const txtDir = await dirHandle.getDirectoryHandle("txt", {
        create: true,
      });
      const pdfDir = await dirHandle.getDirectoryHandle("pdf", {
        create: true,
      });

      for (const note of notes) {
        const safeName = note.title
          .replace(/[^a-z0-9]/gi, "_")
          .replace(/_+/g, "_")
          .toLowerCase()
          .slice(0, 50);
        // --- texto simples ---
        const txtFilename = `${safeName}_${note.id}.txt`;
        const noteFileHandle = await txtDir.getFileHandle(txtFilename, {
          create: true,
        });
        let noteWritable = await noteFileHandle.createWritable();
        const plain = this.htmlToPlainText(note.content);
        const content = `${note.title}\n${"=".repeat(
          Math.min(note.title.length, 50),
        )}\n\nCategoria: ${note.category}\nData: ${new Date(
          note.updatedAt,
        ).toLocaleString("pt-BR")}\n\n${plain}`;
        await noteWritable.write(content);
        await noteWritable.close();

        // --- PDF usando jsPDF ---
        try {
          const { jsPDF } = window.jspdf || window;
          const doc = new jsPDF();
          doc.setFontSize(16);
          doc.text(note.title, 10, 10);
          doc.setFontSize(10);
          doc.text(
            `Categoria: ${note.category} | Data: ${new Date(
              note.updatedAt,
            ).toLocaleString("pt-BR")}`,
            10,
            20,
          );
          doc.setFontSize(12);
          const lines = doc.splitTextToSize(plain, 180);
          doc.text(lines, 10, 30);
          const pdfBlob = doc.output("blob");

          const pdfFilename = `${safeName}_${note.id}.pdf`;
          const pdfHandle = await pdfDir.getFileHandle(pdfFilename, {
            create: true,
          });
          const pdfWritable = await pdfHandle.createWritable();
          await pdfWritable.write(pdfBlob);
          await pdfWritable.close();
        } catch (pdfErr) {
          console.error("Erro ao gerar PDF:", pdfErr);
        }
      }
    } catch (err) {
      console.error("Erro ao salvar notas no diretório:", err);
    }
  },

  // Atualiza contador de seleção na UI
  updateSelectionInfo() {
    const count = this.selectedNotes.size;
    const info = document.getElementById("selectionInfo");
    const span = document.getElementById("selectedCount");
    if (count > 0) {
      span.textContent = count;
      info.style.display = "block";
    } else {
      info.style.display = "none";
    }
  },

  // Retorna array de notas selecionadas
  getSelectedNotes() {
    return this.notes.filter((n) => this.selectedNotes.has(n.id));
  },

  // Sincroniza apenas as notas marcadas
  syncSelectedNotes() {
    const selected = this.getSelectedNotes();
    if (selected.length === 0) {
      alert("Selecione pelo menos uma nota para sincronizar.");
      return;
    }
    this.showSyncMessage(selected);
  },

  // Exclui notas marcadas
  deleteSelectedNotes() {
    const selected = this.getSelectedNotes();
    if (selected.length === 0) {
      alert("Marque pelo menos uma nota para excluir.");
      return;
    }
    if (confirm(`Deletar ${selected.length} nota(s)?`)) {
      this.notes = this.notes.filter((n) => !this.selectedNotes.has(n.id));
      this.selectedNotes.clear();
      this.saveNotes();
      this.renderSidebar();
      this.updateSelectionInfo();
      this.clearEditor();
    }
  },

  // Converter HTML para texto plano
  htmlToPlainText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  },

  // Download blob
  downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Carregar tema do localStorage
  loadTheme() {
    const savedTheme = localStorage.getItem("braindump_theme");
    const isDark = savedTheme === "dark" || !savedTheme;

    if (isDark) {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("braindump_theme", "dark");
    } else {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("braindump_theme", "light");
    }

    this.updateThemeButton();
  },

  // Alternar tema
  toggleTheme() {
    const isDark = !document.documentElement.classList.contains("light-mode");

    if (isDark) {
      document.documentElement.classList.add("light-mode");
      localStorage.setItem("braindump_theme", "light");
    } else {
      document.documentElement.classList.remove("light-mode");
      localStorage.setItem("braindump_theme", "dark");
    }

    this.updateThemeButton();
  },

  // Atualizar texto do botão de tema
  updateThemeButton() {
    const icon = document.getElementById("themeIcon");
    const label = document.getElementById("themeLabel");
    const isDark = !document.documentElement.classList.contains("light-mode");
    if (icon && label) {
      icon.className = isDark
        ? "fa-solid fa-sun fa-fw"
        : "fa-solid fa-moon fa-fw";
      label.textContent = isDark ? "Tema Claro" : "Tema Escuro";
    }
  },

  // Importar PDF
  async importPdfFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(pdfData).promise;

        let allText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          allText += pageText + "\n";
        }

        // Usar primeiro parágrafo como título
        const lines = allText.split("\n").filter((line) => line.trim());
        const title = lines[0]?.substring(0, 50) || "Nota Importada de PDF";
        const content = allText.trim();

        const note = {
          id: Date.now(),
          title: title,
          content: content,
          category: "estudos",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pinned: false,
        };

        this.notes.unshift(note);
        this.saveNotes();
        this.selectNote(note.id);
        alert(
          `✅ PDF importado com sucesso!\n\n"${title}"\n(${pdf.numPages} página(s))`,
        );
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Erro ao importar PDF:", error);
      alert("❌ Erro ao importar PDF: " + error.message);
    }

    // Reset input
    event.target.value = "";
  },

  // Mostrar ajuda
  showHelp() {
    alert(
      `⌨️ ATALHOS DE TECLADO\n\n` +
        `Formatação:\n` +
        `  Ctrl+B  →  Negrito\n` +
        `  Ctrl+I  →  Itálico\n` +
        `  Ctrl+U  →  Sublinhado\n\n` +
        `Arquivo:\n` +
        `  Ctrl+S  →  Exportar nota como .txt\n\n` +
        `Menu:\n` +
        `  ⋮  →  Import/Export/Temas\n\n` +
        `Dicas:\n` +
        `  • Use o menu (⋮) para importar PDF\n` +
        `  • Clique em "Imprimir" para exportar PDF\n` +
        `  • Sincronize com: node sync-server.js`,
    );
  },
};

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  app.init();
});
