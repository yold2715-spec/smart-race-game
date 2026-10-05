/* =========================================================
   SMART RACE - script.js
   ========================================================= */

/* ===== 1. PENGATURAN (edit di sini) ===== */
const GAME_NAME = "SMART RACE";            // nama game (ubah juga <title> & <h1> di index.html)
const TOTAL = 40;                          // jumlah petak
const COLS = 8;                            // petak per baris (TOTAL sebaiknya kelipatan COLS)
const MAX_PLAYERS = 4;                     // maksimal pemain (tambah warna di PLAYER_COLORS)
const PLAYER_COLORS = ["#e5383b", "#2f6fed", "#1f9d55", "#f2c200"];
const POINTS = { bonus: 10, risk: 10, challenge: 20, masterRight: 30, masterWrong: -10, firstFinish: 20 };
const SPECIAL = { 5: "BONUS", 8: "CHALLENGE", 12: "RISK", 18: "BONUS", 24: "MASTER", 30: "CHALLENGE", 35: "RISK" };

const CATS = {
  Science:    { n: "Sains",            i: "🔬" },
  Geography:  { n: "Geografi",         i: "🌍" },
  History:    { n: "Sejarah",          i: "🏛️" },
  Technology: { n: "Teknologi",        i: "💻" },
  Culture:    { n: "Budaya",           i: "🎭" },
  Civics:     { n: "Kewarganegaraan",  i: "⚖️" }
};
const CAT_KEYS = Object.keys(CATS);
const ICON = { START: "START", FINISH: "FINISH", BONUS: "🎁", RISK: "⚠️", CHALLENGE: "🔥", MASTER: "👑" };
const FACES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

/* ===== 2. BANK SOAL =====
   Format: [kategori, pertanyaan, [pilihan], indeksJawabanBenar(0-3), penjelasan, soalSulit(1 = untuk MASTER)]
   Tiap kategori sebaiknya punya minimal 2 soal biasa + 1 soal sulit. */
