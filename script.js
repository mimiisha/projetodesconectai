// --- FUNCIONALIDADE 1: QUIZ INTERATIVO (MAIS COMPLEXO) ---
const quizQuestions = [
    {
        question: "Quantas vezes você pega o celular na primeira hora depois de acordar?",
        answers: [
            { text: "Nenhuma, aproveito para fazer outras coisas.", profile: { consciente: 2 } },
            { text: "Uma ou duas vezes, para ver se há algo importante.", profile: { consciente: 1, scrollador: 1 } },
            { text: "Várias vezes, já rolando feeds e respondendo mensagens.", profile: { scrollador: 2, influencer: 1 } },
            { text: "Nem sei, já está na minha mão antes de eu levantar.", profile: { scrollador: 3, influencer: 2 } }
        ]
    },
    {
        question: "O que você sente se esquece o celular em casa?",
        answers: [
            { text: "Um pouco de alívio por não estar tão conectado.", profile: { consciente: 2 } },
            { text: "Estranho, mas consigo aproveitar o dia.", profile: { consciente: 1, scrollador: 1 } },
            { text: "Ansiedade e medo de perder algo importante.", profile: { scrollador: 2, influencer: 2 } },
            { text: "Como se tivesse perdido uma parte de mim.", profile: { scrollador: 3, influencer: 3 } }
        ]
    },
    {
        question: "Você costuma verificar as notificações do celular durante conversas com amigos ou familiares?",
        answers: [
            { text: "Nunca, a atenção está nas pessoas presentes.", profile: { consciente: 3 } },
            { text: "Raramente, apenas se estiver esperando algo urgente.", profile: { consciente: 1, scrollador: 1 } },
            { text: "Às vezes dou uma olhada rápida.", profile: { scrollador: 2, influencer: 1 } },
            { text: "Sim, é quase automático.", profile: { scrollador: 3, influencer: 2 } }
        ]
    },
    {
        question: "Como você se sente ao ver um post com muitos likes e comentários?",
        answers: [
            { text: "Fico feliz pela pessoa, mas não me afeta diretamente.", profile: { consciente: 2 } },
            { text: "Às vezes me pergunto o que eu poderia postar para ter a mesma atenção.", profile: { scrollador: 1, influencer: 2 } },
            { text: "Sinto vontade de interagir e participar da conversa.", profile: { scrollador: 2, influencer: 3 } },
            { text: "Não ligo muito para isso.", profile: { consciente: 3 } }
        ]
    },
    {
        question: "Antes de dormir, qual é a última coisa que você geralmente faz?",
        answers: [
            { text: "Leio um livro físico ou converso com alguém.", profile: { consciente: 3 } },
            { text: "Organizo minhas coisas para o dia seguinte.", profile: { consciente: 2 } },
            { text: "Dou uma última olhada nas redes sociais.", profile: { scrollador: 2, influencer: 1 } },
            { text: "Fico rolando o feed até o sono chegar.", profile: { scrollador: 3, influencer: 2 } }
        ]
    }
];

const quizContainer = document.getElementById('quiz-container');
const startQuizBtn = document.getElementById('start-quiz-btn');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const resultContainer = document.getElementById('result-container');
const profileTitle = document.getElementById('profile-title');
const profileDescription = document.getElementById('profile-description');
const quizProgress = document.getElementById('quiz-progress');
const currentQuestionNumber = document.getElementById('current-question-number');
const totalQuestionsDisplay = document.getElementById('total-questions');
const subProfilesContainer = document.getElementById('sub-profiles');

let currentQuestionIndex = 0;
let profilesScore = {
    consciente: 0,
    scrollador: 0,
    influencer: 0
};

startQuizBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startQuizBtn.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    currentQuestionIndex = 0;
    profilesScore = { consciente: 0, scrollador: 0, influencer: 0 };
    totalQuestionsDisplay.innerText = quizQuestions.length;
    showQuestion();
}

