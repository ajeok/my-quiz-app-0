let questions = [];
let currentIndex = 0;
let score = 0;

// DOM 요소 참조
const loadingEl = document.getElementById("loading");
const quizBoxEl = document.getElementById("quiz-box");
const resultBoxEl = document.getElementById("result-box");
const questionTextEl = document.getElementById("question-text");
const optionsContainerEl = document.getElementById("options-container");
const explanationBoxEl = document.getElementById("explanation-box");
const explanationTextEl = document.getElementById("explanation-text");
const questionCountEl = document.getElementById("question-count");
const scoreCounterEl = document.getElementById("score-counter");
const progressBarEl = document.getElementById("progress-bar");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

// 1. quiz.json 비동기 호출
async function loadQuizData() {
  try {
    const response = await fetch("quiz.json");
    if (!response.ok) {
      throw new Error("문제 데이터를 가져오지 못했습니다.");
    }
    questions = await response.json();
    initQuiz();
  } catch (error) {
    loadingEl.textContent = "에러: " + error.message;
  }
}

// 2. 퀴즈 초기화
function initQuiz() {
  currentIndex = 0;
  score = 0;
  loadingEl.classList.add("hidden");
  resultBoxEl.classList.add("hidden");
  quizBoxEl.classList.remove("hidden");
  renderQuestion();
}

// 3. 문제 렌더링
function renderQuestion() {
  const currentQ = questions[currentIndex];

  // 진행도 및 헤더 갱신
  questionCountEl.textContent = `문제 ${currentIndex + 1}/${questions.length}`;
  scoreCounterEl.textContent = `점수: ${score}`;
  const progressPercent = ((currentIndex) / questions.length) * 100;
  progressBarEl.style.width = `${progressPercent}%`;

  questionTextEl.textContent = currentQ.question;
  explanationBoxEl.classList.add("hidden");
  optionsContainerEl.innerHTML = "";

  // 4지선다 버튼 생성
  currentQ.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = `${idx + 1}. ${optText}`;
    btn.onclick = () => handleSelectOption(idx);
    optionsContainerEl.appendChild(btn);
  });
}

// 4. 보기 선택 처리
function handleSelectOption(selectedIndex) {
  const currentQ = questions[currentIndex];
  const buttons = optionsContainerEl.querySelectorAll(".option-btn");

  // 모든 버튼 비활성화 (중복 클릭 방지)
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQ.answer) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex) {
      btn.classList.add("wrong");
    }
  });

  // 점수 반영
  if (selectedIndex === currentQ.answer) {
    score += 1;
    scoreCounterEl.textContent = `점수: ${score}`;
  }

  // 해설 노출
  explanationTextEl.textContent = currentQ.explanation;
  explanationBoxEl.classList.remove("hidden");
}

// 5. 다음 문제 이동
nextBtn.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

// 6. 결과 화면 표시
function showResult() {
  quizBoxEl.classList.add("hidden");
  resultBoxEl.classList.remove("hidden");
  document.getElementById("final-score").textContent = 
    `총 ${questions.length}문제 중 ${score}문제를 맞혔습니다! (${Math.round((score / questions.length) * 100)}점)`;
}

// 7. 다시 풀기
restartBtn.addEventListener("click", initQuiz);

// 시작
loadQuizData();