const RAW_QUESTIONS = [
  ["Science", "Planet terbesar dalam tata surya adalah?", ["Bumi", "Mars", "Jupiter", "Venus"], 2, "Jupiter adalah planet terbesar dalam tata surya."],
  ["Science", "Rumus kimia air adalah?", ["CO2", "H2O", "O2", "NaCl"], 1, "Air terdiri dari 2 atom hidrogen dan 1 atom oksigen (H2O)."],
  ["Science", "Gas terbanyak di atmosfer Bumi adalah?", ["Oksigen", "Nitrogen", "Karbon dioksida", "Hidrogen"], 1, "Nitrogen menyusun sekitar 78% atmosfer."],
  ["Science", "Organ yang memompa darah ke seluruh tubuh adalah?", ["Paru-paru", "Hati", "Jantung", "Ginjal"], 2, "Jantung memompa darah ke seluruh tubuh."],
  ["Science", "Satuan SI untuk gaya adalah?", ["Joule", "Newton", "Watt", "Pascal"], 1, "Gaya diukur dalam Newton (N).", 1],
  ["Geography", "Ibu kota Jepang adalah?", ["Osaka", "Tokyo", "Kyoto", "Hiroshima"], 1, "Tokyo adalah ibu kota Jepang."],
  ["Geography", "Sungai terpanjang di Indonesia adalah?", ["Kapuas", "Mahakam", "Musi", "Bengawan Solo"], 0, "Sungai Kapuas di Kalimantan Barat, panjangnya sekitar 1.143 km."],
  ["Geography", "Benua terluas di dunia adalah?", ["Afrika", "Amerika", "Asia", "Eropa"], 2, "Asia adalah benua terluas."],
  ["Geography", "Gunung tertinggi di dunia adalah?", ["K2", "Everest", "Kilimanjaro", "Fuji"], 1, "Everest memiliki ketinggian sekitar 8.849 m."],
  ["Geography", "Selat yang memisahkan Pulau Sumatra dan Semenanjung Malaya adalah?", ["Selat Sunda", "Selat Malaka", "Selat Makassar", "Selat Lombok"], 1, "Selat Malaka adalah jalur pelayaran penting dunia.", 1],
  ["History", "Proklamasi Kemerdekaan Indonesia dibacakan pada?", ["17 Agustus 1945", "20 Mei 1908", "28 Oktober 1928", "10 November 1945"], 0, "Proklamasi dibacakan Soekarno-Hatta pada 17 Agustus 1945."],
  ["History", "Presiden pertama Republik Indonesia adalah?", ["Soeharto", "Soekarno", "B.J. Habibie", "Moh. Hatta"], 1, "Soekarno adalah presiden pertama RI."],
  ["History", "Kerajaan Hindu tertua di Indonesia adalah?", ["Kutai", "Majapahit", "Sriwijaya", "Mataram"], 0, "Kerajaan Kutai di Kalimantan Timur, abad ke-4 M."],
  ["History", "Sumpah Pemuda diikrarkan pada tahun?", ["1908", "1928", "1945", "1966"], 1, "Sumpah Pemuda diikrarkan 28 Oktober 1928."],
  ["History", "Konferensi Asia-Afrika 1955 diselenggarakan di kota?", ["Bandung", "Jakarta", "Surabaya", "Yogyakarta"], 0, "KAA 1955 berlangsung di Bandung.", 1],
  ["Technology", "CPU merupakan singkatan dari?", ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing User"], 0, "CPU = Central Processing Unit, otak komputer."],
  ["Technology", "HTML adalah?", ["Bahasa pemrograman", "Bahasa markup", "Sistem operasi", "Basis data"], 1, "HTML (HyperText Markup Language) adalah bahasa markup untuk halaman web."],
  ["Technology", "Satu byte terdiri dari berapa bit?", ["4", "8", "16", "32"], 1, "1 byte = 8 bit."],
  ["Technology", "Protokol web yang aman (terenkripsi) adalah?", ["HTTP", "FTP", "HTTPS", "SMTP"], 2, "HTTPS menambahkan enkripsi pada HTTP."],
  ["Technology", "World Wide Web pertama kali diusulkan Tim Berners-Lee pada tahun?", ["1969", "1989", "1999", "2005"], 1, "Tim Berners-Lee mengusulkan WWW pada 1989.", 1],
  ["Culture", "Alat musik tradisional Jawa Barat dari bambu adalah?", ["Angklung", "Sasando", "Tifa", "Gamelan"], 0, "Angklung berasal dari Jawa Barat."],
  ["Culture", "Tari Saman berasal dari daerah?", ["Bali", "Aceh", "Papua", "Sumatra Barat"], 1, "Tari Saman berasal dari Aceh (suku Gayo)."],
  ["Culture", "Rumah adat Minangkabau disebut?", ["Joglo", "Rumah Gadang", "Honai", "Tongkonan"], 1, "Rumah Gadang adalah rumah adat Minangkabau."],
  ["Culture", "Candi Borobudur terletak di provinsi?", ["Jawa Tengah", "Jawa Timur", "Bali", "Sumatra Utara"], 0, "Borobudur ada di Magelang, Jawa Tengah."],
  ["Culture", "UNESCO menetapkan batik sebagai warisan budaya Indonesia pada tahun?", ["2003", "2009", "2012", "2015"], 1, "Batik diakui UNESCO pada 2 Oktober 2009.", 1],
  ["Civics", "Dasar negara Indonesia adalah?", ["UUD 1945", "Pancasila", "Bhinneka Tunggal Ika", "TAP MPR"], 1, "Pancasila adalah dasar negara."],
  ["Civics", "Sila ke-3 Pancasila berbunyi?", ["Ketuhanan Yang Maha Esa", "Persatuan Indonesia", "Kemanusiaan yang adil dan beradab", "Keadilan sosial"], 1, "Sila ke-3: Persatuan Indonesia."],
  ["Civics", "Lembaga yang membuat undang-undang bersama Presiden adalah?", ["DPR", "MA", "BPK", "KPK"], 0, "DPR membuat UU bersama Presiden."],
  ["Civics", "Usia minimal warga negara Indonesia untuk memilih dalam pemilu adalah?", ["17 tahun", "18 tahun", "19 tahun", "21 tahun"], 0, "Hak pilih dimiliki mulai usia 17 tahun (atau sudah menikah)."],
  ["Civics", "UUD 1945 telah diamandemen sebanyak?", ["2 kali", "3 kali", "4 kali", "5 kali"], 2, "UUD 1945 diamandemen 4 kali (1999-2002).", 1]
];
// Diubah ke bentuk object: {id, category, question, options, answer, explanation, points}
const QUESTIONS = RAW_QUESTIONS.map(([category, question, options, answer, explanation, hard], i) =>
  ({ id: i + 1, category, question, options, answer, explanation, hard: !!hard, points: hard ? POINTS.masterRight : 10 }));

const CHALLENGES = [
  "Sebutkan 3 provinsi di Indonesia.", "Sebutkan 3 negara di Asia Tenggara.",
  "Sebutkan 3 planet dalam tata surya.", "Sebutkan 3 alat musik tradisional Indonesia.",
  "Sebutkan 3 bahasa pemrograman."
];

/* ===== 3. DATA PEMAIN & STATE ===== */
class Player {
  constructor(name, color) {
    this.name = name; this.color = color; this.position = 1; this.score = 0;
    this.correctAnswers = 0; this.wrongAnswers = 0; this.finished = false;
    this.categoryStats = {};
    CAT_KEYS.forEach(k => this.categoryStats[k] = { right: 0, total: 0 });
  }
}
let game, selectedCount = 2;
const $ = id => document.getElementById(id);
const rnd = n => Math.floor(Math.random() * n);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const cur = () => game.players[game.turn];
const tileType = n => n === 1 ? "START" : n === TOTAL ? "FINISH" : (SPECIAL[n] || "QUIZ");
const tileCat = n => CAT_KEYS[n % CAT_KEYS.length];

/* ===== 4. SUARA (Web Audio, opsional) ===== */
let audio;
function beep(freq = 440, dur = 0.12) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq; g.gain.value = 0.08;
    o.connect(g); g.connect(audio.destination); o.start(); o.stop(audio.currentTime + dur);
  } catch (e) { /* audio tidak tersedia: game tetap jalan */ }
}

