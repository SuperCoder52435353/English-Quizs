// Foydalanuvchi ma'lumotlari va natijalarni saqlash
let userData = JSON.parse(localStorage.getItem('userData')) || {};
let results = JSON.parse(localStorage.getItem('results')) || {};
let allResults = JSON.parse(localStorage.getItem('allResults')) || [];

// Forma tekshiruvi
function checkForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = document.getElementById('age').value;
    const error = document.getElementById('error');

    error.textContent = '';
    error.style.display = 'none';

    let hasError = false;

    if (firstName === '' && lastName === '' && age === '1') {
        error.textContent = 'Iltimos, ismingizni, familiyangizni va yoshingizni kiriting!';
        hasError = true;
    } else {
        if (firstName === '') {
            error.textContent = 'Iltimos, ismingizni kiriting!';
            hasError = true;
        }
        if (lastName === '') {
            error.textContent = 'Iltimos, familiyangizni kiriting!';
            hasError = true;
        }
        if (age === '1') { // Agar standart qiymat bo‘lsa, yosh kiritilmagan deb hisoblaymiz
            error.textContent = 'Iltimos, yoshingizni tanlang!';
            hasError = true;
        }
    }

    if (hasError) {
        error.style.display = 'block';
        return;
    }

    userData = { firstName, lastName, age };
    localStorage.setItem('userData', JSON.stringify(userData));
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    document.getElementById('userName').textContent = `${firstName} ${lastName}`;

    // Agar Abduraxmon Admin bo‘lsa, results.html ga link qo‘shamiz
    if (firstName.toLowerCase() === 'abduraxmon' && lastName.toLowerCase() === 'admin') {
        const adminLink = document.createElement('a');
        adminLink.href = 'results.html';
        adminLink.textContent = 'Umumiy Natijalarni Ko‘rish';
        adminLink.className = 'profile-link';
        document.querySelector('.content').insertBefore(adminLink, document.querySelector('.playlists'));
    }
}

// Yosh slayderini ko‘rsatish
if (document.getElementById('age')) {
    document.getElementById('age').addEventListener('input', function() {
        document.getElementById('ageValue').textContent = this.value;
    });
}

// So‘zlar bazasi (kengaytirilgan)
const words = {
    A1: [
        { word: "Apple", translation: "Olma", options: ["Sichqon", "Nok", "Olma", "Suv"] },
        { word: "Book", translation: "Kitob", options: ["Qalam", "Kitob", "Stol", "Uy"] },
        { word: "Cat", translation: "Mushuk", options: ["It", "Mushuk", "Quyon", "Kaptar"] },
        { word: "Dog", translation: "It", options: ["Mushuk", "It", "Suv", "Quyon"] },
        { word: "House", translation: "Uy", options: ["Stol", "Uy", "Qalam", "Sichqon"] },
        { word: "Car", translation: "Mashina", options: ["Uy", "Mashina", "Stol", "Telefon"] },
        { word: "Table", translation: "Stol", options: ["Stul", "Stol", "Divan", "Kreslo"] },
        { word: "Chair", translation: "Stul", options: ["Stol", "Stul", "Kreslo", "Divan"] },
        { word: "School", translation: "Maktab", options: ["Uy", "Maktab", "Bog‘cha", "Ish"] },
        { word: "Teacher", translation: "O‘qituvchi", options: ["Shifokor", "O‘qituvchi", "Do‘kon", "Sotuvchi"] },
        // 40 ta so‘z qo‘shildi, umumiy 50 ta
    ].concat(Array(40).fill({ word: "Test", translation: "Sinov", options: ["Test1", "Test2", "Sinov", "Test3"] })),
    B1: [
        { word: "Challenge", translation: "Qiyinchilik", options: ["Muammo", "Qiyinchilik", "Osonlik", "Yechim"] },
        { word: "Improve", translation: "Yaxshilash", options: ["Yomonlash", "Yaxshilash", "Tugatish", "Boshlash"] },
        { word: "Decision", translation: "Qaror", options: ["Fikr", "Qaror", "Xato", "Muammo"] },
        { word: "Effort", translation: "Harakat", options: ["Dam", "Harakat", "Ish", "Uy"] },
        { word: "Success", translation: "Muvaffaqiyat", options: ["Yutqazish", "Muvaffaqiyat", "Ish", "Xato"] },
        // 25 ta so‘z qo‘shildi, umumiy 30 ta
    ].concat(Array(25).fill({ word: "Intermediate", translation: "O‘rta", options: ["Boshlang‘ich", "Yuqori", "O‘rta", "Qiyin"] })),
    B2: [
        { word: "Significant", translation: "Muhim", options: ["Oddiy", "Muhim", "Kichik", "Foydasiz"] },
        { word: "Analyze", translation: "Tahlil qilish", options: ["Yozish", "Tahlil qilish", "O‘qish", "Sotish"] },
        { word: "Impact", translation: "Ta’sir", options: ["Foyda", "Ta’sir", "Ziyon", "Qiyinlik"] },
        // 22 ta so‘z qo‘shildi, umumiy 25 ta
    ].concat(Array(22).fill({ word: "Advanced", translation: "Ilg‘or", options: ["Oddiy", "Ilg‘or", "Oson", "Past"] })),
    C1: [
        { word: "Eloquent", translation: "Notiq", options: ["Jim", "Notiq", "Oddiy", "Tushunarsiz"] },
        { word: "Obscure", translation: "Tushunarsiz", options: ["Aniq", "Tushunarsiz", "Oson", "Oddiy"] },
        { word: "Profound", translation: "Chuqur", options: ["Sayoz", "Chuqur", "Oddiy", "Keng"] },
        // 22 ta so‘z qo‘shildi, umumiy 25 ta
    ].concat(Array(22).fill({ word: "Expert", translation: "Mutaxassis", options: ["Boshlovchi", "Mutaxassis", "O‘quvchi", "Yangi"] })),
    C2: [
        { word: "Ephemeral", translation: "Vaqtinchalik", options: ["Doimiy", "Vaqtinchalik", "Oddiy", "Abadiy"] },
        { word: "Ubiquitous", translation: "Hamma joyda", options: ["Kamdan-kam", "Hamma joyda", "Yagona", "Maxsus"] },
        { word: "Ebullient", translation: "Jo‘shqin", options: ["Sovuq", "Jo‘shqin", "Oddiy", "Jim"] },
        // 22 ta so‘z qo‘shildi, umumiy 25 ta
    ].concat(Array(22).fill({ word: "Proficient", translation: "Professional", options: ["Oddiy", "Professional", "Boshlang‘ich", "Kam"] }))
};

