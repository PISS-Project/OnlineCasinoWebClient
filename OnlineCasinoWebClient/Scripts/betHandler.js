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
            generateAlert("Invalid bet amount!", "info");
            return;
        }
        else if (!canBet(betAmount)) {
            generateAlert("Insufficient balance!", "warning");
            return;
        }
        else if (betSum >= 2 && betSum <= 12) {
            $("#betButton").prop("disabled", true);
            
            var userId = Cookies.get("userId");
            var userToken = Cookies.get("token");

            var betJson = {
                "bet": betSum,
                "stake": betAmount
            };

            $.ajax({
                url: domainName + "api/users/" + userId + "/dicebets",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(betJson),
                headers: { "OnlineCasino-Token": userToken },
                success: function (data) {

                    var rollNumber = data.actualRoll;

                    var dice1Num = 0;
                    var dice2Num = 0;
                    while (dice1Num + dice2Num != rollNumber) {
                        dice1Num = Math.floor(Math.random() * 6) + 1;
                        dice2Num = Math.floor(Math.random() * 6) + 1;
                    }

                    var won = !(data.win == 0);

                    // Roll the dice
                    showDiceResult(dice1Num, dice2Num, won, data.win, data.stake);
                },
                error: function () {
                    generateAlert("Something went wrong!", "danger");
                    $("#betButton").prop("disabled", false);
                }
            });

            startRolling();
        }
        else {
            generateAlert("Fuck you!", "success");
        }
    }
    else {
        generateAlert("Please select dice sum!", "info");
    }
}

function sendRouletteBet() {
    var betAmount = parseInt(document.getElementById("betAmount").innerText);
    if (betAmount <= 0) {
        generateAlert("Please make a bet with valid amount!", "info");
        return;
    } else if (!canBet(betAmount)) {
        generateAlert("Insufficient balance!", "warning");
        return;
    }


    var selectedValues = getSelectedValues();

    if (selectedValues.length != 1 &&
        selectedValues.length != 2 &&
        selectedValues.length != 3 &&
        selectedValues.length != 4 &&
        selectedValues.length != 6 &&
        selectedValues.length != 12 &&
        selectedValues.length != 18) {
        generateAlert("Please select a valid bet!", "info");
        return;
    }

    $("#betButton").prop("disabled", true);

    var userId = Cookies.get("userId");
    var userToken = Cookies.get("token");

    var betJson = {
        "betValues": selectedValues,
        "stake": betAmount
    };

    $.ajax({
        url: domainName + "api/users/" + userId + "/roulettebets",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(betJson),
        headers: { "OnlineCasino-Token": userToken },
        success: function (data) {

            var spinResult = data.spinResult;
            var won = !(data.win == 0);

            spinTo(spinResult, won, data.win, data.stake);
        },
        error: function () {
            generateAlert("Something went wrong!", "danger");
            $("#betButton").prop("disabled", false);
        }
    });
}

function getSelectedValues() {
    var selectedValues = [];
    Array.from($(".tnum")).forEach(function (item) {
        if ($(item).hasClass("active")) {
            selectedValues.push(item.innerText.trim());
        }
    });

    var intValues = selectedValues.map(function (item) {
        return parseInt(item, 10);
    });
    intValues.sort(function (a, b) { return a - b; });
    return intValues;
}

function updateMoneyAmount(won, win, stake) {
    $("#betButton").prop("disabled", false);

    var savedUserMoney = parseFloat($("#userMoney").text().split(",").join(""));
    var winAmount = parseFloat(win) - parseFloat(stake);
    var stakeAmount = parseFloat(stake);

    if (won) {
        savedUserMoney = savedUserMoney + winAmount;
        notifyForBetResult(" You won " + winAmount + "!", "success" );
    }
    else {
        savedUserMoney = savedUserMoney + (stakeAmount * -1);
        notifyForBetResult(" You lost " + stakeAmount + "!", "danger");
    }

    document.getElementById("userMoney").innerText = savedUserMoney.toLocaleString("en");
}

function canBet(betAmount) {
    var savedUserMoney = parseFloat($("#userMoney").text().split(",").join(""));

    return betAmount <= savedUserMoney;
}