/* ===== 5. MENU & SETUP ===== */
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}
function openModal(html) { $("modalBody").innerHTML = html; $("modal").classList.remove("hidden"); }
function closeModal() { $("modal").classList.add("hidden"); }

function selectCount(n) {
  selectedCount = n;
  document.querySelectorAll(".count").forEach(b => b.classList.toggle("sel", +b.dataset.n === n));
  $("nameInputs").innerHTML = Array.from({ length: n }, (_, i) =>
    `<input maxlength="14" placeholder="Pemain ${i + 1}">`).join("");
}

function initGame() {
  resetGame();
  $("btnStart").onclick = () => { beep(); selectCount(selectedCount); show("setup"); };
  $("btnBack").onclick = () => show("menu");
  document.querySelectorAll(".count").forEach(b => b.onclick = () => selectCount(+b.dataset.n));
  $("btnGo").onclick = () => {
    const names = [...document.querySelectorAll("#nameInputs input")].map((e, i) => e.value.trim() || "Pemain " + (i + 1));
    startGame(names);
  };
  $("rollBtn").onclick = rollDice;
  $("btnHow").onclick = () => openModal(`<h2>Cara Bermain</h2><ol>
    <li>Pilih jumlah pemain.</li><li>Setiap pemain mendapatkan satu pion.</li>
    <li>Pemain melempar dadu.</li><li>Pion bergerak sesuai angka dadu.</li>
    <li>Pemain mendapatkan kartu berdasarkan petak.</li>
    <li>Jawab pertanyaan untuk mendapatkan poin.</li>
    <li>Capai FINISH dan kumpulkan skor tertinggi.</li></ol>
    <button class="btn primary" onclick="closeModal()">TUTUP</button>`);
  $("btnAbout").onclick = () => openModal(`<h2>Tentang Game</h2>
    <p>${GAME_NAME} adalah board game kuis pengetahuan umum untuk siswa SMA/SMK, dibuat dengan HTML, CSS, dan JavaScript.</p>
    <button class="btn primary" onclick="closeModal()">TUTUP</button>`);
  buildBoard();
}

