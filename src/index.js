import './index.css';

const refreshButton = document.querySelector('.refresh');
const submitForm = document.querySelector('form');
const playerNameInput = document.getElementById('player-name');
const playerScoreInput = document.getElementById('player-score');
const scoreList = document.querySelector('.score-list');
const errorContainer = document.createElement('p');

// Base URL of the API
const baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';

// Game ID
const gameId = '4HvEF4wBucZdBh4d2EVo';

const fetchScores = async () => {
  try {
    const response = await fetch(`${baseURL}games/${gameId}/scores`);
    if (!response.ok) {
      throw new Error('Failed to fetch scores');
    }

    scoreList.innerHTML = '';

    const data = await response.json();

    // Iterate over the scores and add them to the score list
    data.result.forEach((score) => {
      const scoreItem = document.createElement('li');
      scoreItem.textContent = `${score.user}: ${score.score}`;
      scoreList.appendChild(scoreItem);
    });

    // Clear error message if it was previously shown
    errorContainer.textContent = '';
  } catch (error) {
    errorContainer.textContent = 'Error fetching scores. Please try again.';
  }
};

const submitScore = async (event) => {
  event.preventDefault();

  const playerName = playerNameInput.value;
  const playerScore = playerScoreInput.value;

  playerNameInput.value = '';
  playerScoreInput.value = '';

  try {
    const response = await fetch(`${baseURL}games/${gameId}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: playerName,
        score: playerScore,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to submit score');
    }

    fetchScores();

    errorContainer.textContent = '';
  } catch (error) {
    errorContainer.textContent = 'Error submitting score. Please try again.';
  }
};

refreshButton.addEventListener('click', fetchScores);
submitForm.addEventListener('submit', submitScore);

fetchScores();

document.body.appendChild(errorContainer);
