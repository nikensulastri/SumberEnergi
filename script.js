// --- NAVIGATION ---
function navigate(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Remove active class from nav links
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    document.getElementById('nav-' + pageId).classList.add('active');

    // Init specific logic if needed
    if(pageId === 'menu4' && currentQuestion === 0) initQuiz();
    if(pageId === 'menu5' && budget === 10000 && power === 0) initGame();
}

// --- MENU 2: STORYTELLING ---
function nextStory(id) {
    document.querySelectorAll('.story-card').forEach(card => card.classList.add('hidden'));
    document.getElementById('story' + id).classList.remove('hidden');
}

function showInfo(type) {
    const infoBox = document.getElementById('info-box');
    const infoText = document.getElementById('info-text');
    infoBox.classList.remove('info-hidden');
    infoBox.classList.add('info-visible');
    
    if (type === 'tak-terbarukan') {
        infoText.innerHTML = "<strong>Fossil Fuels!</strong> Batu bara, minyak bumi, dan gas alam. Ini andalan kita sekarang, tapi butuh jutaan tahun buat bikinnya! Kalau habis, ya udah <em>game over</em>. Plus, asep karbonnya bikin bumi makin gerah (Global Warming). 🥵";
        infoBox.style.borderLeftColor = "var(--warning)";
    } else {
        infoText.innerHTML = "<strong>Renewable Energy!</strong> Sinar matahari, angin, air, panas bumi. Sumbernya <em>unlimited</em> alias nggak abis-abis! Bersih, ramah lingkungan, dan pastinya bikin bumi lebih <em>smile</em>. 🌍✨";
        infoBox.style.borderLeftColor = "var(--neon-green)";
    }
}

// --- MENU 3: VIRTUAL LAB ---
let isPanelInstalled = false;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    if(data === 'panel' && ev.target.id === 'roof') {
        ev.target.innerHTML = "⬛ Panel Surya Terpasang";
        ev.target.style.background = "#1e293b";
        ev.target.style.borderStyle = "solid";
        document.getElementById('panel').style.display = "none";
        isPanelInstalled = true;
        updateLab();
    }
}

function updateLab() {
    const weather = parseInt(document.getElementById('weather-slider').value);
    const lamp = document.getElementById('check-lamp').checked;
    const tv = document.getElementById('check-tv').checked;
    const ac = document.getElementById('check-ac').checked;

    // Visuals
    const sky = document.getElementById('lab-sky');
    if(weather < 4) sky.innerHTML = "☁️";
    else if(weather < 7) sky.innerHTML = "⛅";
    else sky.innerHTML = "☀️";

    // Power Generation
    let powerGen = 0;
    if (isPanelInstalled) {
        powerGen = weather * 100; // max 1000W
    }
    document.getElementById('power-gen').innerText = powerGen;

    // Power Usage
    let powerUse = 0;
    if(lamp) powerUse += 50;
    if(tv) powerUse += 150;
    if(ac) powerUse += 800;
    document.getElementById('power-use').innerText = powerUse;

    // Devices Visual
    document.getElementById('lamp').className = lamp ? "device on" : "device off";
    document.getElementById('tv').className = tv ? "device on" : "device off";
    document.getElementById('ac').className = ac ? "device on" : "device off";

    // Battery Logic
    let netPower = powerGen - powerUse;
    let battWidth = 50; // base
    let feedback = "";
    const batteryLevel = document.getElementById('battery-level');

    if (netPower > 0) {
        battWidth = Math.min(100, 50 + (netPower/20));
        batteryLevel.style.background = "var(--neon-green)";
        feedback = "Awesome! 🌟 Produksi energimu surplus. Disimpan di baterai!";
    } else if (netPower < 0) {
        battWidth = Math.max(0, 50 + (netPower/20));
        if (battWidth === 0) {
            batteryLevel.style.background = "var(--danger)";
            feedback = "Oops! Blackout! ⚡ Listrik tekor!";
            // Auto turn off
            document.getElementById('lamp').className = "device off";
            document.getElementById('tv').className = "device off";
            document.getElementById('ac').className = "device off";
        } else {
            batteryLevel.style.background = "var(--warning)";
            feedback = "Awas, energi yang dipakai lebih besar dari produksi!";
        }
    } else {
        feedback = "Seimbang. Produksi = Konsumsi.";
        batteryLevel.style.background = "var(--cyan)";
    }

    batteryLevel.style.width = battWidth + "%";
    document.getElementById('batt-text').innerText = Math.round(battWidth);
    document.getElementById('lab-feedback').innerText = feedback;
    if(!isPanelInstalled) document.getElementById('lab-feedback').innerText = "Pasang panel surya dulu ya!";
}