function resetGame() {
  clearInterval(game && game.timer);
  game = { players: [], turn: 0, busy: false, answered: false, extra: false, firstFinish: false, used: [], q: null, mode: "", timer: null };
}

function startGame(names) {
  resetGame();
  game.players = names.slice(0, MAX_PLAYERS).map((n, i) => new Player(n, PLAYER_COLORS[i]));
  game.names = names;
  buildBoard(); renderPawns(); renderPanel(); show("game");
  $("dice").textContent = "🎲";
}
function restartGame() { closeModal(); startGame(game.names); }
function backToMenu() { closeModal(); resetGame(); show("menu"); }

/* ===== 6. BOARD & PANEL ===== */
function buildBoard() {
  const b = $("board"); b.innerHTML = "";
  b.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  for (let n = 1; n <= TOTAL; n++) {
    const i = n - 1, row = Math.floor(i / COLS);
    const col = row % 2 === 0 ? i % COLS : COLS - 1 - (i % COLS);   // jalur zig-zag
    const t = tileType(n), cat = tileCat(n), d = document.createElement("div");
    d.className = "tile " + (t === "START" || t === "FINISH" ? "edge" : cat + (t === "QUIZ" ? "" : " special"));
    d.id = "tile" + n; d.style.gridRow = row + 1; d.style.gridColumn = col + 1;
    d.innerHTML = `<span>${n}</span><small>${ICON[t] || CATS[cat].i}</small><div class="pawns"></div>`;
    b.appendChild(d);
  }
}
function renderPawns() {
  document.querySelectorAll(".pawns").forEach(e => e.innerHTML = "");
  game.players.forEach(p => {
    const s = document.createElement("span"); s.className = "pawn"; s.style.background = p.color;
    document.querySelector("#tile" + p.position + " .pawns").appendChild(s);
  });
}
function renderPanel() {
  if (!game.players.length) return;
  $("turn").textContent = "GILIRAN: " + cur().name.toUpperCase();
  $("rollBtn").disabled = game.busy;
  $("players").innerHTML = game.players.map((p, i) => `
    <div class="pl ${i === game.turn ? "active" : ""}">
      <b>● ${esc(p.name)}${p.finished ? " 🏁" : ""}</b>
      <span style="color:${p.color === "#f2c200" ? "#ffe066" : "#fff"}">Posisi: ${p.position}<br>⭐ ${p.score}</span>
    </div>`).join("");
  document.querySelectorAll(".pl b").forEach((e, i) => e.style.color = game.players[i].color === "#2f6fed" ? "#8db4ff" : game.players[i].color);
}

/* ===== 7. DADU & PERGERAKAN ===== */
function rollDice() {
  if (game.busy) return;
  game.busy = true; $("rollBtn").disabled = true; beep(300);
  const d = $("dice"); d.classList.add("roll"); let t = 0;
  const iv = setInterval(() => {
    d.textContent = FACES[rnd(6)];
    if (++t >= 8) {
      clearInterval(iv); d.classList.remove("roll");
      const n = rnd(6) + 1;                       // hasil acak 1-6
      d.textContent = FACES[n - 1];
      setTimeout(() => movePlayer(n), 400);
    }
  }, 80);
}
// Gerakkan pion satu petak demi satu petak (n negatif = mundur)
function moveBy(p, n, done) {
  const dir = n > 0 ? 1 : -1; let left = Math.abs(n);
  (function step() {
    if (left === 0 || (dir > 0 && p.position >= TOTAL) || (dir < 0 && p.position <= 1)) return done();
    p.position += dir; left--; renderPawns(); renderPanel(); beep(520, 0.05);
    setTimeout(step, 300);
  })();
}
function movePlayer(n) { moveBy(cur(), n, handleTile); }

