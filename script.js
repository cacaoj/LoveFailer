// Game State
const state = {
    currentPersona: null,
    currentStep: 0,
    score: 0,
    isPlaying: false,
    userGender: null, // 'male' or 'female'
    partnerImage: '',
    twistStages: [], // Indices of stages with twist
    twistPersona: null // The persona to mimic during twist
};

// DOM Elements
const screens = {
    intro: document.getElementById('intro-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    situation: document.getElementById('situation-text'),
    optionsContainer: document.querySelector('.options-container'),
    stageIndicator: document.getElementById('stage-indicator'),
    bonusIndicator: document.getElementById('bonus-indicator'),
    toastContainer: document.getElementById('toast-container'),

    // Images
    introCharBox: document.getElementById('intro-char-box'),
    introCharImg: document.getElementById('intro-char-img'),
    gameCharImg: document.getElementById('game-char-img'),
    resultCharImg: document.getElementById('result-char-img'),

    // Result UI
    resultGrade: document.getElementById('result-grade'),
    personaName: document.getElementById('persona-name'),
    resultMessage: document.getElementById('result-message'),
    finalScore: document.getElementById('final-score'),

    // Buttons
    startBtn: document.getElementById('start-btn'),
    genderBtns: document.querySelectorAll('.gender-btn')
};

// Event Listeners
ui.genderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => selectGender(e.target.dataset.gender));
});
ui.startBtn.addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', () => location.reload());
document.getElementById('share-btn').addEventListener('click', shareResult);

function selectGender(gender) {
    state.userGender = gender;

    // Select Partner Logic
    // If User Male -> Partner Female
    // If User Female -> Partner Male
    const partnerGender = gender === 'male' ? 'female' : 'male';
    state.partnerImage = `assets/char_${partnerGender}.png`;

    // Update UI
    ui.introCharImg.src = state.partnerImage;
    ui.introCharBox.classList.remove('hidden');
    ui.startBtn.classList.remove('hidden');

    // Highlight selected button
    ui.genderBtns.forEach(btn => btn.classList.remove('selected'));
    document.querySelector(`[data-gender="${gender}"]`).classList.add('selected');
}

function startGame() {
    if (!state.userGender) return;

    // 1. Reset State
    state.score = 0;
    state.currentStep = 0;
    state.isPlaying = true;

    // 2. Assign Random Persona
    const personaKeys = Object.keys(PERSONAS);
    const randomKey = personaKeys[Math.floor(Math.random() * personaKeys.length)];
    state.currentPersona = PERSONAS[randomKey];

    // 3. Assign Twist Logic & Bonus Logic
    // Pick 2 random stages for Twist
    state.twistStages = [];
    while (state.twistStages.length < 2) {
        const r = Math.floor(Math.random() * 10);
        if (!state.twistStages.includes(r)) state.twistStages.push(r);
    }

    // Pick 3 random stages for Bonus (must be distinct from Twist? No, can overlap for chaos)
    // Let's keep them distinct for clarity? Or overlap equals 3x? 
    // User didn't specify, but "Random" implies full RNG. Let's allow overlap for fun or just separate?
    // Let's make them separate to spread out the "events".
    // Pick 1~3 random stages for Bonus
    // User feedback: "Count is 1~3".
    const bonusCount = Math.floor(Math.random() * 3) + 1;
    state.bonusStages = [];
    while (state.bonusStages.length < bonusCount) {
        const r = Math.floor(Math.random() * 10);
        if (!state.bonusStages.includes(r)) state.bonusStages.push(r);
    }

    // Validate Twist Persona (Must be different from main)
    let twistKey = randomKey;
    while (twistKey === randomKey) {
        twistKey = personaKeys[Math.floor(Math.random() * personaKeys.length)];
    }
    state.twistPersona = PERSONAS[twistKey];

    console.log(`[Game Start] Target: ${state.currentPersona.name}`);
    console.log(`Twist Steps: ${state.twistStages}, Bonus Steps: ${state.bonusStages}`);

    // 4. Set Images
    ui.gameCharImg.src = state.partnerImage;
    ui.resultCharImg.src = state.partnerImage;

    // 5. Switch Screen
    switchScreen('quiz');
    renderQuestion();
}