function showQuestion() {
    resetState();
    const question = quizQuestions[`${currentQuestionIndex}`];
    questionText.innerText = question.question;
    currentQuestionNumber.innerText = currentQuestionIndex + 1;

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer.profile, button));
        answerButtons.appendChild(button);
    });
}

function resetState() {
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    resultContainer.classList.add('hidden');
    questionText.classList.remove('hidden');
}

function selectAnswer(profilePoints, selectedButton) {
    Object.keys(profilePoints).forEach(profile => {
        profilesScore[`${profile}`] += profilePoints[`${profile}`];
    });

    const allButtons = answerButtons.querySelectorAll('button');
    allButtons.forEach(btn => btn.disabled = true);
    selectedButton.classList.add('selected');

    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResult();
        }
    }, 500);
}

function showResult() {
    resetState();
    quizProgress.classList.add('hidden');
    questionText.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    let mainProfile = 'consciente';
    if (profilesScore.scrollador > profilesScore.consciente && profilesScore.scrollador >= profilesScore.influencer) {
        mainProfile = 'scrollador';
    } else if (profilesScore.influencer > profilesScore.consciente && profilesScore.influencer > profilesScore.scrollador) {
        mainProfile = 'influencer';
    }

    let title, description;
    const subProfiles = [];

    if (mainProfile === 'consciente') {
        title = "O Conectado Consciente";
        description = "Você tem um ótimo equilíbrio com o mundo digital, usando a tecnologia de forma intencional. Continue cultivando essa consciência!";
        if (profilesScore.scrollador >= profilesScore.influencer && profilesScore.scrollador > 0) subProfiles.push("Com uma pitada de explorador digital.");
        else if (profilesScore.influencer > 0) subProfiles.push("Com um toque de criador de conteúdo.");
    } else if (mainProfile === 'scrollador') {
        title = "O Explorador Digital (com tendência ao Scroll)";
        description = "Você gosta de estar por dentro de tudo, mas talvez gaste tempo demais navegando sem um objetivo claro. Que tal definir algumas pausas digitais?";
        if (profilesScore.consciente > 0) subProfiles.push("Com momentos de reflexão e desconexão.");
        if (profilesScore.influencer > profilesScore.consciente) subProfiles.push("Com a curiosidade de compartilhar e se conectar.");
    } else {
        title = "O Criador de Conteúdo (com potencial para equilíbrio)";
        description = "Você gosta de se expressar e interagir online, o que é ótimo! Mas lembre-se da importância de se desconectar para recarregar as energias e viver o 'ao vivo'.";
        if (profilesScore.consciente > 0) subProfiles.push("Valorizando também o tempo offline e as conexões reais.");
        if (profilesScore.scrollador >= profilesScore.consciente) subProfiles.push("Aproveitando a internet para aprender e se inspirar, além de criar.");
    }

    profileTitle.innerText = title;
    profileDescription.innerText = description;
    subProfilesContainer.innerHTML = subProfiles.length > 0 ? `<h5>Observações:</h5><ul>${subProfiles.map(sub => `<li>${sub}</li>`).join('')}</ul>` : '';

    startQuizBtn.innerText = "Refazer o Quiz";
    startQuizBtn.classList.remove('hidden');
    quizProgress.classList.remove('hidden');
}


// --- FUNCIONALIDADE 2: DESAFIO TELA PRETA (COM NÍVEIS) ---
const startChallengeButtons = document.querySelectorAll('.start-challenge-btn');
const challengeContainer = document.getElementById('challenge-container');
const challengeTimer = document.getElementById('challenge-timer');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const challengeReflection = document.getElementById('challenge-reflection');
const challengeComplete = document.getElementById('challenge-complete');
const pointsEarned = document.getElementById('points-earned');
const totalPointsDisplay = document.getElementById('total-points');
const timerProgressBar = document.getElementById('timer-progress-bar');