/* ===== 8. EFEK PETAK ===== */
function drawQuestion(filter) {
  let list = QUESTIONS.filter(q => filter(q) && !game.used.includes(q.id));
  if (!list.length) {                              // semua sudah keluar: acak ulang
    const ids = QUESTIONS.filter(filter).map(q => q.id);
    game.used = game.used.filter(id => !ids.includes(id));
    list = QUESTIONS.filter(filter);
  }
  const q = list[rnd(list.length)]; game.used.push(q.id); return q;
}
function handleTile() {
  const p = cur(), n = p.position, t = tileType(n), cat = tileCat(n);
  if (n >= TOTAL) return checkFinish();
  if (t === "QUIZ") showQuestion(drawQuestion(q => q.category === cat && !q.hard), "quiz");
  else if (t === "RISK") showQuestion(drawQuestion(q => q.category === cat && !q.hard), "risk");
  else if (t === "MASTER") showQuestion(drawQuestion(q => q.hard), "master");
  else if (t === "BONUS") applyBonus();
  else if (t === "CHALLENGE") startChallenge();
  else nextTurn();
}

/* ===== 9. PERTANYAAN ===== */
function showQuestion(q, mode) {
  game.q = q; game.mode = mode; game.answered = false;
  const title = { quiz: "🧠 QUIZ", risk: "⚠️ RISK!", master: "👑 MASTER" }[mode];
  const hint = { quiz: "Jawab dengan benar untuk mendapat +" + q.points + " poin.",
    risk: "Jika salah, kamu mundur 2 petak. Jika benar +" + POINTS.risk + " poin.",
    master: "Soal sulit! Benar +" + POINTS.masterRight + ", salah " + POINTS.masterWrong + " poin." }[mode];
  openModal(`<span class="qhead ${q.category}">${CATS[q.category].i} ${CATS[q.category].n} · ${title}</span>
    <p class="q">${q.question}</p><p class="hint">${hint}</p>
    ${q.options.map((o, i) => `<button class="opt" onclick="checkAnswer(${i})"><b>${"ABCD"[i]}.</b> ${o}</button>`).join("")}`);
}
function checkAnswer(i) {
  if (game.answered) return;                       // tidak boleh menjawab dua kali
  game.answered = true;
  const q = game.q, m = game.mode, p = cur(), ok = i === q.answer;
  document.querySelectorAll(".opt").forEach((b, k) => {
    b.disabled = true;
    if (k === q.answer) b.classList.add("right"); else if (k === i) b.classList.add("wrong");
  });
  const st = p.categoryStats[q.category]; st.total++;
  if (ok) { p.correctAnswers++; st.right++; } else p.wrongAnswers++;
  const pts = ok ? (m === "risk" ? POINTS.risk : q.points) : (m === "master" ? POINTS.masterWrong : 0);
  addScore(p, pts); beep(ok ? 800 : 200, 0.25);
  setTimeout(() => showFeedback(ok, q, pts, m), 900);
}
function showFeedback(ok, q, pts, m) {
  const penalty = m === "risk" && !ok ? "<p><b>Kamu mundur 2 petak.</b></p>" : "";
  openModal(`<h2>${ok ? "🎉 BENAR!" : "❌ SALAH"}</h2>
    <div class="delta ${pts > 0 ? "plus" : pts < 0 ? "minus" : ""}">${pts > 0 ? "+" : ""}${pts} POIN</div>
    ${ok ? "" : `<p>Jawaban yang benar:<br><b>${"ABCD"[q.answer]}. ${q.options[q.answer]}</b></p>`}
    <p><b>Pembahasan:</b> ${q.explanation}</p>${penalty}
    <button class="btn primary" onclick="afterFeedback(${ok})">LANJUT</button>`);
}
function afterFeedback(ok) {
  closeModal();
  if (game.mode === "risk" && !ok) applyRisk(); else checkFinish();
}
function addScore(p, n) { p.score += n; renderPanel(); }

