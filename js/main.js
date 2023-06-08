run.addEventListener('click', () => {
    const message = document.getElementById('message');
    console.log(message.value);

    
    let factors = message.value.split('\n')
    if (factors[factors.length - 1] == '') {
        factors.pop();
    }
    if (factors.length < 2) {
        factors = [ "Фактор 1", "Фактор 2", "Фактор 3", "Фактор 4"];
    }
    
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');

    section1.classList.add("hide");
    section2.classList.remove("hide");
   
    function getQuizData(factors) {
        const result = [];
        for (let i = 0; i <= factors.length - 1; i++) {
            for (let j = i + 1; j < factors.length; j++) {
            let temp = {
                question: "Выберите фактор, который Вам кажется важнее!",
                a: factors[i],
                b: factors[j],
                c: "Равнозначны!",
                x: i,
                y: j,
            }
            result.push(temp);
            }
        }
        return result;
    }
    
    //console.log(getQuizData(factors));
    
    const quizData = getQuizData(factors);
    
    let output = [];
    
    for (let i = 0; i < factors.length; i++) {
        output[i] = []; // создаем подмассив
    
        for (let j = 0; j < factors.length; j++) {
            output[i].push('-'); // заполняем подмассив числами
        }
    }
    
    const quiz = document.getElementById('quiz');
    const answerElements = document.querySelectorAll('.answer');
    const questionElement = document.getElementById('question');
    const a_text = document.getElementById('a_text');
    const b_text = document.getElementById('b_text');
    const c_text = document.getElementById('c_text');
    const submit = document.getElementById('submit');
    
    let currentQuiz = 0;
    let score = 0;
    
    loadQuiz();
    
    function loadQuiz() {
        deselectAnswers();
    
        const currentQuizData = quizData[currentQuiz];
    
        questionElement.innerText = currentQuizData.question;
        a_text.innerText = currentQuizData.a;
        b_text.innerText = currentQuizData.b;
        c_text.innerText = currentQuizData.c;
    }
    
    function deselectAnswers(){
        answerElements.forEach(answerEl => answerEl.checked = false)
    }
    
    function isNumber(num) {
        return typeof num === 'number' && !isNaN(num);
    }
    
    function getResultArray(output) {
        const result = [];
        for (let i = 0; i < output.length; i++) {
            temp = 0;
            for (let j = 0; j < output.length; j++) {
                if (isNumber(output[i][j])) {
                temp += output[i][j];
                }
            }
            result.push(temp)
        } 
        return result;
    }
    
    function getSelected(){
        let answer;
    
        answerElements.forEach(answerEl => {
            if(answerEl.checked){
                answer = answerEl.id;
            }
        });
    
        return answer;
    }
    submit.addEventListener('click', () => {
        const answer = getSelected();
    
        if(answer){
            if(answer === 'a'){
                output[Number(quizData[currentQuiz]['x'])][Number(quizData[currentQuiz]['y'])] = 1;
                output[Number(quizData[currentQuiz]['y'])][Number(quizData[currentQuiz]['x'])] = 0;
            }  else if ( answer === 'b') {
                output[Number(quizData[currentQuiz]['x'])][Number(quizData[currentQuiz]['y'])] = 0;
                output[Number(quizData[currentQuiz]['y'])][Number(quizData[currentQuiz]['x'])] = 1;
            } else {
                output[Number(quizData[currentQuiz]['x'])][Number(quizData[currentQuiz]['y'])] = 0.5;
                output[Number(quizData[currentQuiz]['y'])][Number(quizData[currentQuiz]['x'])] = 0.5;
            }
    
            currentQuiz++;
    
            if(currentQuiz < quizData.length){
                loadQuiz();
            }
        
            else {
                const resultArr = getResultArray(output);
                quiz.innerHTML = `<h2>Итоговая таблица</h2>
                    <div class="wrapper"></div>
                    <div class="wrapper-desc"></div>
                    <button onclick="location.reload(); return false;">Reload</button>
                `;
            
                let s = `<div class="divTable"><div class="divTableHeading"><div class="divTableRow">`;
                s += `<div class="divTableHead"> </div>`
                for (let i = 1; i < output.length + 1; i++) {
                    s += `<div class="divTableHead">x<sub>${i}</sub></div>`
                }
                s += `<div class="divTableHead"> Сумма </div>`
                s += `</div></div><div class="divTableBody">`;
                for (let i = 0; i < output.length; i++) {
                    s += `<div class="divTableRow">`;
                    for (let j = 0; j < output.length; j++) {
                        if (j == 0) {
                            s += `<div class="divTableCell">x<sub>${i + 1}</sub></div>`;
                        }
                        s += `<div class="divTableCell">${output[i][j]}</div>`;
                        if (j == output.length - 1) {
                            s += `<div class="divTableCell">${resultArr[i]}</div>`;
                        }
                    }
                    s += `</div>`;
                }
    
                s += `</div></div>`;
                
                let t = '';
                for (let i = 1; i < output.length + 1; i++) {
                    t += `<div>x<sub>${i}</sub> - ${factors[i - 1]}</div>`
                }
    
                document.querySelector(".wrapper").insertAdjacentHTML("beforeend", s);
                document.querySelector(".wrapper-desc").insertAdjacentHTML("beforeend", t);
            }
        }
    });
        
});

