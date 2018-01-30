function changeBetAmount(amount) {
    var changeAmount = parseInt(amount);
    var betAmount = parseInt(document.getElementById("betAmount").innerText);
    if (betAmount + changeAmount < 0) {
        betAmount = 0;
    }
    else { betAmount = betAmount + changeAmount }
    document.getElementById("betAmount").innerText = betAmount;
}

function sendRouletteBet() {
    var betAmount = parseInt(document.getElementById("betAmount").innerText);
    if (betAmount <= 0) { alert("Invalid bet amount"); return; }
    else {
        verifyBet();
        alert("Bet Sent");
    }
}

function verifyBet() {
    var winningNum = 12;
    
    spinTo(winningNum);
}