// Define the suits and ranks of the cards
const suits = ["♥", "⬥", "♣", "♠"];
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

// Create a deck of 52 cards (array of card objects): [{suit, rank}, {suit, rank} ...]
function createDeck() {
  const deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push({ suit: suits[i], rank: ranks[j] });
    }
  }
  // console.log(deck);
  return deck;
}

// Deal a random card from the deck (of 52 cards)
function dealCard(deck) {
  // splice returns a modified or mutated array of deckcard-objects
  return deck.splice(Math.floor(Math.random() * deck.length), 1)[0];
}

// Calculate the value of a hand
// const x = calculateHandValue([{suit: '♥', rank: '8'}, {suit: '♦', rank: 'A'}]);
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
  // let ace value be 1, so player's hand will be below 21
  if (hasAce && value > 21) {
    value -= 10;
  }
  return value;
}

// State variables
let deck = createDeck();
let playerHand = [];
let dealerHand = [];
let result = "";
let playerBankRoll = 1000;
let bettingTotal = 0;
let gameInProgress = false;

// Deal the initial cards
function dealInitialCards() {
  dealerHand = [];
  playerHand = []; // way to reset to 2 cards when 'deal' button is clicked
  dealerHand.push(dealCard(deck));
  playerHand.push(dealCard(deck)); // never two cards of the same suit/rank will be dealt
  dealerHand.push(dealCard(deck));
  playerHand.push(dealCard(deck));
  updateGameState();

  console.log(`dealer's hand: ${dealerHand[0].rank}${dealerHand[0].suit}`);
  console.log(`player's hand: ${playerHand[0].rank}${playerHand[1].suit}`);

  gameInProgress = true;
  disableButtons();
  // enableButtons();
}

// Update the game state ---------------------------------------------
function updateGameState() {
  const playerHandElement = document.getElementById("player-hand");
  const dealerHandElement = document.getElementById("dealer-hand");
  const resultElement = document.getElementById("result");

  dealerHandElement.innerHTML = "";
  playerHandElement.innerHTML = "";

  for (let i = 0; i < dealerHand.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = `${dealerHand[i].rank}${dealerHand[i].suit}`;

    // if (i == 0){
    //   card.textContent = `${dealerHand[i].rank}${dealerHand[i].suit}`;
    // } else if (i === 1){
    //   card.textContent = `<❓>`;
    // }

    dealerHandElement.appendChild(card);
  }

  for (let i = 0; i < playerHand.length; i++) {
    // console.log("playerhand: ", playerHand);
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = `${playerHand[i].rank}${playerHand[i].suit}`;
    playerHandElement.appendChild(card);
  }

  // comment out below this line
  // const playerValue = calculateHandValue(playerHand);
  // const dealerValue = calculateHandValue(dealerHand);

  // if (playerValue > 21) {
  //   result = "Bust! You lose.";
  //   resultElement.textContent = result;
  //   disableButtons();
  // } else if (playerValue === 21 && playerHand.length === 2) {
  //   result = "Blackjack! You win!";
  //   resultElement.textContent = result;
  //   disableButtons();
  // } else {
  //   resultElement.textContent = "";
  // }
}

// Determine the winner ------------------------------------
function determineWinner() {
  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);
  const resultElement = document.getElementById("result");

  if (playerValue > 21) {
    bettingTotal = 0;
    document.querySelector("span#chip-bet").textContent = bettingTotal;
    document.querySelector("span#bankroll").textContent = playerBankRoll;
    result = "Bust! You lose.";
  } else if (dealerValue > 21) {
    playerBankRoll += bettingTotal * 2;
    bettingTotal = 0;
    document.querySelector("span#chip-bet").textContent = bettingTotal;
    document.querySelector("span#bankroll").textContent = playerBankRoll;
    result = "Dealer busts! You win.";
  } else if (playerValue === dealerValue) {
    bettingTotal = 0;
    document.querySelector("span#chip-bet").textContent = bettingTotal;
    result = "It's a push.";
  } else if (playerValue > dealerValue) {
    playerBankRoll += bettingTotal * 2;
    bettingTotal = 0;
    document.querySelector("span#chip-bet").textContent = bettingTotal;
    document.querySelector("span#bankroll").textContent = playerBankRoll;
    result = "You win!";
  } else {
    bettingTotal = 0;
    document.querySelector("span#chip-bet").textContent = bettingTotal;
    document.querySelector("span#bankroll").textContent = playerBankRoll;
    result = "Dealer wins.";
  }

  resultElement.textContent = result;
  disableChipBtns();
  disableButtons();
}

