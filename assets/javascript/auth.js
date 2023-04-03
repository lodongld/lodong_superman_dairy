const loginUrl = `http://210.99.223.38:8081/api/login`;

function checkErrLogin() {
    if (($('#errLogin').hasClass('d-none'))) {
        $('#errLogin').removeClass('d-none').addClass('d-block');
    }
}

function loginValidate(details){
    if (!details.username && !details.password) {
        return 'All Fields is required.';
    }
    else if (!details.username) {
        return 'Username is required.';
    }
    else if (!details.password) {
        return 'Password is required.';
    }
    else if (details.username && details.password) {
        const mgs = postData(details, loginUrl).message;
        return loginMessageResult(mgs);
    }
}

function loginMessageResult(mgs) {
    if (mgs === 'no user') {
        return 'Username does not exists.';
    }
    else if (mgs === 'password is not matched') {
        return 'Password is incorrect.';
    }
    else if (mgs === 'login success') {
        return 'Login successfully.';
    };
}

function loginSession() {
    if (localStorage.localKey === null) { window.location.href = 'login.html'; } 
    else { window.location.href = 'index.html'; }
}


// LOGIN FORM
$('#login_form').on('submit', function (e) {
    e.preventDefault();
    const username = $('#login_username').val();
    const password = $('#login_password').val();

    const loginDetails = {
        'username': username,
        'password': password,
    }

    const mgs = loginValidate(loginDetails);

    if (mgs != 'Login successfully.') {
        checkErrLogin();
        $('#errLogin').text(mgs);
    }
    else if (mgs === 'Login successfully.') {
        const constructorId = postData(loginDetails, loginUrl).data.constructorId;
        
        localStorage.setItem('localKey', constructorId);
        localStorage.setItem('localHeaders', username);
        localStorage.setItem('localBody', password);
        // localStorage.setItem('Headers', username);
        // localStorage.setItem('Body', password);
        loginSession();
    }
});

$('#logout_btn').on('click', function () {
    localStorage.clear();
    unsubscribeStomp();
    deactiveStomp();
    loginSession();
});