function switchScreen(screenName) {
    Object.values(screens).forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    screens[screenName].classList.remove('hidden');
    screens[screenName].classList.add('active');
}

function renderQuestion() {
    if (state.currentStep >= SCENARIOS.length) {
        showResult();
        return;
    }

    const currentScenario = SCENARIOS[state.currentStep];
    const isTwist = state.twistStages.includes(state.currentStep);
    // const isBonus = state.bonusStages.includes(state.currentStep); 
    // HIDDEN BONUS: Do not show indicator

    // Update UI
    ui.stageIndicator.textContent = `Stage ${state.currentStep + 1}/10`;
    ui.bonusIndicator.className = 'hidden'; // Always hidden

    let twistMsg = "";
    if (isTwist) twistMsg = "\n(상대방의 분위기가 평소와 다릅니다...?)";

    ui.situation.innerText = currentScenario.situation + twistMsg;

    // Clear Options
    ui.optionsContainer.innerHTML = '';

    currentScenario.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn option-btn';
        btn.textContent = opt.text;
        btn.onclick = () => handleChoice(index);
        ui.optionsContainer.appendChild(btn);
    });
}

function handleChoice(optionIndex) {
    if (!state.isPlaying) return;

    const currentScenario = SCENARIOS[state.currentStep];
    const selectedOption = currentScenario.options[optionIndex];

    // Check Twist
    const isTwist = state.twistStages.includes(state.currentStep);
    const targetPersonaId = isTwist ? state.twistPersona.id : state.currentPersona.id;

    // Logic Judgement
    const result = selectedOption.target_logic[targetPersonaId];

    // Bonus Check
    const isBonus = state.bonusStages ? state.bonusStages.includes(state.currentStep) : false;
    const points = isBonus ? 2 : 1;

    let msg = "";

    // Messages
    const passMsgs = [
        "눈이 반짝입니다! ✨",
        "미소를 짓습니다. 😊",
        "오! 반응이 좋네요. 👍",
        "호감도 상승! 💖"
    ];
    const failMsgs = [
        "표정이 굳었습니다.. 💦",
        "한숨을 쉬네요.. 💨",
        "어색한 정적... 🦗",
        "음... 별로인 눈치네요. 😅"
    ];

    if (result === 'PASS') {
        state.score += points;
        msg = passMsgs[Math.floor(Math.random() * passMsgs.length)];
        // Hidden Bonus: Don't tell them it's bonus points!
        if (isTwist) msg += " (의외의 모습!)";
    } else {
        msg = failMsgs[Math.floor(Math.random() * failMsgs.length)];
    }

    showToast(msg);

    // Timeout
    setTimeout(() => {
        state.currentStep++;
        renderQuestion();
    }, 1000);
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    ui.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);
}

function showResult() {
    state.isPlaying = false;
    switchScreen('result');

    // Calculate Grade
    let gradeKey = 'STRANGER';
    if (state.score >= ENDINGS.PERFECT.minScore) gradeKey = 'PERFECT';
    else if (state.score >= ENDINGS.FRIEND.minScore) gradeKey = 'FRIEND';

    const gradeData = ENDINGS[gradeKey];

    ui.resultGrade.textContent = gradeData.label;
    ui.resultGrade.className = `grade-badge ${gradeData.class}`;
    ui.personaName.textContent = state.currentPersona.name;
    ui.finalScore.textContent = state.score;

    // Dynamic pronoun
    const revealText = document.getElementById('result-reveal-text');
    revealText.textContent = (state.userGender === 'male' ? "그녀의" : "그의") + " 정체는...";

    const message = RESULT_MESSAGES[gradeKey][state.currentPersona.id];
    ui.resultMessage.textContent = `"${message}"`;
}

async function shareResult() {
    const text = `[연애고자 탈출기] 나의 점수는 ${state.score}점! (${state.userGender === 'male' ? '남자' : '여자'}편)`;
    const url = window.location.href;
    if (navigator.share) {
        try { await navigator.share({ title: '연애고자 탈출기', text: text, url: url }); }
        catch (err) { console.log('Share failed', err); }
    } else { alert('URL이 복사되었습니다: ' + url); }
}
