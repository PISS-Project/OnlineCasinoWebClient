$(function () {

    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

});
function checkForm() {
    var form1 = $("#register-form");
    if (form1.find('input[name="password"]').val() != form1.find('input[name="confirmPassword"]').val()) {
        alert("Passwords must be the same!");
        form1.find('input[name="password"]').focus();
        return false;
    }
    form1.submit();
    return true;
}