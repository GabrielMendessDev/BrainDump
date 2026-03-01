/**
 * Brain Dump - Sync Server
 * Sincroniza notas do localStorage com uma pasta local
 *
 * Uso: node sync-server.js
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const readline = require("readline");

// Configurações
const PORT = 3456;

// variáveis definidas dinamicamente
let BACKUP_DIR;
let NOTES_FILE;

// Função para solicitar o diretório ao usuário
function askUserForBackupDir() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "📂 Por favor, insira o caminho do diretório de backup: ",
      (answer) => {
        rl.close();
        resolve(answer.trim());
      },
    );
  });
}

// Criar diretório de backup se não existir
function ensureBackupDir() {
  if (!BACKUP_DIR) return;
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log("✅ Diretório criado: " + BACKUP_DIR);
  }
}

// Salvar notas em arquivo
function saveNotesToFile(notes) {
  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), "utf8");
    console.log(`✅ ${notes.length} nota(s) salva(s) em: ${NOTES_FILE}`);
    return true;
  } catch (err) {
    console.error("❌ Erro ao salvar notas:", err.message);
    return false;
  }
}

// Carregar notas do arquivo
function loadNotesFromFile() {
  try {
    if (fs.existsSync(NOTES_FILE)) {
      const data = fs.readFileSync(NOTES_FILE, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error("❌ Erro ao carregar notas:", err.message);
    return [];
  }
}

// Exportar notas para subpastas txt e pdf
const PDFDocument = require("pdfkit");
function exportNotes(notes) {
  const txtDir = path.join(BACKUP_DIR, "txt");
  const pdfDir = path.join(BACKUP_DIR, "pdf");
  if (!fs.existsSync(txtDir)) {
    fs.mkdirSync(txtDir, { recursive: true });
  }
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  notes.forEach((note) => {
    const baseName = `${sanitizeFilename(note.title)}_${note.id}`;
    const plainText = stripHtml(note.content);
    const textContent = `${note.title}\n${"=".repeat(
      Math.min(note.title.length, 50),
    )}\n\nCategoria: ${note.category}\nData: ${new Date(
      note.updatedAt,
    ).toLocaleString("pt-BR")}\n\n${plainText}`;

    // arquivo .txt
    const txtPath = path.join(txtDir, baseName + ".txt");
    fs.writeFileSync(txtPath, textContent, "utf8");

    // gerar PDF
    const pdfPath = path.join(pdfDir, baseName + ".pdf");
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.fontSize(16).text(note.title);
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        `Categoria: ${note.category} | Data: ${new Date(
          note.updatedAt,
        ).toLocaleString("pt-BR")}`,
      );
    doc.moveDown();
    doc.fontSize(12).text(plainText);
    doc.end();
  });

  console.log(
    `✅ ${notes.length} nota(s) exportada(s) como .txt e .pdf em: ${txtDir} & ${pdfDir}`,
  );
}

// Sanitizar nome de arquivo
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, "_")
    .replace(/_+/g, "_")
    .toLowerCase()
    .slice(0, 50);
}

// Remover tags HTML
function stripHtml(html) {
  if (typeof document === "undefined") {
    // Node.js - fazer parsing simples sem DOM
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Criar servidor HTTP para receber dados
function createServer() {
  const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method === "POST" && req.url === "/sync") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const notes = JSON.parse(body);
          if (Array.isArray(notes)) {
            saveNotesToFile(notes);
            exportNotes(notes);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ success: true, message: "Notas sincronizadas" }),
            );
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ success: false, error: "Dados inválidos" }),
            );
          }
        } catch (err) {
          console.error("Erro:", err.message);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, error: err.message }));
        }
      });
    } else if (req.method === "GET" && req.url === "/status") {
      const notes = loadNotesFromFile();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "online",
          backup_dir: BACKUP_DIR,
          notes_count: notes.length,
          timestamp: new Date().toISOString(),
        }),
      );
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint não encontrado" }));
    }
  });

  return server;
}

// Main
async function main() {
  console.log("📝 Brain Dump - Servidor de Sincronização");
  console.log("========================================\n");

  // obter caminho via argumento ou perguntando ao usuário
  const argPath = process.argv[2];
  if (argPath) {
    BACKUP_DIR = path.resolve(argPath);
  } else {
    const userBackupDir = await askUserForBackupDir();
    BACKUP_DIR = path.resolve(userBackupDir);
  }
  NOTES_FILE = path.join(BACKUP_DIR, "notas.json");

  ensureBackupDir();

  const server = createServer();
  server.listen(PORT, () => {
    console.log(`\n🚀 Servidor rodando em: http://localhost:${PORT}`);
    console.log(`💾 Backup em: ${BACKUP_DIR}`);
    console.log(`\n📤 Para sincronizar manualmente:\n`);
    console.log(`   POST http://localhost:${PORT}/sync`);
    console.log(`   Envie: JSON array com as notas\n`);
    console.log(`✔️  Servidor conectado! Pressione Ctrl+C para parar.\n`);
  });

  // Carregar notas existentes
  const existingNotes = loadNotesFromFile();
  if (existingNotes.length > 0) {
    console.log(`📋 ${existingNotes.length} nota(s) carregada(s) do arquivo!`);
  }
}

main();
