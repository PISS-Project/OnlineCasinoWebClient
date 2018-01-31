$(".dice-bet").on({

        click: function () {
            $('#bets-wrapper').children('div').removeClass("active");
            $(this).addClass("active");
        }
});

function startRolling() {
    $('#platform1').removeClass('stop').addClass('playing');
    $('#platform2').removeClass('stop').addClass('playing');
}

function showDiceResult(dice1Num, dice2Num, won) {

    // Dice 1 Roll
    setTimeout(function () {
        $('#platform1').removeClass('playing').addClass('stop');
        var number = dice1Num;
        var x = 0, y = 20, z = -20;
        switch (number) {
            case 1:
                x = 0; y = 20; z = -20;
                break;
            case 2:
                x = -100; y = -150; z = 10;
                break;
            case 3:
                x = 0; y = -100; z = -10;
                break;
            case 4:
                x = 0; y = 100; z = -10;
                break;
            case 5:
                x = 80; y = 120; z = -10;
                break;
            case 6:
                x = 0; y = 200; x = 10;
                break;
        }

        $('#dice1').css({
            'transform': 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)'
        });

        $('#platform1').css({
            'transform': 'translate3d(0,0, 0px)'
        });

        if (won) {
            $("#betResult").text("Won");
            $("#betResult").css({
                "color": "seagreen"
            });
        }
        else {
            $("#betResult").text("Lost");
            $("#betResult").css({
                "color": "darkred"
            });
        }

    }, 3000);

    // Dice 2 Roll
    setTimeout(function () {
        $('#platform2').removeClass('playing').addClass('stop');
        var number = dice2Num;
        var x = 0, y = 20, z = -20;
        switch (number) {
            case 1:
                x = 0; y = 20; z = -20;
                break;
            case 2:
                x = -100; y = -150; z = 10;
                break;
            case 3:
                x = 0; y = -100; z = -10;
                break;
            case 4:
                x = 0; y = 100; z = -10;
                break;
            case 5:
                x = 80; y = 120; z = -10;
                break;
            case 6:
                x = 0; y = 200; x = 10;
                break;
        }

        $('#dice2').css({
            'transform': 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(' + z + 'deg)'
        });

        $('#platform2').css({
            'transform': 'translate3d(0,0, 0px)'
        });

    }, 3000);
}