// bet chip and check if player has enough to bet ----------------------
function betChip(chipValue) {
  bettingTotal += chipValue;
  playerBankRoll -= chipValue;
  checkBetAmount(chipValue);
  document.getElementById("chip-bet").textContent = bettingTotal;
  document.getElementById("bankroll").textContent = playerBankRoll;
  if (bettingTotal > 0) enableButtons();
}

function checkBetAmount(betAmount) {
  if (playerBankRoll === 0 && betAmount > playerBankRoll) {
    document.querySelectorAll("#chips button").forEach((button) => {
      button.disabled = true;
    });
    alert("You no longer have funds to continue this addiction ...! Go Home!");
  }
}

// enable and disable buttons ------------------------------------
function enableButtons() {
  document.getElementById("hit").disabled = false;
  document.getElementById("hit").style.cursor = "pointer";
  document.getElementById("stand").disabled = false;
  document.getElementById("stand").style.cursor = "pointer";
  document.getElementById("hit").style.backgroundColor = "white";
  document.getElementById("stand").style.backgroundColor = "white";
}

function disableButtons() {
  document.getElementById("hit").disabled = true;
  document.getElementById("hit").style.cursor = "auto";
  document.getElementById("stand").disabled = true;
  document.getElementById("stand").style.cursor = "auto";
  document.getElementById("hit").style.backgroundColor = "grey";
  document.getElementById("stand").style.backgroundColor = "grey";
}

// enable and disable chip-buttons ------------------------------
function enableChipBtns() {
  document.querySelectorAll(".chipBtn").forEach((button) => {
    button.disabled = false;
    button.style.cursor = "pointer";
  });
}

function disableChipBtns() {
  document.querySelectorAll(".chipBtn").forEach((button) => {
    button.disabled = true;
    button.style.cursor = "not-allowed";
  });
}

// Event listeners ----------------------------------------------
document.getElementById("hit").addEventListener("click", () => {
  playerHand.push(dealCard(deck));
  updateGameState();
  determineWinner();
});

document.getElementById("stand").addEventListener("click", () => {
  const dealerHandElement = document.getElementById("dealer-hand");
  dealerHandElement.innerHTML = "";

  for (let i = 0; i < dealerHand.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = `${dealerHand[i].rank}${dealerHand[i].suit}`;
    dealerHandElement.appendChild(card);
  }
  while (calculateHandValue(dealerHand) < 17) {
    dealerHand.push(dealCard(deck));
  }
  updateGameState();
  determineWinner();
});

document.getElementById("deal").addEventListener("click", () => {
  document.querySelector("span#chip-bet").textContent = 0;
  document.querySelector("span#bankroll").textContent = playerBankRoll;
  deck = createDeck();
  dealInitialCards();
  enableChipBtns();
  document.getElementById("result").textContent = "";
});

document.getElementById("chip-5").addEventListener("click", () => betChip(5));
document.getElementById("chip-10").addEventListener("click", () => betChip(10));
document.getElementById("chip-25").addEventListener("click", () => betChip(25));
document.getElementById("chip-50").addEventListener("click", () => betChip(50));
document
  .getElementById("chip-100")
  .addEventListener("click", () => betChip(100));

// Start the game
dealInitialCards();
