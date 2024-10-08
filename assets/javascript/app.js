// Select the main app element where content will be loaded
const app = document.getElementById('app');

// Global variables for quiz elements
let questionContainer, scoreContainer, submitButton, quizForm;

// Declare the questions array in the global scope
const questions = [
    {
        question: "What is the most common cast-on technique?",
        answers: [
            { text: "Purl", correct: false },
            { text: "Italian", correct: false },
            { text: "Long-tail", correct: true },
            { text: "Ribbed", correct: false }
        ]
    },
    {
        question: "What is a knitting needle typically made of?",
        answers: [
            { text: "Plastic", correct: true },
            { text: "Glass", correct: false },
            { text: "Wood", correct: true },
            { text: "All of the above", correct: false }
        ]
    },
    {
        question: "What is the name of the yarn loop in knitting?",
        answers: [
            { text: "Knit", correct: false },
            { text: "Stitch", correct: true },
            { text: "Yarn", correct: false },
            { text: "Pattern", correct: false }
        ]
    },
    {
        question: "Which country is known for its traditional colorwork sweaters?",
        answers: [
            { text: "Norway", correct: false },
            { text: "Iceland", correct: false },
            { text: "Scotland", correct: false },
            { text: "All of the above", correct: true }
        ]
    },
];

// Function to dynamically load a page
function loadPage(page) {
    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            app.innerHTML = data;  // Inject the page content into the app container
            
            // Reapply dark mode styles to the new content
            if (localStorage.getItem('theme') === 'dark') {
                applyDarkThemeToElements(app);
            }

            // Now that the new content is loaded, we can attach event listeners
            attachEventListeners(page); // Pass the current page to the event listener function
            updateNavLinks(page);  // Update the navigation links based on the loaded page
        })
        .catch(err => {
            console.error('Failed to load page:', err);
            app.innerHTML = '<p>Page not found.</p>';
        });
}

function updateNavLinks(page) {
    const extraLink = document.getElementById('extra-link');
    extraLink.innerHTML = '';  // Clear any previous links

    // Add different links based on the loaded page
    if (page === 'home') {
        extraLink.innerHTML = `
            <br><a href="#hobbies" class="internal-link">Jump to Hobbies</a> 
            | <a href="#survey" class="internal-link">Jump to Survey</a>
            | <a href="#quiz" class="internal-link">Jump to Quiz</a>`;

            if (localStorage.getItem('theme') === 'dark') {
                applyDarkThemeToElements(extraLink);
            } 
    } else {
        extraLink.innerHTML = '';  // No extra links on home or contact pages
    }

    // Attach event listeners to external nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);  // Load the appropriate page based on the link
            history.pushState({ page }, null, `#${page}`);  // Update URL without reloading the page
        });
    });

    // Attach event listeners to internal links
    document.querySelectorAll('.internal-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);  // Remove the '#' to get the ID
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll to the target section
            }
        });
    });
}

// Load the initial page based on the URL hash when the page first loads
window.addEventListener('load', () => {
    const initialPage = window.location.hash.replace('#', '') || 'home';  // Default to home if no hash
    loadPage(initialPage);
});

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    const page = event.state?.page || 'home';
    loadPage(page);
});

// MODE TOGGLE
document.addEventListener("DOMContentLoaded", () => {
    const lightThemeButton = document.getElementById('light-theme');
    const darkThemeButton = document.getElementById('dark-theme');

    function applyLightTheme() {
        document.body.classList.remove('dark-theme');
        
        // Remove dark-theme class from all necessary elements
        const elementsToLightTheme = document.querySelectorAll('body, nav, header, h1, h2, h3, h4, a, form, input, button, div, p');
        elementsToLightTheme.forEach(element => {
            element.classList.remove('dark-theme');
        });

        localStorage.setItem('theme', 'light');
    }

    function applyDarkTheme() {
        document.body.classList.add('dark-theme');

        // Add dark-theme class to all necessary elements
        const elementsToDarkTheme = document.querySelectorAll('body, nav, header, h1, h2, h3, h4, a, form, input, button, div, p');
        elementsToDarkTheme.forEach(element => {
            element.classList.add('dark-theme');
        });

        localStorage.setItem('theme', 'dark');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyDarkTheme(); 
    } else {
        applyLightTheme();
    }

    lightThemeButton.addEventListener('click', (event) => {
        event.preventDefault();
        applyLightTheme();
    });

    darkThemeButton.addEventListener('click', (event) => {
        event.preventDefault();
        applyDarkTheme();
    });

    // Listen for navigation link clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('data-page');
            loadPage(page);  // Load the appropriate page based on the link
            history.pushState({ page }, null, `#${page}`);  // Update URL without reloading the page
        });
    });
});

// Function to apply dark theme styles to elements
function applyDarkThemeToElements(container) {
    const elementsToDarkTheme = container.querySelectorAll('body, nav, header, h1, h2, h3, h4, a, form, input, button, div, p');
    elementsToDarkTheme.forEach(element => {
        element.classList.add('dark-theme');
    });
}

// Function to attach event listeners
function attachEventListeners(page) {
    // Get references to the quiz elements only if on the home page
    if (page === 'home') {
        questionContainer = document.getElementById('question-container');
        scoreContainer = document.getElementById('score-container');
        submitButton = document.getElementById('submit-button');
        quizForm = document.getElementById('quiz-form'); // Get quizForm reference

        // Knitting form event listener
        const knittingForm = document.getElementById('knittingForm');
        if (knittingForm) {
            knittingForm.addEventListener('submit', (event) => {
                event.preventDefault();
                alert('Thanks for your feedback!');
                knittingForm.reset();
            });
        } else {
            console.error('Knitting form not found!');
        }

        // Setup the quiz form
        if (quizForm) {
            quizForm.addEventListener('submit', (event) => {
                event.preventDefault();
                let score = 0;

                // Calculate the score
                questions.forEach((question, index) => {
                    const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
                    if (selectedAnswer && selectedAnswer.value === "true") {
                        score++;
                    }
                });

                // Hide the questions and the submit button, then display the score
                questionContainer.style.display = 'none';
                submitButton.style.display = 'none'; 
                scoreContainer.style.display = 'block'; 
                document.getElementById('score').innerText = `${score} out of ${questions.length}`;
            });
        } else {
            console.error('Quiz form not found!');
        }

        // Restart the quiz
        const restartButton = document.getElementById('restart-button');
        if (restartButton) {
            restartButton.addEventListener('click', () => {
                scoreContainer.style.display = 'none';
                showQuestions(); 
                if (localStorage.getItem('theme') === 'dark') {
                    applyDarkThemeToElements(questionContainer);
                }
            });
        } else {
            console.error('Restart button not found!');
        }

        // Load the questions initially with the appropriate theme
        showQuestions(); 
    }
}

function showQuestions() {
    questionContainer.innerHTML = ''; // Clear previous content

    questions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionText = document.createElement('h4');
        questionText.innerText = `${index + 1}. ${question.question}`;
        questionElement.appendChild(questionText);

        question.answers.forEach((answer) => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="radio" name="question${index}" value="${answer.correct}">
                ${answer.text}
            `;
            questionElement.appendChild(label);
            questionElement.appendChild(document.createElement('br')); // Line break
        });

        questionContainer.appendChild(questionElement);
    });

    // Check for dark theme and apply it to the questions
    if (localStorage.getItem('theme') === 'dark') {
        applyDarkThemeToElements(questionContainer);
    }

    questionContainer.style.display = 'block'; // Ensure container is visible
    submitButton.style.display = 'block'; // Show submit button
}