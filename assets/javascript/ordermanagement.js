function ormanDisplayDetails() {
    const url = `http://210.99.223.38:8081/api/order/order-send?constructorId=${localStorage.LoginSession}`;

    const result = getData(url).data;
    console.log(result);
    const placeholderSNS = `전화번호를 입력하세요`;
    const labelSNS = `전화번호 입력`;
    const placeholderEmail = `이메일을 입력해주세요`;
    const labelEmail = `이메일 입력`;

    if (result) {
        const isSend = result.isSend;
        const sendMethod = result.sendMethod;
        const email = result.email;
        const phoneNumber = result.phoneNumber;

        $('#ormanSend').prop('checked', isSend)

        // sms
        if (sendMethod === true) { 
            $('#ormanMethodPhone').prop('checked', true);
            $('#ormanMethod').attr('type', 'text');
            $('#ormanMethod').attr('placeholder', placeholderSNS);
            $('#ormanLabel').text(labelSNS);
            
            if(phoneNumber) { $('#ormanMethod').val(phoneNumber); }
        }
        // email
        else if (sendMethod === false) {
            $('#ormanMethodEmail').prop('checked', true);
            $('#ormanMethod').attr('type', 'email');
            $('#ormanMethod').attr('placeholder', placeholderEmail);
            $('#ormanLabel').text(labelEmail);

            if(email) { $('#ormanMethod').val(email); }
        }
    }

    else if (!result) {
        // set default email 
        $('#ormanSend').prop('checked', false);
        $('#ormanMethodEmail').prop('checked', true);
        $('#ormanMethod').attr('type', 'email');
        $('#ormanMethod').attr('placeholder', placeholderEmail);
        $('#ormanLabel').text(labelEmail);
    }
}

// onload page
$('#ordermanagement_btn').on('click', function () {
    ormanDisplayDetails();
})

// toggle send on-off
$('#ormanSend').on('change', function () {
    const bool = $(this).prop('checked');
    const url = `http://210.99.223.38:8081/api/order/order-send/on-off`;

    const data = {
        'constructorId': localStorage.LoginSession,
        'isSend': bool
    }

    putData(data, url);
})

// EMAIL
$('#ormanMethodEmail').on('change', function () {
    const bool = $(this).prop('checked');
    const placeholder = `이메일을 입력해주세요`;
    const input = $('#ormanMethod');
    const text = `이메일 입력`;
    const label = $('#ormanLabel');

    if (bool === true) {
        input.val(null);
        input.attr('type', 'email');
        input.attr('placeholder', placeholder);
        label.text(text);

        const url = `http://210.99.223.38:8081/api/order/order-send?constructorId=${localStorage.LoginSession}`;

        const result = getData(url).data;

        if (result) {
            const email = result.email;
            if (email) { $('#ormanMethod').val(email); }
        }
    }
})

// SNS
$('#ormanMethodPhone').on('change', function () {
    const bool = $(this).prop('checked');
    const placeholder = `전화번호를 입력하세요`;
    const input = $('#ormanMethod');
    const text = `전화번호 입력`;
    const label = $('#ormanLabel');

    if (bool === true) {
        input.val(null);
        input.attr('type', 'text');
        input.attr('placeholder', placeholder);
        label.text(text);

        const url = `http://210.99.223.38:8081/api/order/order-send?constructorId=${localStorage.LoginSession}`;

        const result = getData(url).data;

        if (result) {
            const phoneNumber = result.phoneNumber;
            if (phoneNumber) { $('#ormanMethod').val(phoneNumber); }
        }
    }
})


$('#ormanSendBtn').on('click', function () {
    const phoneBool = $('#ormanMethodPhone').prop('checked');

    const value = $('#ormanMethod').val();
    const url = `http://210.99.223.38:8081/api/order/order-send/email-sms`;

    if (phoneBool === false) {
        const data = {
            'constructorId': localStorage.LoginSession,
            'sendMethod': false,
            'email': value
        }
        putData(data, url);

        setTimeout(function () {
            ormanDisplayDetails();
            $('#ormanSendBtn').blur();
        }, 1000)
    } 

    else if (phoneBool === true) {
        const data = {
            'constructorId': localStorage.LoginSession,
            'sendMethod': true,
            'phoneNumber': value
        }
        putData(data, url);

        setTimeout(function () {
            ormanDisplayDetails();
            $('#ormanSendBtn').blur();
        }, 1000)
    }
})