let totalPoints = parseInt(localStorage.getItem('desconectaPoints')) || 0;
totalPointsDisplay.innerText = totalPoints;

const reflectionPhrasesComplex = [
    "Sinta o ar ao seu redor.",
    "Pense em três coisas pelas quais você é grato.",
    "Feche os olhos e ouça os sons distantes.",
    "Imagine seu lugar favorito no mundo real.",
    "Respire profundamente e solte o ar lentamente."
];

let challengeInterval;
let currentChallengeDuration;

startChallengeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const duration = parseInt(this.getAttribute('data-duration'));
        startBlackScreenChallenge(duration);
    });
});

function startBlackScreenChallenge(durationMinutes) {
    currentChallengeDuration = durationMinutes;
    let timeLeft = durationMinutes * 60;
    document.body.classList.add('black-screen');
    challengeContainer.classList.remove('hidden');
    document.querySelector('.challenge-options').classList.add('hidden');

    minutesDisplay.innerText = String(durationMinutes).padStart(2, '0');
    secondsDisplay.innerText = "00";

    let currentPhraseIndex = 0;
    challengeReflection.innerText = reflectionPhrasesComplex[`${Math.floor(Math.random() * reflectionPhrasesComplex.length)}`];
    const reflectionInterval = setInterval(() => {
        challengeReflection.innerText = reflectionPhrasesComplex[`${Math.floor(Math.random() * reflectionPhrasesComplex.length)}`];
    }, 7000);

    const totalTime = timeLeft;

    challengeInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.innerText = String(minutes).padStart(2, '0');
        secondsDisplay.innerText = String(seconds).padStart(2, '0');

        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        timerProgressBar.style.setProperty('--progress-value', `${progress}%`);
        timerProgressBar.style.width = `${progress}%`;

        if (timeLeft <= 0) {
            clearInterval(challengeInterval);
            clearInterval(reflectionInterval);
            document.body.classList.remove('black-screen');
            challengeContainer.classList.add('hidden');
            challengeComplete.classList.remove('hidden');

            let pointsToAdd = 0;
            if (durationMinutes === 15) pointsToAdd = 50;
            else if (durationMinutes === 30) pointsToAdd = 100;
            else if (durationMinutes === 60) pointsToAdd = 200;
            
            totalPoints += pointsToAdd;
            pointsEarned.innerText = pointsToAdd;
            totalPointsDisplay.innerText = totalPoints;
            localStorage.setItem('desconectaPoints', totalPoints);
        }
    }, 1000);
}


// --- FUNCIONALIDADE 3: MAPA DE IDEIAS ANALÓGICO (INTERATIVO) ---
const islands = document.querySelectorAll('.island');
const islandInfo = document.getElementById('island-info');

islands.forEach(island => {
    island.addEventListener('click', () => {
        const activity = island.getAttribute('data-activity');
        islandInfo.innerText = activity;
        islandInfo.classList.add('active');
    });
});


// --- FUNCIONALIDADE 4: PAINEL DE CONTROLE DO TEMPO ---
const timeForm = document.getElementById('time-form');
const timeChart = document.getElementById('timeChart').getContext('2d');
let myChart;

timeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const instagramTime = parseFloat(document.getElementById('instagram-time').value);
    const tiktokTime = parseFloat(document.getElementById('tiktok-time').value);
    const youtubeTime = parseFloat(document.getElementById('youtube-time').value);
    const otherTime = parseFloat(document.getElementById('other-time').value);

    const labels = ['Instagram', 'TikTok', 'YouTube', 'Outros'];
    const data = [instagramTime, tiktokTime, youtubeTime, otherTime];
    const totalHours = data.reduce((sum, time) => sum + time, 0);

    const totalYearHours = totalHours * 365;
    const totalYearDays = (totalYearHours / 24).toFixed(1);

    const courses = Math.floor(totalYearHours / 30); // Estimativa de 30h por curso
    const books = Math.floor(totalYearHours / 4); // Estimativa de 4h por livro

    const newComparisonText = `Você gastou ${totalYearHours.toLocaleString()} horas nestes apps este ano. Isso equivale a ${totalYearDays} dias inteiros! Com esse tempo, você poderia ter:
    - Terminado **${courses}** cursos online de 30h
    - Lido **${books}** livros de 200 páginas`;
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(timeChart, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#4A7C59',
                    '#F4C49A',
                    '#5A7E7B',
                    '#D9C1A9'
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = ((value / totalHours) * 100).toFixed(1);
                            return `${context.label}: ${value}h/dia (${percentage}%)`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: newComparisonText.split('\n'),
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
});


