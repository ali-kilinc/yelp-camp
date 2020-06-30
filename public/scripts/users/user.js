$("#register-button").on("click", function()
{
    console.log("register form request");

});

$(document).on("click", "#register-button, #register-anchor", function()
{    
    if($("#popup-overlay").is(":visible"))
    {
        $("#popup-overlay").slideUp(function(){
            requestAndLoadRegisterForm()
        }); 
    }
    else
    {
        requestAndLoadRegisterForm();
    }
});

function requestAndLoadRegisterForm()
{
    const options = {
        method: "GET",
        url: "/users/register"
    };
  
    $.ajax(options).then(function(res) {
        $("#popup-overlay").html(res);
        $("#popup-overlay").slideDown();
        
        $("#register-form").on("submit", registerSubmit);
        
    }).catch(function(err) {
        alert("Something went wrong. Please try again later :(");
    });
}

function registerSubmit(event) {

    event.preventDefault();

    if(!$("input[name='user[username]']").val())
    {
        $('#error-message').html("You cannot register without a username.");
        $('#error-message').slideDown();
        return;
    }

    if($("input[name='user[password]']").val() != $("input[name='confirmedPassword']").val())
    {
        $('#error-message').html("Your password and confirmed password do not match.");
        $('#error-message').slideDown();
        return;
    }

    const options = {
        method: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        cache: false
    };

    $.ajax(options).then(function(res) {
        let result = JSON.parse(res);
        if (result.error) {
            $('#error-message').html(result.errorMessage);
            $('#error-message').slideDown();
        }
        else {
            if(window.location.pathname === "/")
            {
                window.location.href = "/campgrounds";
            }
            else
            {
                location.reload();
            }
        }
    }).catch(function(err) {
        $('#error-message').html("Something went wrong. Please try again later :(");
        $('#error-message').slideDown();
    });
}

$(document).on("click", "#login-anchor, #login-button", function(event)
{
    if($("#popup-overlay").is(":visible"))
    {
        $("#popup-overlay").slideUp(function(){
            requestAndLoadLoginForm()
        }); 
    }
    else
    {
        requestAndLoadLoginForm();
    }
});

function requestAndLoadLoginForm()
{
    const options = {
        method: "GET",
        url: "/users/login"
    };
  
    $.ajax(options).then(function(res) {
        $("#popup-overlay").html(res);
        $("#popup-overlay").slideDown();
        
        $("#login-form").on("submit", loginSubmit);
    
    }).catch(function(err) { alert("Something went wrong. Please try again later :("); });
}

function loginSubmit(event) {
    
    event.preventDefault();

    const options = {
        method: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        cache: false
    };

    $.ajax(options).then(function(res){

        let result = JSON.parse(res);
        if (result.error) {
            $('#error-message').html(result.errorMessage);
            $('#error-message').slideDown()
        }
        else {
            if(window.location.pathname === "/")
            {
                window.location.href = "/campgrounds";
            }
            else
            {
                location.reload();
            }
        }

    }).catch(function(res) {
        $('#error-message').html("Something went wrong. Please try again later :(");
        $('#error-message').slideDown();
    });
}

$("#popup-overlay").on("click", function(){
    
    if (!$(event.target).closest('#popup').length) {
        $("#popup-overlay").slideUp();
    }
});

$("#popup-overlay").on("click", "#popupClose", function(){
    $("#popup-overlay").slideUp();
});