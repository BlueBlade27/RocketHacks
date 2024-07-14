
let decks = JSON.parse(localStorage.getItem('decks')) || [];
let currentDeckIndex = -1; 
let currentCardIndex = 0; 
document.getElementById('backgroundMusic').play(); 

document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainPage = document.getElementById('main-page');
    const inputTitlePage = document.getElementById('inputTitlePage');
    const addCardPage = document.getElementById('addCardPage');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const continueBtn = document.getElementById('continueBtn');
    const backtoMainPgBtn = document.getElementById('backtoMainPgBtn');
    const generateBtn = document.getElementById('generateBtn');
    const addCardBtn = document.getElementById('addCardBtn');
    const saveCardBtn = document.getElementById('saveCardBtn');
    const completeBtn = document.getElementById('completeBtn');
    const backToMainBtn = document.getElementById('backToMainBtn');
    const prevCardBtn = document.getElementById('prevCardBtn');
    const nextCardBtn = document.getElementById('nextCardBtn');
    const flipCardBtn = document.getElementById('flipCardBtn');
    const titleInput = document.getElementById('titleInput');
    const flashcardsContainerMain = document.getElementById('flashcardsContainerMain');
    const flashcardsContainer = document.getElementById('flashcardsContainer');
    const cardForm = document.getElementById('cardForm');
    const librarySection = document.getElementById('librarySection');
    const decksContainer = document.getElementById('decksContainer');
    const flashcard = flashcardsContainerMain.querySelector('.flashcard');
    const aboutBtn = document.getElementById('aboutBtn');
    const backToSettingsBtn = document.getElementById('backToSettingsBtn');
    const aboutPage = document.getElementById('aboutPage');
    

    getStartedBtn.addEventListener('click', () => {
        splashScreen.classList.add('hidden');
        mainPage.classList.remove('hidden');
        displayDecks(); 
    });

    aboutBtn.addEventListener('click', () => {
        settingsMenu.classList.add('hidden');
        mainPage.classList.add('hidden');
        aboutPage.classList.remove('hidden');
    });

     backToSettingsBtn.addEventListener('click', () => {
        aboutPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });

    settingsBtn.addEventListener('click', () => {
        settingsMenu.classList.toggle('hidden');
    });

    document.getElementById('musicToggleBtn').addEventListener('click', function() {
        let music = document.getElementById('backgroundMusic');
        if (music.paused) {
            music.play();
            this.textContent = 'Music: On';
        } else {
            music.pause();
            this.textContent = 'Music: Off';
        }
    });

    backtoMainPgBtn.addEventListener('click', () => {
        inputTitlePage.classList.add('hidden');
        mainPage.classList.remove('hidden');        
    });


    generateBtn.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        inputTitlePage.classList.remove('hidden');
    });

    continueBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (title !== '') {
            createDeck(title);
            inputTitlePage.classList.add('hidden');
            addCardPage.classList.remove('hidden');
            titleInput.value = ''; 
            currentDeckIndex = decks.length - 1; 
        } else {
            alert('Please enter a title for your deck.');
        }
    });

    saveCardBtn.addEventListener('click', () => {
        const questionInput = document.getElementById('questionInput');
        const answerInput = document.getElementById('answerInput');
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        if (question !== '' && answer !== '') {
            addCardToDeck(currentDeckIndex, { question, answer });
            questionInput.value = ''; 
            answerInput.value = ''; 
            completeBtn.classList.remove('hidden'); 
        } else {
            alert('Please enter both a question and an answer.');
        }
    });

    completeBtn.addEventListener('click', () => {
        addCardPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        displayDecks(); 
    });

    backToMainBtn.addEventListener('click', () => {
        mainPage.classList.remove('hidden');
        librarySection.classList.remove('hidden');
        flashcardsDisplay.classList.add('hidden');
        displayDecks(); 
    });

    addCardBtn.addEventListener('click', () => {
        questionInput.classList.remove('hidden');
        answerInput.classList.remove('hidden');
        saveCardBtn.classList.remove('hidden');

        addCardBtn.classList.add('hidden');
    });

    prevCardBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            displayCard(currentDeckIndex, currentCardIndex);
        }
    });

    nextCardBtn.addEventListener('click', () => {
        if (currentCardIndex < decks[currentDeckIndex].cards.length - 1) {
            currentCardIndex++;
            displayCard(currentDeckIndex, currentCardIndex);
        }
    });

    flipCardBtn.addEventListener('click', () => {
        const flashcard = flashcardsContainerMain.querySelector('.flashcard');
        flashcard.classList.toggle('flipped');
    });

    function createDeck(title) {
        const newDeck = {
            title,
            cards: []
        };
        decks.push(newDeck);
        saveDecksToLocalStorage();
        
        flashcardsContainer.innerHTML = '';

        currentDeckIndex = decks.length - 1;
    }

    function addCardToDeck(deckIndex, card) {
        decks[deckIndex].cards.push(card);
        saveDecksToLocalStorage();
    }

    function displayDecks() {
        decksContainer.innerHTML = ''; 
        decks.forEach((deck, index) => {
            const deckElement = document.createElement('div');
            deckElement.className = 'deck';
            deckElement.innerHTML = `
                <span>${deck.title}</span>
                <button class="delete-btn" data-index="${index}">x</button>
            `;
            deckElement.addEventListener('click', () => {
                openDeck(index);
            });
            decksContainer.appendChild(deckElement);
        });

        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = button.getAttribute('data-index');
                deleteDeck(index);
            });
        });
    }

    function openDeck(deckIndex) {
        currentDeckIndex = deckIndex;
        currentCardIndex = 0;
        mainPage.classList.add('hidden');
        librarySection.classList.add('hidden');
        flashcardsDisplay.classList.remove('hidden');
        displayCard(deckIndex, currentCardIndex); 
    }

    function displayCard(deckIndex, cardIndex) {
        const deck = decks[deckIndex];
        const card = deck.cards[cardIndex];
        flashcardsContainerMain.innerHTML = `
            <div class="flashcard">
                <div class="card-front">${card.question}</div>
                <div class="card-back">${card.answer}</div>
            </div>
        `;
    }

    function displayCards(deckIndex) {
        flashcardsContainer.innerHTML = ''; 
        const deck = decks[deckIndex];
        deck.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'flashcard';
            cardElement.innerHTML = `
                <div class="card-front">${card.question}</div>
                <div class="card-back">${card.answer}</div>
            `;
            flashcardsContainer.appendChild(cardElement);
        });
    }

    function deleteDeck(deckIndex) {
        decks.splice(deckIndex, 1);
        saveDecksToLocalStorage();
        displayDecks();
    }

    function saveDecksToLocalStorage() {
        localStorage.setItem('decks', JSON.stringify(decks));
    }

    displayDecks();
});
