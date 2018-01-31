function notifyForBetResult(message, type) {
    var offsetXCalc = document.body.getBoundingClientRect().right - $("#userMoney")[0].getBoundingClientRect().right - 30;

    generateAlert(message, type, 'glyphicon glyphicon-euro', { x: offsetXCalc, y: 55 }, "betContainer");
}

function generateAlert(message, type) {
    generateAlert(message, type, "");
}

function generateAlert(message, type, icon) {
    generateAlert(message, type, icon, { x: 20, y: 55 });
}

function generateAlert(message, type, icon, offset) {
    generateAlert(message, type, icon, offset, "");
}

function generateAlert(message, type, icon, offset, customClass) {
    $.notify({
        // options
        message: message,
        icon: icon
    }, {
            // settings
            type: type,
            allow_dismiss: false,
            offset: offset,
            z_index: 1031,
            delay: 3000,
            animate: {
                enter: 'animated bounceInRight',
                exit: 'animated bounceOutRight'
            },
            template: '<div data-notify="container" class="alert alert-{0} ' + customClass +'" role="alert">' +
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