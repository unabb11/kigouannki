const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "?", "+", "=", "~"];

let score = 0;
let totalTime = 30; // 全体タイマー
let memorizeTime = 3; // 記憶時間（3秒固定）
let timerInterval;
let countdownInterval;
let currentString = "";
let hiddenIndices = [];
let isMemorizing = false; // 記憶時間中はtrue

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const memorizeArea = document.getElementById("memorize-area");
const memorizeText = document.getElementById("memorize-text");
const countdown = document.getElementById("countdown");
const questionArea = document.getElementById("question-area");
const questionText = document.getElementById("question-text");
const choices = document.getElementById("choices");
const timeLeftDisplay = document.getElementById("time-left");
const scoreDisplay = document.getElementById("score");
const resultArea = document.getElementById("result-area");
const finalScore = document.getElementById("final-score");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

function startGame() {
  score = 0;
  totalTime = 60;
  scoreDisplay.textContent = score;
  startBtn.style.display = "none";
  resultArea.style.display = "none";
  questionArea.style.display = "none";
  memorizeArea.style.display = "block";

  startTimer();
  nextQuestion();
}

function startTimer() {
  timeLeftDisplay.textContent = totalTime;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isMemorizing) { // 記憶時間中はカウントしない
      totalTime--;
      timeLeftDisplay.textContent = totalTime;
    }
    if (totalTime <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function nextQuestion() {
  questionArea.style.display = "none";
  memorizeArea.style.display = "block";
  memorizeText.style.color = "#01579b";

  isMemorizing = true;

  // 記号列生成：スコアが上がると文字列が長くなる
  currentString = generateSymbolString(5 + Math.floor(score / 3));
  memorizeText.textContent = currentString;

  let timeLeft = memorizeTime;
  countdown.textContent = `覚える時間: ${timeLeft} 秒`;

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    timeLeft--;
    countdown.textContent = `覚える時間: ${timeLeft} 秒`;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      isMemorizing = false;
      showQuestion();
    }
  }, 1000);
}

function generateSymbolString(length) {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += symbols[Math.floor(Math.random() * symbols.length)];
  }
  return str;
}

function showQuestion() {
  memorizeArea.style.display = "none";
  questionArea.style.display = "block";
  choices.innerHTML = "";

  const chars = currentString.split("");
  hiddenIndices = [];

  // 難易度上昇：2個 → 最大5個
  const hideCount = Math.min(5, 2 + Math.floor(score / 3));

  while (hiddenIndices.length < hideCount) {
    const idx = Math.floor(Math.random() * chars.length);
    if (!hiddenIndices.includes(idx)) hiddenIndices.push(idx);
  }

  hiddenIndices.forEach(i => chars[i] = "_");
  questionText.textContent = chars.join(" ");

  symbols.forEach(sym => {
    const btn = document.createElement("button");
    btn.textContent = sym;
    btn.onclick = () => handleChoice(sym);
    choices.appendChild(btn);
  });
}

function handleChoice(symbol) {
  // 正解となる空欄があるか？
  const correctIndex = hiddenIndices.find(i => currentString[i] === symbol);

  if (correctIndex !== undefined) {
    // その空欄を埋める
    const displayed = questionText.textContent.split(" ");
    displayed[correctIndex] = symbol;
    questionText.textContent = displayed.join(" ");
    hiddenIndices = hiddenIndices.filter(i => i !== correctIndex);

    if (hiddenIndices.length === 0) {
      // 全部正解！
      score++;
      scoreDisplay.textContent = score;
      setTimeout(nextQuestion, 800);
    }
  } else {
    // 間違い
    questionText.textContent = `❌ 不正解！ 答えは ${currentString}`;
    setTimeout(nextQuestion, 1500);
  }
}

function endGame() {
  clearInterval(timerInterval);
  clearInterval(countdownInterval);
  memorizeArea.style.display = "none";
  questionArea.style.display = "none";
  resultArea.style.display = "block";
  finalScore.textContent = `あなたのスコア: ${score} 問正解！`;
}
