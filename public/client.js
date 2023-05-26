const socket = io();

const formUser = document.querySelector("#formUser");
const inputUser = document.querySelector("#inputUser");
const messages = document.querySelector("#messages");
const formMessage = document.querySelector("#formMessage");
const inputMessage = document.querySelector("#inputMessage");
const userContianer = document.querySelector("#userContainer");
const playButton = document.querySelector("#userPlay");
const result = document.querySelector("#resultPlayer1");
const result2 = document.querySelector("#resultPlayer2");
let dice = document.querySelector("#dice img");

let myUser;
let total = 0;
let total2 = 0;

playButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Kasta tärningen för spelare 1
  let player1Result = rollDice();

  total = player1Result + total;

  console.log(total);

  // Skickar resultat och användarnamn till servern
  socket.emit("gameResult", {
    user: myUser,
    result: player1Result,
    currentTotal: total,
    // skickar tärningsvärdet till servern
    value: player1Result,
  });
});

// Funktion för slumpa tärningskast
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

formUser.addEventListener("submit", function (e) {
  e.preventDefault();
  // hämtar användarnamnet och lagrar i myUser
  myUser = inputUser.value;
  // lägger till Välkommen + användarnamn
  userContianer.innerHTML = "<h2>Välkommen " + myUser + "</h2>";
  // Tar bort user-diven
  document.getElementById("user").style.display = "none";
  // visare message diven
  document.getElementById("message").style.display = "block";
});

formMessage.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log("Submit knapp klickad");
  console.log("Före if-satsen", inputMessage.value);
  if (inputMessage.value) {
    // Skickar
    socket.emit("chatMessage", { user: myUser, message: inputMessage.value });
    // återställer inputfältet
    inputMessage.value = "";
  }
});

// Tar emot
socket.on("newChatMessage", function (msg) {
  if (msg.user && msg.message) {
    let item = document.createElement("li");
    item.textContent = msg.user + ": " + msg.message;
    messages.appendChild(item);
  } else {
    console.log("Ogiltigt meddelande:", msg);
  }
});

// Tar emot
socket.on("newGameResult", function (player) {
  console.log("Meddelande mottaget:", player);
  let item = document.createElement("li");

  item.textContent =
    player.user + ": " + player.result + " totalsumma: " + player.currentTotal;
  result2.appendChild(item);
});

socket.on("diceValue", (value) => {
  if (value === 1) {
    dice.src = "https://www.svgrepo.com/show/177192/dice-dice.svg";
  } else if (value === 2) {
    dice.src = "https://www.svgrepo.com/show/177198/dice-dice.svg";
  } else if (value === 3) {
    dice.src = "https://www.svgrepo.com/show/177189/dice-dice.svg";
  } else if (value === 4) {
    dice.src = "https://www.svgrepo.com/show/177194/dice-dice.svg";
  } else if (value === 5) {
    dice.src = "https://www.svgrepo.com/show/177197/dice-dice.svg";
  } else if (value === 6) {
    dice.src = "https://www.svgrepo.com/show/177191/dice-dice.svg";
  }
});

// Tar emot
socket.on("Winner", function (user) {
  alert(`${user} vann!`);
});
