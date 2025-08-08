/* Utilitaires localStorage */
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || {};
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

/* ----- Page de connexion ----- */
function initLogin() {
  const form = document.getElementById('loginForm');
  const error = document.getElementById('error');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    if (!username) return;

    const users = getUsers();
    if (users[username]) {
      error.textContent = 'Identifiant déjà utilisé, choisissez-en un autre.';
      return;
    }

    users[username] = { scores: [] };
    saveUsers(users);
    localStorage.setItem('activeUser', username);
    window.location.href = 'quiz.html';
  });
}

/* ----- Questions du quiz ----- */
const questions = [
  { question: "Comment dit-on 'bonjour' en arabe ?", answer: "salam" },
  { question: "Comment dit-on 'merci' en arabe ?", answer: "shukran" },
  { question: "Quelle lettre arabe correspond au son 'b' ?", answer: "ba" },
  { question: "Comment dit-on 'oui' en arabe ?", answer: "na'am" },
  { question: "Comment dit-on 'non' en arabe ?", answer: "la" },
  { question: "Comment dit-on 'maison' en arabe ?", answer: "bayt" },
  { question: "Quelle est la première lettre de l'alphabet arabe ?", answer: "alif" },
  { question: "Comment dit-on 'livre' en arabe ?", answer: "kitab" },
  { question: "Comment dit-on 'paix' en arabe ?", answer: "salam" },
  { question: "Quelle lettre arabe correspond au son 'm' ?", answer: "mim" }
];

/* ----- Page du quiz ----- */
function initQuiz() {
  const activeUser = localStorage.getItem('activeUser');
  if (!activeUser) {
    window.location.href = 'index.html';
    return;
  }

  const questionsDiv = document.getElementById('questions');
  questions.forEach((q, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'question';

    const label = document.createElement('label');
    label.textContent = `${idx + 1}. ${q.question}`;

    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.answer = q.answer.toLowerCase();

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    questionsDiv.appendChild(wrapper);
  });

  const form = document.getElementById('quizForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const inputs = questionsDiv.querySelectorAll('input');
    let good = 0;
    inputs.forEach(input => {
      if (input.value.trim().toLowerCase() === input.dataset.answer) {
        good++;
      }
    });

    const total = questions.length;
    const wrong = total - good;
    const note = Math.round((good / total) * 20 * 100) / 100; // deux décimales

    const users = getUsers();
    const user = users[activeUser];
    user.scores.push({ good, wrong, note });
    saveUsers(users);

    window.location.href = 'resultats.html';
  });
}

/* ----- Page des résultats ----- */
function initResults() {
  const activeUser = localStorage.getItem('activeUser');
  if (!activeUser) {
    window.location.href = 'index.html';
    return;
  }

  const users = getUsers();
  const user = users[activeUser];
  if (!user || user.scores.length === 0) {
    window.location.href = 'quiz.html';
    return;
  }

  const last = user.scores[user.scores.length - 1];

  const summary = document.getElementById('summary');
  summary.innerHTML =
    `<p><strong>Identifiant :</strong> ${activeUser}</p>
     <p><strong>Dernière note :</strong> ${last.note}/20</p>
     <p><strong>Bonnes réponses :</strong> ${last.good}</p>
     <p><strong>Fautes :</strong> ${last.wrong}</p>`;

  if (user.scores.length > 1) {
    const historyDiv = document.getElementById('history');
    const title = document.createElement('h2');
    title.textContent = 'Historique des notes';
    const list = document.createElement('ul');

    user.scores.forEach((s, i) => {
      const li = document.createElement('li');
      li.textContent = `Tentative ${i + 1} : ${s.note}/20`;
      list.appendChild(li);
    });

    historyDiv.appendChild(title);
    historyDiv.appendChild(list);
  }
}

/* ----- Initialisation selon la page ----- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.id === 'login') initLogin();
  if (document.body.id === 'quiz') initQuiz();
  if (document.body.id === 'results') initResults();
});