// --- MENU 4: KUIS ---
const questions = [
    {
        q: "Di sebuah desa pesisir yang sering dilanda angin kencang namun jauh dari aliran sungai deras, pemerintah ingin membangun pembangkit listrik yang jejak karbonnya paling minim. Solusi yang paling logis adalah...",
        options: ["Pembangkit Listrik Tenaga Mikrohidro (PLTMH)", "Pembangkit Listrik Tenaga Bayu/Angin (PLTB)", "Pembangkit Listrik Tenaga Uap Batu Bara (PLTU)", "Pembangkit Listrik Tenaga Diesel (PLTD)"],
        ans: 1,
        feedbackCorrect: "Boom! Tepat sekali! 💨 Desa pesisir punya angin kencang yang konsisten. Tenaga bayu adalah pilihan paling logis, efisien, dan bersih. Jejak karbonnya hampir nol!",
        feedbackWrong: "Waduh, meleset! Perhatikan clue-nya: 'angin kencang' dan 'jauh dari sungai'. Mikrohidro butuh air deras, sedangkan PLTU dan Diesel ngeluarin banyak polusi karbon."
    },
    {
        q: "Mobil listrik diklaim sebagai kendaraan 'zero emission'. Namun, jika dianalisis menggunakan Life Cycle Assessment di Indonesia saat ini, klaim tersebut bisa diperdebatkan karena...",
        options: ["Baterai mobil listrik tidak bisa didaur ulang sama sekali.", "Mobil listrik diam-diam masih memiliki knalpot yang disembunyikan.", "Sumber listrik untuk mengecas mobil di Indonesia masih didominasi pembakaran batu bara.", "Biaya pajak mobil listrik masih lebih mahal dibanding mobil bensin."],
        ans: 2,
        feedbackCorrect: "Brilliant! 🧠 Mobilnya memang nggak keluar asap, tapi 'colokan' listriknya sebagian besar masih bersumber dari PLTU Batu Bara. Jadi emisinya 'pindah' ke area pembangkit.",
        feedbackWrong: "Kurang tajam analisanya nih! Coba ingat-ingat, dari mana asal listrik yang ngalir di stop kontak rumah kita buat ngecas mobilnya? Sebagian besar masih dari pembakaran batu bara lho."
    },
    {
        q: "Keluarga Budi tinggal di perumahan padat penduduk Jakarta. Mereka ingin membantu transisi energi bersih tapi sama sekali tidak punya halaman atau sisa lahan. Langkah paling efektif yang bisa direkomendasikan adalah...",
        options: ["Membangun kincir angin besar di teras rumah.", "Mengganti sistem listrik rumah menjadi sistem Panel Surya Atap (Rooftop Solar).", "Membuat reaktor biogas dari sisa makanan di ruang tamu.", "Menunggu pemerintah membagikan listrik gratis."],
        ans: 1,
        feedbackCorrect: "Mantap! ☀️ Rooftop Solar adalah hack paling jitu buat di perkotaan padat. Memanfaatkan ruang kosong di atap rumah untuk menangkap cuaca Jakarta yang panas!",
        feedbackWrong: "Idenya kreatif sih, tapi kurang realistis! Coba pikirkan ruang apa yang biasanya nganggur dan langsung kena sinar matahari di perumahan padat? Ya, atap rumah!"
    },
    {
        q: "Lampu pijar 100W mengubah 10% energinya jadi cahaya, sisanya panas. Lampu LED 15W menghasilkan terang yang sama, namun 80% diubah jadi cahaya. Kesimpulannya?",
        options: ["Lampu pijar lebih efisien karena dayanya lebih besar.", "Keduanya sama efisien karena tingkat terangnya sama.", "Lampu LED memiliki efisiensi transformasi energi yang jauh lebih tinggi.", "Lampu pijar cocok digunakan untuk menghemat tagihan listrik."],
        ans: 2,
        feedbackCorrect: "Smart! 💡 Lampu LED itu juara efisiensi. Dia nggak butuh listrik gede (cuma 15W) karena fokus mengubah energi jadi cahaya, bukan kebuang jadi panas.",
        feedbackWrong: "Eits, hati-hati! Daya (Watt) besar bukan berarti bagus lho. Lampu pijar malah membuang 90% energi listriknya jadi panas sia-sia."
    },
    {
        q: "Transisi ke kendaraan listrik dunia membuat permintaan nikel meningkat. Dampak negatif EKOLOGIS yang paling mengancam jika tidak diatur adalah...",
        options: ["Harga nikel dunia menjadi sangat fluktuatif.", "Deforestasi (penggundulan hutan) dan pencemaran perairan di sekitar area tambang.", "Penurunan pendapatan negara dari sektor migas.", "Berkurangnya polusi suara di jalan raya ibu kota."],
        ans: 1,
        feedbackCorrect: "Kritis banget! 🌿 Betul, transisi energi juga punya dilema. Penambangan nikel yang masif bisa merusak hutan dan sungai jika tidak dikelola dengan prinsip keberlanjutan (sustainable).",
        feedbackWrong: "Awas, jebakan! Perhatikan kata kuncinya: 'dampak negatif ekologis (lingkungan)'. Pilihan yang kamu jawab mungkin benar dari segi ekonomi, tapi bukan itu yang ditanyakan."
    }
];

