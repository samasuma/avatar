document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.getElementById('cardsContainer');
    const pagination = document.getElementById('pagination');
    const createCardButton = document.getElementById('createCardButton');
    const modal = document.getElementById('modal-create-card');
    const cardForm = document.getElementById('cardForm');
    const cardTitleInput = document.getElementById('cardTitle');
    const cardContentInput = document.getElementById('cardContent');
    const saveCardButton = document.getElementById('saveCardButton');

    let currentList = []; // Array to hold current list of cards
    let currentPage = 1; // Current page number
    let cardsPerPage = 5; // Number of cards per page

    // Fetch cards data from JSON file or initialize an empty array
    axios.get('cards.json')
        .then(response => {
            currentList = response.data.cards || []; // Assign fetched data to currentList
            renderCards(); // Render cards after fetching data
        })
        .catch(error => console.error('Error fetching cards data:', error));

    // Function to render cards based on currentList and pagination
    function renderCards() {
        cardsContainer.innerHTML = ''; // Clear previous cards

        // Calculate start and end indices for current page
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;

        // Slice the currentList to get cards for the current page
        const cardsToRender = currentList.slice(startIndex, endIndex);

        // Iterate over cards to create HTML elements
        cardsToRender.forEach(card => {
            const cardElement = createCardElement(card);
            cardsContainer.appendChild(cardElement);
        });

        // Render pagination controls
        renderPagination();
    }

    // Function to create a single card element
    function createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = card.title;

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = card.content;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardDiv.appendChild(cardInner);

        // Add click event listener to flip the card
        cardDiv.addEventListener('click', function () {
            cardDiv.classList.toggle('flip');
        });

        return cardDiv;
    }

    // Function to render pagination controls
    function renderPagination() {
        pagination.innerHTML = ''; // Clear previous pagination controls

        const totalPages = Math.ceil(currentList.length / cardsPerPage);

        // Previous page button
        const prevButton = createPaginationButton('Prev');
        prevButton.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                renderCards();
            }
        });
        pagination.appendChild(prevButton);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i.toString());
            pageButton.addEventListener('click', function () {
                currentPage = i;
                renderCards();
            });
            pagination.appendChild(pageButton);
        }

        // Next page button
        const nextButton = createPaginationButton('Next');
        nextButton.addEventListener('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderCards();
            }
        });
        pagination.appendChild(nextButton);
    }

    // Helper function to create pagination button
    function createPaginationButton(label) {
        const li = document.createElement('li');
        const button = document.createElement('a');
        button.href = '#';
        button.textContent = label;
        li.appendChild(button);
        return li;
    }

    // Open modal and set up form for creating/editing cards
    createCardButton.addEventListener('click', function () {
        UIkit.modal(modal).show();

        // Reset form inputs
        cardTitleInput.value = '';
        cardContentInput.value = '';
        saveCardButton.textContent = 'Save Card';

        // Handle form submission for creating/editing cards
        cardForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const title = cardTitleInput.value.trim();
            const content = cardContentInput.value.trim();

            if (!title || !content) {
                alert('Please enter both title and content for the card.');
                return;
            }

            // Check if we are creating a new card or editing an existing one
            const existingCardIndex = currentList.findIndex(card => card.title === title);
            if (existingCardIndex !== -1) {
                // Edit existing card
                currentList[existingCardIndex].content = content;
            } else {
                // Create new card
                currentList.push({ title, content });
            }

            // Save updated list to local storage or backend (e.g., JSON file)
            // For demonstration purposes, we'll just log the updated list
            console.log('Updated Card List:', currentList);

            // Close modal and re-render cards
            UIkit.modal(modal).hide();
            renderCards();
        });
    });
});
