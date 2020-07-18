var spinner = $("#spinner");
var success = $("#success");
var badPassword = $("#badPassword");
var error = $("#error");

var username, password;
$('#form').submit(function(event) {
    event.preventDefault();
    username = $("#inputUsername").val();
    password = $("#inputPassword").val();
    spinner.show();
    badPassword.hide();
    $.ajax({
        'method': 'post',
        'url': '/login',
        'data': 'username='+username+'&password='+password,
        'success' : function(message) {
            if(message == 'Logged in') {
                $('#form').hide();
                $('#form-copy').show();
            } else {
                badPassword.show();
            }
            spinner.hide();
        }
    });
});

$("#form-copy").submit(function(event) {
    event.preventDefault();
    var id = $('#inputId').val();
    spinner.show();
    success.hide();
    error.hide();
    $.ajax({
        'method': 'post',
        'url': '/copy',
        'data': 'username='+username+'&password='+password+'&id='+id,
        'success' : function(message) {
            if(message == 'Successfully copied') {
                $('#inputId').val("");
                success.show();
            } else {
                error.show();
            }
            spinner.hide();
        }
    })
});