/* ===== 10. BONUS, RISK, CHALLENGE ===== */
function applyBonus() {
  const t = ["step", "points", "again"][rnd(3)];
  const txt = { step: "Kamu maju 2 petak.", points: "Kamu mendapat +" + POINTS.bonus + " poin.", again: "Kamu boleh melempar dadu sekali lagi." }[t];
  openModal(`<h2>🎁 BONUS!</h2><p>${txt}</p>
    <button class="btn primary" onclick="useBonus('${t}')">GUNAKAN BONUS</button>`);
}
function useBonus(t) {
  closeModal(); beep(900, 0.2); const p = cur();
  if (t === "step") moveBy(p, 2, checkFinish);
  else if (t === "points") { addScore(p, POINTS.bonus); nextTurn(); }
  else { game.extra = true; nextTurn(); }
}
function applyRisk() { moveBy(cur(), -2, checkFinish); }

function startChallenge() {
  let sec = 15;
  openModal(`<h2>🔥 CHALLENGE!</h2><p class="q">${CHALLENGES[rnd(CHALLENGES.length)]}</p>
    <p class="hint">Waktu 15 detik. Pemain lain menilai: berhasil atau gagal? (+${POINTS.challenge} poin jika berhasil)</p>
    <div class="timer" id="tm">${sec}</div>
    <button class="btn primary" onclick="endChallenge(true)">BERHASIL</button>
    <button class="btn" onclick="endChallenge(false)">GAGAL</button>`);
  game.timer = setInterval(() => { if (sec > 0) $("tm").textContent = --sec; }, 1000);
}
function endChallenge(ok) {
  clearInterval(game.timer);
  if (ok) { addScore(cur(), POINTS.challenge); beep(800, 0.25); } else beep(200, 0.25);
  nextTurn();
}

/* ===== 11. GILIRAN & FINISH ===== */
function checkFinish() {
  const p = cur();
  if (p.position >= TOTAL && !p.finished) {
    p.finished = true; let extra = "";
    if (!game.firstFinish) { game.firstFinish = true; addScore(p, POINTS.firstFinish); extra = `<p>Finisher pertama: +${POINTS.firstFinish} poin!</p>`; }
    beep(1000, 0.5);
    openModal(`<h2>🏆 FINISH!</h2><p>Selamat! ${esc(p.name)} berhasil mencapai FINISH.</p>${extra}
      <button class="btn primary" onclick="nextTurn()">LANJUT</button>`);
  } else nextTurn();
}
function nextTurn() {
  closeModal(); clearInterval(game.timer);
  if (game.players.every(p => p.finished)) return showResult();
  if (game.extra && !cur().finished) game.extra = false;     // lempar dadu lagi (bonus)
  else { game.extra = false; do { game.turn = (game.turn + 1) % game.players.length; } while (cur().finished); }
  game.busy = false; renderPanel();
}

/* ===== 12. HASIL AKHIR & HASIL BELAJAR ===== */
function showResult() {
  const rank = [...game.players].sort((a, b) => b.score - a.score), medal = ["🥇", "🥈", "🥉", "4."];
  openModal(`<h2>🏆 HASIL AKHIR</h2>
    ${rank.map((p, i) => `<p><b>${medal[i]} ${esc(p.name).toUpperCase()} — ${p.score} POIN</b></p>`).join("")}
    <p>SELAMAT KEPADA PEMENANG!</p>${showLearningResult()}
    <button class="btn primary" onclick="restartGame()">MAIN LAGI</button>
    <button class="btn" onclick="backToMenu()">KEMBALI KE MENU</button>`);
}
function showLearningResult() {
  let weakest = null, low = 101;
  const rows = CAT_KEYS.map(k => {
    const r = game.players.reduce((s, p) => s + p.categoryStats[k].right, 0);
    const t = game.players.reduce((s, p) => s + p.categoryStats[k].total, 0);
    const pct = t ? Math.round(r / t * 100) : null;
    if (pct !== null && pct < low) { low = pct; weakest = k; }
    return `<div class="${k}">${CATS[k].n}: <b>${pct === null ? "-" : pct + "%"}</b>
      <div class="bar"><i style="width:${pct || 0}%"></i></div></div>`;
  }).join("");
  return `<h3>HASIL BELAJAR</h3>${rows}${weakest
    ? `<p>Materi yang perlu kamu pelajari kembali:<br><b>${weakest.toUpperCase()}</b></p>` : ""}`;
}

document.addEventListener("DOMContentLoaded", initGame);