// --- FUNCIONALIDADE 5: BIBLIOTECA DE SHORT DOCS ---
const videoData = [
    { title: "Como o Algoritmo Funciona", id: "dQw4w9WgXcQ" },
    { title: "A Economia da Atenção", id: "k-fC9NfXQ9U" },
    { title: "Ex-funcionários de Big Tech", id: "CmtwX_wBwYI" },
    { title: "Dopamina e Redes Sociais", id: "0w4pP13Jt8Y" }
];

const videoGrid = document.querySelector('.video-grid');

videoData.forEach(video => {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');

    const videoTitle = document.createElement('h4');
    videoTitle.innerText = video.title;

    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "200";
    iframe.src = `https://www.youtube.com/embed/${video.id}`;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    videoContainer.appendChild(videoTitle);
    videoContainer.appendChild(iframe);
    videoGrid.appendChild(videoContainer);
});


// --- FUNCIONALIDADE 6: FÓRUM DE DISCUSSÃO (SIMULADO COM LIKES E NOVA MENSAGEM) ---
const forumData = [
    {
        title: "Como parar de me comparar com a vida dos influencers?",
        content: "Eu sinto que minha vida é tão sem graça perto do que eu vejo nas redes. Alguma dica para me sentir melhor?",
        likes: 12
    },
    {
        title: "Dicas para dormir melhor sem o celular",
        content: "Estou com muita dificuldade para largar o celular antes de dormir. Alguém tem alguma dica que realmente funcione?",
        likes: 25
    },
    {
        title: "O que vocês fazem para se desconectar de verdade?",
        content: "Queria ideias de atividades offline para me manter ocupado. Já tentei ler, mas logo volto para o celular.",
        likes: 8
    }
];

const forumPostsContainer = document.getElementById('forum-posts');
const messageBox = document.getElementById('forum-message-box');
const sendMessageBtn = document.getElementById('send-message-btn');

function createPostElement(title, content, likes) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    const postTitle = document.createElement('h4');
    postTitle.classList.add('post-title');
    postTitle.innerText = title;

    const postContent = document.createElement('p');
    postContent.classList.add('post-content');
    postContent.innerText = content;

    const postActions = document.createElement('div');
    postActions.classList.add('post-actions');

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-btn');
    likeButton.innerHTML = `&#x2764; <span class="like-count">${likes}</span>`;

    likeButton.addEventListener('click', () => {
        const likeCount = likeButton.querySelector('.like-count');
        let currentLikes = parseInt(likeCount.innerText);
        likeCount.innerText = currentLikes + 1;
        likeButton.disabled = true;
    });

    postActions.appendChild(likeButton);
    postDiv.appendChild(postTitle);
    postDiv.appendChild(postContent);
    postDiv.appendChild(postActions);

    return postDiv;
}

// Carregar os posts pré-definidos
forumData.forEach(post => {
    const postElement = createPostElement(post.title, post.content, post.likes);
    forumPostsContainer.appendChild(postElement);
});

// Lógica para enviar a nova mensagem
sendMessageBtn.addEventListener('click', () => {
    const messageContent = messageBox.value.trim();
    if (messageContent !== "") {
        const newPostElement = createPostElement("Você postou:", messageContent, 0);
        forumPostsContainer.prepend(newPostElement);
        messageBox.value = "";
    }
});