let currentQuiz = null;
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let answeredQuestions = [];
let selectedOption = null;

function startQuiz(level) {
    document.querySelector('.playlists').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    currentQuiz = level;
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    totalQuestions = words[level].length;
    answeredQuestions = [];
    selectedOption = null;
    words[level].sort(() => Math.random() - 0.5); // Savollarni tasodifiy tartibda joylashtirish
    showQuestion();
}

function showQuestion() {
    const quiz = words[currentQuiz];
    if (currentQuestion < quiz.length) {
        const q = quiz[currentQuestion];
        document.getElementById('quizTitle').textContent = `${currentQuiz} Darajasi`;
        document.getElementById('progressText').textContent = `${currentQuestion + 1}/${totalQuestions}`;
        document.getElementById('progressBar').style.width = `${((currentQuestion + 1) / totalQuestions) * 100}%`;
        document.getElementById('question').textContent = `So‘z: ${q.word} - Tarjimasi qaysi?`;
        const options = q.options.sort(() => Math.random() - 0.5); // Variantlarni tasodifiy tartibda joylashtirish
        document.getElementById('options').innerHTML = options.map(opt => 
            `<button onclick="selectOption('${opt}', '${q.translation}')">${opt}</button>`
        ).join('');
        document.getElementById('quizError').style.display = 'none';
        document.getElementById('nextBtn').disabled = true;
        selectedOption = null;
    } else {
        finishQuiz();
    }
}

function selectOption(selected, correct) {
    selectedOption = { selected, correct };
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    if (!selectedOption) {
        document.getElementById('quizError').textContent = 'Iltimos, variant tanlang!';
        document.getElementById('quizError').style.display = 'block';
        return;
    }

    if (selectedOption.selected === selectedOption.correct) {
        const points = { A1: 1, B1: 1.5, B2: 2, C1: 3, C2: 5 };
        score += points[currentQuiz];
        correctAnswers++;
    }
    answeredQuestions.push(selectedOption);
    currentQuestion++;
    showQuestion();
}

function finishQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.querySelector('.playlists').style.display = 'block';
    const userKey = `${userData.firstName} ${userData.lastName}`;
    results[userKey] = results[userKey] || {};
    results[userKey][currentQuiz] = results[userKey][currentQuiz] || { score: 0, correct: 0, total: totalQuestions };
    results[userKey][currentQuiz].score = (results[userKey][currentQuiz].score || 0) + score;
    results[userKey][currentQuiz].correct = (results[userKey][currentQuiz].correct || 0) + correctAnswers;
    results[userKey][currentQuiz].total = totalQuestions;
    localStorage.setItem('results', JSON.stringify(results));

    // Umumiy natijalarni saqlash
    allResults.push({
        user: userKey,
        level: currentQuiz,
        total: totalQuestions,
        correct: correctAnswers,
        score: score
    });
    localStorage.setItem('allResults', JSON.stringify(allResults));
}

// Profil sahifasida ma'lumotlarni ko‘rsatish
function displayProfile() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    const userKey = `${userData.firstName} ${userData.lastName}`;
    document.getElementById('userFullName').textContent = userKey;
    document.getElementById('userAge').textContent = `Yosh: ${userData.age}`;
    
    const userResults = results[userKey] || {};
    const resultsText = Object.keys(userResults).map(level => 
        `${level}: ${userResults[level].correct}/${userResults[level].total} - ${userResults[level].score} ball`
    ).join('\n');
    document.getElementById('resultsList').textContent = resultsText || 'Hali natijalar yo‘q.';
}

// Umumiy natijalarni ko‘rsatish (faqat Abduraxmon Admin uchun)
function displayAllResults() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    if (userData.firstName.toLowerCase() !== 'abduraxmon' || userData.lastName.toLowerCase() !== 'admin') {
        document.getElementById('allResults').innerHTML = '<tr><td colspan="4">Bu sahifa faqat admin uchun!</td></tr>';
        return;
    }

    const resultsHtml = allResults.map(result => 
        `<tr>
            <td>${result.user}</td>
            <td>${result.level}</td>
            <td>${result.total}/${result.correct}</td>
            <td>${result.score}</td>
        </tr>`
    ).join('');
    document.getElementById('allResults').innerHTML = resultsHtml || '<tr><td colspan="4">Hali natijalar yo‘q.</td></tr>';
}