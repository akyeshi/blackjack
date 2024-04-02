// Define the suits and ranks of the cards
const suits = ["♥", "♦", "♣", "♠"];
const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

// Create a deck of 52 cards (array of card objects)
function createDeck() {
  const deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push({ suit: suits[i], rank: ranks[j] });
    }
  }
  // console.log(deck)
  return deck;
}

// Deal a random card from the deck (of 52 cards)
function dealCard(deck) {
  return deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
}

// Calculate the value of a hand
function calculateHandValue(hand) {
  let value = 0;
  let hasAce = false;
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].rank === "A") {
      hasAce = true;
      value += 11;
    } else if (["J", "Q", "K"].includes(hand[i].rank)) {
      value += 10;
    } else {
      value += parseInt(hand[i].rank);
    }
  }
  if (hasAce && value > 21) {
    value -= 10;
  }
  return value;
}

// Game logic
let deck = createDeck();
let playerHand = [];
let dealerHand = [];
let result = "";

// Deal the initial cards
function dealInitialCards() {
  playerHand = [];
  dealerHand = [];
  playerHand.push(dealCard(deck));
  dealerHand.push(dealCard(deck));
  playerHand.push(dealCard(deck));
  dealerHand.push(dealCard(deck));
  updateGameState();
}

// Update the game state
function updateGameState() {
  const playerHandElement = document.getElementById("player-hand");
  const dealerHandElement = document.getElementById("dealer-hand");
  const resultElement = document.getElementById("result");

  playerHandElement.innerHTML = "";
  dealerHandElement.innerHTML = "";

  for (let i = 0; i < playerHand.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = `${playerHand[i].rank}${playerHand[i].suit}`;
    playerHandElement.appendChild(card);
  }

  for (let i = 0; i < dealerHand.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = `${dealerHand[i].rank}${dealerHand[i].suit}`;
    dealerHandElement.appendChild(card);
  }

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  if (playerValue > 21) {
    result = "Bust! You lose.";
    resultElement.textContent = result;
  } else if (playerValue === 21 && playerHand.length === 2) {
    result = "Blackjack! You win!";
    resultElement.textContent = result;
  } else {
    resultElement.textContent = "";
  }
}

// Event listeners
document.getElementById("hit").addEventListener("click", () => {
  playerHand.push(dealCard(deck));
  updateGameState();
  determineWinner();
});

document.getElementById("stand").addEventListener("click", () => {
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(dealCard(deck));
  }
  updateGameState();
  determineWinner();
});

document.getElementById("deal").addEventListener("click", () => {
  deck = createDeck();
  dealInitialCards();
  document.getElementById("result").textContent = "";
});

// Determine the winner
function determineWinner() {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  const resultElement = document.getElementById("result");

  if (playerValue > 21) {
    result = "Bust! You lose.";
  } else if (dealerValue > 21) {
    result = "Dealer busts! You win.";
  } else if (playerValue === dealerValue) {
    result = "It's a push.";
  } else if (playerValue > dealerValue) {
    result = "You win!";
  } else {
    result = "Dealer wins.";
  }

  resultElement.textContent = result;
}

// Start the game
dealInitialCards();
