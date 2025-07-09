const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const perguntarAi = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash";
    const geminiURL = `
        https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}
    `;

    const pergunta = `
        olha, tenho esse jogo ${game} e queria saber ${question}
    `;

    const contents = [{
        parts: [{
            text: pergunta
        }]
    }];

    //chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
        }),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};

const enviarForm = async () => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if(apiKey == '' || game == '' || question == '') {
        alert('Preecha os campos');
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add('loading');

    try {
        const text = await perguntarAi(question, game, apiKey);

        aiResponse.querySelector('.response-content').innerHTML = text;
        aiResponse.classList.remove('hidden');

    } catch (error) {
        console.log('Erro: ', error);
    } finally {

        askButton.disabled = false;
        askButton.textContent = 'Perguntar';
        askButton.classList.remove('loading');
    }
}

form.addEventListener('submit', enviarForm);
