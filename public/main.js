var spinner = $("#spinner");

var username, password;
$('#form').submit(function(event) {
    event.preventDefault();
    username = $("#inputUsername").val();
    password = $("#inputPassword").val();
    spinner.show();
    $.ajax({
        'method': 'post',
        'url': '/login',
        'data': 'username='+username+'&password='+password,
        'success' : function(message) {
            if(message == 'Logged in') {
                $('#form').hide();
                $('#form-copy').show();
                console.log('hidden')
            } else {
                alert("Špatné heslo")
            }
            spinner.hide();
        }
    });
});

$("#form-copy").submit(function(event) {
    event.preventDefault();
    var id = $('#inputId').val();
    spinner.show();
    $.ajax({
        'method': 'post',
        'url': '/copy',
        'data': 'username='+username+'&password='+password+'&id='+id,
        'success' : function(message) {
            console.log(message)
            if(message != 'Logged in') {
                $('#inputId').val("");
                alert("Zakázka byla zkopírována");
                console.log('hidden')
            } else {
                alert("Vyskytla se chyba při kopírování.");
            }
            spinner.hide();
        }
    })
});