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
                    showDiceResult(dice1Num, dice2Num, won, data.win, data.stake);
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
        selectedValues.length != 18) {
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

            spinTo(spinResult, won, data.win, data.stake);

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

function generateAlert(message, type) {
    var offsetXCalc = (document.body.getBoundingClientRect().right - $("#userMoney")[0].getBoundingClientRect().right) - 30;

    $.notify({
        // options
        message: message,
        icon: 'glyphicon glyphicon-euro'
    },
        {
            // settings
            type: type,
            allow_dismiss: false,
            offset: {
                x: offsetXCalc,
                y: 55
            },

            z_index: 1031,
            delay: 3000,
            animate: {
                enter: 'animated bounceInRight',
                exit: 'animated bounceOutRight'
            },
            template: '<div data-notify="container" class="alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            '</div>'

        });
}

function updateMoneyAmount(won, win, stake) {
    var savedUserMoney = parseFloat($("#userMoney").text().replace(",", ""));
    var winAmount = parseFloat(win) - parseFloat(stake);
    var stakeAmount = parseFloat(stake);

    if (won) {
        savedUserMoney = savedUserMoney + winAmount;
        generateAlert(" You won " + winAmount + "!", "success" );
    }
    else {
        savedUserMoney = savedUserMoney + (stakeAmount * -1);
        generateAlert(" You lost " + stakeAmount + "!", "danger");
    }

    document.getElementById("userMoney").innerText = savedUserMoney;
}