let currentQuestion = 0;
let playerHp = 100;
let monsterHp = 100;

function initQuiz() {
    currentQuestion = 0;
    playerHp = 100;
    monsterHp = 100;
    updateHpBars();
    document.getElementById('quiz-end').classList.add('info-hidden');
    document.getElementById('quiz-end').classList.remove('info-visible');
    document.getElementById('question-box').classList.remove('info-hidden');
    loadQuestion();
}

function updateHpBars() {
    document.getElementById('player-hp').style.width = playerHp + '%';
    document.getElementById('monster-hp').style.width = monsterHp + '%';
}

function loadQuestion() {
    if(currentQuestion >= questions.length || monsterHp <= 0 || playerHp <= 0) {
        endQuiz();
        return;
    }
    
    const q = questions[currentQuestion];
    document.getElementById('question-text').innerText = (currentQuestion+1) + ". " + q.q;
    
    const optsContainer = document.getElementById('options-container');
    optsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optsContainer.appendChild(btn);
    });
    
    document.getElementById('quiz-feedback').classList.add('info-hidden');
    document.getElementById('quiz-feedback').classList.remove('info-visible');
}

function checkAnswer(selectedIndex, btnElement) {
    // Disable all buttons
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');
    
    const q = questions[currentQuestion];
    const feedbackBox = document.getElementById('quiz-feedback');
    const feedbackText = document.getElementById('quiz-feedback-text');
    
    feedbackBox.classList.remove('info-hidden');
    feedbackBox.classList.add('info-visible');
    
    if(selectedIndex === q.ans) {
        btnElement.classList.add('correct');
        monsterHp -= 20;
        feedbackText.innerHTML = "✅ " + q.feedbackCorrect;
        document.getElementById('monster-avatar').innerText = "💥 Smog-Zilla Terluka!";
        setTimeout(() => document.getElementById('monster-avatar').innerText = "☁️ Smog-Zilla", 1000);
    } else {
        btnElement.classList.add('wrong');
        btns[q.ans].classList.add('correct'); // show correct answer
        playerHp -= 20;
        feedbackText.innerHTML = "❌ " + q.feedbackWrong;
        document.querySelector('.player .avatar').innerText = "💥 Kamu Terluka!";
        setTimeout(() => document.querySelector('.player .avatar').innerText = "🧑‍🚀 Kamu", 1000);
    }
    
    updateHpBars();
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function endQuiz() {
    document.getElementById('question-box').classList.add('info-hidden');
    document.getElementById('quiz-feedback').classList.add('info-hidden');
    document.getElementById('quiz-feedback').classList.remove('info-visible');
    
    const endBox = document.getElementById('quiz-end');
    const resultText = document.getElementById('quiz-result');
    endBox.classList.remove('info-hidden');
    endBox.classList.add('info-visible');
    
    if (playerHp > 0 && monsterHp <= 0) {
        resultText.innerText = "🎉 Misi Berhasil! Smog-Zilla Dikalahkan!";
        resultText.style.color = "var(--neon-green)";
    } else if (playerHp <= 0) {
        resultText.innerText = "💀 Misi Gagal! Kamu dikalahkan polusi.";
        resultText.style.color = "var(--danger)";
    } else {
        if(playerHp > monsterHp) {
            resultText.innerText = "👍 Bagus! Kamu lebih unggul dari Smog-Zilla.";
        } else {
            resultText.innerText = "😬 Wah, polusinya masih kuat!";
        }
    }
}


// --- MENU 5: GAME EDUKASI ---
let budget = 10000;
let power = 0;
let poll = 0;
let selectedCard = null;
const cardData = {
    'pltu': { cost: 2000, pwr: 500, pol: 40, icon: '🏭', name: 'PLTU' },
    'plts': { cost: 3500, pwr: 250, pol: 0, icon: '☀️', name: 'PLTS' },
    'pltb': { cost: 3000, pwr: 150, pol: 0, icon: '💨', name: 'PLTB' },
    'geo': { cost: 6000, pwr: 400, pol: 0, icon: '🌋', name: 'Geo' }
};

function initGame() {
    budget = 10000;
    power = 0;
    poll = 0;
    selectedCard = null;
    
    document.querySelectorAll('.slot').forEach(slot => {
        slot.className = 'slot';
        slot.innerHTML = '+';
    });
    
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    document.getElementById('game-message').classList.add('info-hidden');
    
    updateGameStats();
}

function selectCard(type) {
    selectedCard = type;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    document.getElementById('card-' + type).classList.add('selected');
}

function placePlant(slotIndex) {
    if(!selectedCard) {
        showMessage("Pilih kartu pembangkit di bawah terlebih dahulu!", "var(--warning)");
        return;
    }
    
    const slot = document.getElementById('slot-' + slotIndex);
    if(slot.classList.contains('filled')) {
        showMessage("Slot sudah terisi!", "var(--warning)");
        return;
    }
    
    const data = cardData[selectedCard];
    
    if(budget < data.cost) {
        showMessage("Budget tidak cukup, Walikota!", "var(--danger)");
        return;
    }
    
    // Process build
    budget -= data.cost;
    power += data.pwr;
    poll += data.pol;
    
    slot.classList.add('filled');
    slot.innerHTML = `<span>${data.icon}</span><strong>${data.name}</strong><small>${data.pwr}MW</small>`;
    
    if(data.pol > 0) {
        slot.style.borderColor = "var(--danger)";
    } else {
        slot.style.borderColor = "var(--neon-green)";
    }
    
    updateGameStats();
    checkGameCondition();
}

function updateGameStats() {
    document.getElementById('game-budget').innerText = budget;
    document.getElementById('game-power').innerText = power;
    document.getElementById('game-poll').innerText = poll;
    
    // progress bars
    const pwrPercent = Math.min(100, (power / 1000) * 100);
    document.getElementById('power-prog').style.width = pwrPercent + '%';
    
    const pollPercent = Math.min(100, poll);
    document.getElementById('poll-prog').style.width = pollPercent + '%';
}

function checkGameCondition() {
    if (poll >= 100) {
        showMessage("💀 GAME OVER! Kota tertutup asap beracun. Penduduk protes!", "var(--danger)");
        disableGame();
    } else if (power >= 1000) {
        if (poll < 60) {
            showMessage("🎉 YOU WIN! Kota mencapai 1000MW dengan polusi aman. Kamu adalah Eco-Mayor!", "var(--neon-green)");
        } else {
            showMessage("⚠️ Target Listrik Tercapai, TAPI polusi terlalu tinggi. Coba lagi yang lebih bersih!", "var(--warning)");
        }
        disableGame();
    } else {
        // Cek jika slot penuh tapi listrik belum cukup
        let filledSlots = document.querySelectorAll('.slot.filled').length;
        if(filledSlots === 6 && power < 1000) {
            showMessage("💀 BLACKOUT! Semua lahan terpakai tapi listrik kurang dari 1000MW.", "var(--danger)");
            disableGame();
        }
    }
}

function showMessage(msg, color) {
    const msgBox = document.getElementById('game-message');
    msgBox.innerText = msg;
    msgBox.style.backgroundColor = 'rgba(0,0,0,0.5)';
    msgBox.style.border = `2px solid ${color}`;
    msgBox.style.color = color;
    msgBox.classList.remove('info-hidden');
    msgBox.classList.add('info-visible');
}

function disableGame() {
    document.querySelectorAll('.slot:not(.filled)').forEach(s => s.style.pointerEvents = 'none');
    document.querySelectorAll('.card').forEach(c => c.style.pointerEvents = 'none');
}

// Initialize on load
window.onload = () => {
    updateLab();
};
