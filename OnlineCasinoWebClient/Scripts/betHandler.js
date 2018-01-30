function changeBetAmount(amount) {
    var changeAmount = parseInt(amount);
    var betAmount = parseInt(document.getElementById("betAmount").innerText);
    if (betAmount + changeAmount < 0) {
        betAmount = 0;
    }
    else { betAmount = betAmount + changeAmount }
    document.getElementById("betAmount").innerText = betAmount;
}

function sendDiceBet() {
    var betAmount = parseInt(document.getElementById("betAmount").innerText);
    var selectedElement;
    Array.from($('#bets-wrapper').children('div')).forEach(function (item) {
        if ($(item).hasClass("active")) {
            selectedElement = item.innerText;
        }
    });

    if (typeof selectedElement != 'undefined') {

        var betSum = parseInt(selectedElement);        
        if (betAmount <= 0) {
            alert("Invalid bet amount!");
            return;
        }
        else if (betSum >= 2 && betSum <= 12) {

            var userId = $("#userSecret").text();
            var userToken = $("#userTSecret").text();

            var betJson = {
                "bet": betSum,
                "stake": betAmount
            };

            
            $.ajax({
                url: domainName + "api/users/" + userId + "/dicebets",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(betJson),
                headers: { "OnlineCasino-Token": userToken},
                success: function (data) {
                    //Magic
                    var rollNumber = betSum;
                    if (data.win == 0) {
                        while (rollNumber == betSum) {
                            rollNumber = Math.floor(Math.random() * 11) + 2;
                        }
                    }

                    var dice1Num = 0;
                    var dice2Num = 0;
                    while (dice1Num + dice2Num != rollNumber) {
                        dice1Num = Math.floor(Math.random() * 6) + 1;
                        dice2Num = Math.floor(Math.random() * 6) + 1;
                    }

                    var won = !(data.win == 0);

                    // Roll the dice
                    showDiceResult(dice1Num, dice2Num, won);
                },
                error: function () { alert('Something went wrong!'); }
            });

            startRolling();
        }
        else {
            alert("Fuck you!");
        }
    }
    else {
        alert("Please select dice sum!");
    }
}

function makeDiceRoll(rollNumber) {
    
}


function sendRouletteBet() {
    var betAmount = parseInt(document.getElementById("betAmount").innerText);
    if (betAmount <= 0) { alert("Invalid bet amount!"); return; }
    else {
        verifyBet();
        alert("Bet Sent");
    }
}

function verifyBet() {
    var winningNum = 12;
    
    spinTo(winningNum);
}