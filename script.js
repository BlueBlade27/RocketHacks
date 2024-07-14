// Initialize decks array from localStorage or set to empty array
let decks = JSON.parse(localStorage.getItem('decks')) || [];
let currentDeckIndex = -1; // Variable to track the current deck index
let currentCardIndex = 0; // Variable to track the current card index
document.getElementById('backgroundMusic').play(); // Play background music

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
    

    // Event listener for the get started button
    getStartedBtn.addEventListener('click', () => {
        splashScreen.classList.add('hidden');
        mainPage.classList.remove('hidden');
        displayDecks(); // Display decks on the main page
    });

    // Event listener for "About" button
    aboutBtn.addEventListener('click', () => {
        settingsMenu.classList.add('hidden');
        mainPage.classList.add('hidden');
        aboutPage.classList.remove('hidden');
    });

     // Event listener for "Back" button on the About page
     backToSettingsBtn.addEventListener('click', () => {
        aboutPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });

    // Event listener for the settings button
    settingsBtn.addEventListener('click', () => {
        settingsMenu.classList.toggle('hidden');
    });

    // Event listener for "Music Toggle" button
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


    // Event listener for the generate button
    generateBtn.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        inputTitlePage.classList.remove('hidden');
    });

    // Event listener for the continue button
    continueBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (title !== '') {
            createDeck(title);
            inputTitlePage.classList.add('hidden');
            addCardPage.classList.remove('hidden');
            titleInput.value = ''; // Clear the title input
            currentDeckIndex = decks.length - 1; // Update the current deck index
        } else {
            alert('Please enter a title for your deck.');
        }
    });

    // Event listener for the save card button
    saveCardBtn.addEventListener('click', () => {
        const questionInput = document.getElementById('questionInput');
        const answerInput = document.getElementById('answerInput');
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        if (question !== '' && answer !== '') {
            addCardToDeck(currentDeckIndex, { question, answer });
            questionInput.value = ''; // Clear the question input
            answerInput.value = ''; // Clear the answer input
            completeBtn.classList.remove('hidden'); // Show the complete button
        } else {
            alert('Please enter both a question and an answer.');
        }
    });

    // Event listener for the complete button
    completeBtn.addEventListener('click', () => {
        addCardPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        displayDecks(); // Display the updated decks
    });

    // Event listener for the back to main button
    backToMainBtn.addEventListener('click', () => {
        mainPage.classList.remove('hidden');
        librarySection.classList.remove('hidden');
        flashcardsDisplay.classList.add('hidden');
        displayDecks(); // Display the updated decks
    });

    addCardBtn.addEventListener('click', () => {
        // Show input fields and save button
        questionInput.classList.remove('hidden');
        answerInput.classList.remove('hidden');
        saveCardBtn.classList.remove('hidden');

        // Hide the '+' button after it's clicked once
        addCardBtn.classList.add('hidden');
    });

    // Event listener for the previous card button
    prevCardBtn.addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            displayCard(currentDeckIndex, currentCardIndex);
        }
    });

    // Event listener for the next card button
    nextCardBtn.addEventListener('click', () => {
        if (currentCardIndex < decks[currentDeckIndex].cards.length - 1) {
            currentCardIndex++;
            displayCard(currentDeckIndex, currentCardIndex);
        }
    });

    // Event listener for the flip card button
    flipCardBtn.addEventListener('click', () => {
        const flashcard = flashcardsContainerMain.querySelector('.flashcard');
        flashcard.classList.toggle('flipped');
    });

    // Function to create a new deck
    function createDeck(title) {
        const newDeck = {
            title,
            cards: []
        };
        decks.push(newDeck);
        saveDecksToLocalStorage();
        
        // Clear the display of cards
        flashcardsContainer.innerHTML = '';

        // Update currentDeckIndex to the newly created deck
        currentDeckIndex = decks.length - 1;
    }

    // Function to add a card to a deck
    function addCardToDeck(deckIndex, card) {
        decks[deckIndex].cards.push(card);
        saveDecksToLocalStorage();
    }

    // Function to display decks on the main page
    function displayDecks() {
        decksContainer.innerHTML = ''; // Clear the container
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

        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = button.getAttribute('data-index');
                deleteDeck(index);
            });
        });
    }

    // Function to open a deck and display its cards
    function openDeck(deckIndex) {
        currentDeckIndex = deckIndex;
        currentCardIndex = 0;
        mainPage.classList.add('hidden');
        librarySection.classList.add('hidden');
        flashcardsDisplay.classList.remove('hidden');
        displayCard(deckIndex, currentCardIndex); // Display the first card of the deck
    }

    // Function to display a card
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

    // Function to display cards of the current deck
    function displayCards(deckIndex) {
        flashcardsContainer.innerHTML = ''; // Clear the container
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

    // Function to delete a deck
    function deleteDeck(deckIndex) {
        decks.splice(deckIndex, 1);
        saveDecksToLocalStorage();
        displayDecks();
    }

    // Function to save decks to local storage
    function saveDecksToLocalStorage() {
        localStorage.setItem('decks', JSON.stringify(decks));
    }

    // Initial display of decks on page load
    displayDecks();
});
