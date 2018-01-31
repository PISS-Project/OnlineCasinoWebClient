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
    var selectedValues = getSelectedValues();

    if (selectedValues.length != 1 &&
        selectedValues.length != 2 &&
        selectedValues.length != 3 &&
        selectedValues.length != 4 &&
        selectedValues.length != 6 &&
        selectedValues.length != 12 &&
        selectedValues.length != 18)
    {
        alert("Invalid bet values length!");
        return;
    }

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

            spinTo(spinResult, won);
            
        },
        error: function () { alert('Something went wrong!'); }
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