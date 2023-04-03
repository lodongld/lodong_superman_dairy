const chatBox = document.getElementById('#chatMsgHistory');

// Flag to prevent multiple requests at the same time
let isFetching = false;
let beforedate;

function autoScrollToBotMsg() {
    $(document).ready(function () {
        const x = $('.chat-MsgVisible').outerHeight();
        var newscrollHeight = $(".chat-MsgVisible").prop("scrollHeight"); 

        $(".chat-MsgVisible").animate({
            scrollTop: newscrollHeight
        }, '500');
    })

}

function chatDisplayRooms(url) {
    const result = getData(url).data;
    // console.log(result)
    const container = "chatRoom_cont";
    const template = "chatRoom_temp";
    $('#' + container).empty();
    $.each(result, function (i, d) {
        const mgs = d.lastMessage;
        
        let chatMgs;

        if (!mgs) {
            let tempData = {
                'customerId': d.customerId,
                'custName': d.customerName,
                'lastChat': null,
                'message': null,
                'type': null,
                'roomId': d.roomId,
            }
            mustacheTemplating(container, template, tempData);
        }

        else if (mgs) {
            let type = mgs.type;

            let createAt = mgs.createAt;
            let chatTime = createAt.split(' ');
            let chatHH = chatTime[1].split(':');
            let lastChat = `${chatHH[0]}:${chatHH[1]}`; 

            if (type === 'MESSAGE') {
                chatMgs = mgs.message;
            }

            else if (type === 'IMAGE') {
                chatMgs = '[이미지 전송됨]';
            }

            let tempData = {
                'custId': d.customerId,
                'custName': d.customerName,
                'lastChat': lastChat,
                'message': chatMgs,
                'type': mgs.type,
                'roomId': d.roomId,
            }

            mustacheTemplating(container, template, tempData);
        }
    })
}

function openThisChat(thisElem) {
    $('#chatMsgHistory').empty();

    const visibleDiv = document.querySelector('.chat-MsgVisible');
    visibleDiv.removeEventListener('scroll', scrollev);
    $('#chatRoom_cont .chats').siblings().removeClass('active');
    thisElem.classList += ' active';
    unsubscribeStomp();


    const custID = thisElem.getAttribute('data-customerID');
    const roomID = thisElem.getAttribute('data-roomID');
    localStorage.setItem('localRoom', roomID);
    stompReceiver = custID;

    fetchMessages(roomID, new Date().toISOString().substring(0, 10));
    autoScrollToBotMsg();

    activateOnScrollEvent();

    // activeStomp();
    subscribeStomp(roomID);
}

// Fetch messages for the given date
function fetchMessages(room, date) {
    if (!isFetching) {
        isFetching = true;

        // Fetch messages for the given date
        let openChatUrl = `http://210.99.223.38:8081/api/chat/list?roomId=${room}&dateTime=${date}`;
        const result = getData(openChatUrl);
        const resdata = result.data;
        // console.log(resdata)

        if (resdata.length > 0){
            let dateAtZeroIndex = resdata[0].createAt;
            let splitZeroIndex = dateAtZeroIndex.split(' ');
            let splitX = splitZeroIndex[0];
            
            if (resdata.length >= 2 ) {
                let dateAtOneIndex = resdata[1].createAt;
                let splitOneIndex = dateAtOneIndex.split(' ');
                let splitY = splitOneIndex[0];

                if (splitX != splitY) {
                    beforedate = splitX;
                    resdata.shift();

                    if (resdata.length < 15) {
                        displayThisChats(resdata, date);
                        isFetching = false;
                        fetchPreviousMessages(room, beforedate);
                    }
                    else if (resdata.length >= 15) {
                        isFetching = false;
                        displayThisChats(resdata, date);
                    }
                }
                else if (splitX === splitY) {
                    beforedate = null;
                    isFetching = false;
                    displayThisChats(resdata, date);
                }
            }

            else if (resdata.length === 1) {
                beforedate = splitX;
                isFetching = false;
                // displayThisChats(resdata, date);
                fetchPreviousMessages(room, beforedate);
            }

        }
        else if (resdata.length === 0) { console.log(result.message)}
    }
}

// Fetch previous messages and render them at the top of the chat box
function fetchPreviousMessages(room, date) {
    if (!isFetching) {
        isFetching = true;
        // Fetch messages for the given date
        let openChatUrl = `http://210.99.223.38:8081/api/chat/list?roomId=${room}&dateTime=${date}`;
        const result = getData(openChatUrl);
        const resdata = result.data;

        let dateAtZeroIndex = resdata[0].createAt;
        let splitZeroIndex = dateAtZeroIndex.split(' ');
        let splitX = splitZeroIndex[0];

        if (resdata.length >= 2) {
            let dateAtOneIndex = resdata[1].createAt;
            let splitOneIndex = dateAtOneIndex.split(' ');
            let splitY = splitOneIndex[0];

            if (splitX != splitY) {
                beforedate = splitX;
                resdata.shift();
                if (resdata.length < 10) {
                    isFetching = false;
                    displayPreviousChats(resdata, date)
                    fetchPreviousMessages(room, beforedate);
                }
                else if (resdata.length >= 10) {
                    isFetching = false;
                    displayPreviousChats(resdata, date)
                }
            }
            else if (splitX === splitY) {
                beforedate = null;
                isFetching = false;
                displayPreviousChats(resdata, date);
            }
        }

        else if (resdata.length === 1) {
            beforedate = splitX;
            isFetching = false;
            fetchPreviousMessages(room, beforedate);
        }
    }
}

function displayThisChats(dataResults, day) {
    $('#chatMsgHistory').empty();
    // console.log('displayThisChats: ', dataResults);

    if(dataResults.length > 0) {
        const creAt = day.split('-');
        const dateTemplate = `<div class="chatDate text-center fs-14px" data-chatDate='${day}'>${creAt[0]}년 ${creAt[1]}월 ${creAt[2]}일</div>`;
        $('#chatMsgHistory').append(dateTemplate);
    
        $.each(dataResults, function (i, d) {
            let html;
            const imgChat = d.chatImageFile;
            const mgsTime = d.createAt;
            const type = d.type;
            const createAt = mgsTime.split(' ');
            const chatTime = createAt[1].split(':');
            const chatTimeJoin = `${chatTime[0]}:${chatTime[1]}`;
            const mgsSender = d.sender;
            
            if (mgsSender != auths.id) {
                if (type === 'MESSAGE') {
                    html = `<div id='mgsread${d.id}' class='mgsread' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgsread-content'>
                                    <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                    <div class='mgsread-mgs'> ${d.message} </div>
                                    <div class='mgsread-time'> ${chatTimeJoin} </div>
                                </div>
                            </div>`;
    
                    $('#chatMsgHistory').append(html);
                }
                else if (type === 'IMAGE') {
                    const maxwidth = chatImgDisplayStyle(imgChat).maxwidth;
                    const width = chatImgDisplayStyle(imgChat).width;
                    const height = chatImgDisplayStyle(imgChat).height;

                    const imgs = (imgChat, width, height, id) => {
                        const imgElements = imgChat.flatMap((image) => {
                            return Object.values(image).map((imageName) => {
                                const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                                return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}" style='width: ${width}px; height: ${height}px;'>
                                            <img src='${imgData}' alt='chat-img' class='img-fluid placeholder-glow' style='height: ${height}px;'/>
                                        </a>`;
                            });
                        }).join('');

                        return imgElements;
                    }
    
                    let htmlImg = `<div id='mgsread${d.id}' class='mgsread' data-mgs-type='${type}' data-date='${mgsTime}'>
                                        <div class='mgsread-content'>
                                            <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' class="mb-2" />
                                            <div class="mgsread-cont">
                                                <div class='mgsread-time mb-2'> ${chatTimeJoin} </div>
                                                <div class='mgsread-imgs' style="max-width: ${maxwidth}px !mportant"> ${imgs(imgChat, width, height, d.id)} </div>
                                            </div>
                                        </div>
                                    </div>`;
                    $('#chatMsgHistory').append(htmlImg);
                }
            }
    
            else if (mgsSender === auths.id) {
                if (type === 'MESSAGE') {
                    html = `<div id='mgssend${d.id}' class='mgssend' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgssend-content'>
                                    <div class="mgssend-time">
                                        <span class='sendviewed text-end'>1</span>
                                        <span class='sendtime'> ${chatTimeJoin} </span>
                                    </div> 
                                    <div class='mgssend-mgs'> ${d.message} </div>
                                </div>
                            </div>`;
    
                    $('#chatMsgHistory').append(html);
                }
    
                else if (type === 'IMAGE') {
                    const maxwidth = chatImgDisplayStyle(imgChat).maxwidth;
                    const width = chatImgDisplayStyle(imgChat).width;
                    const height = chatImgDisplayStyle(imgChat).height;

                    const imgs = (imgChat, width, height, id) => {
                        const imgElements = imgChat.flatMap((image) => {
                            return Object.values(image).map((imageName) => {
                                const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                                return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}" style='width: ${width}px; height: ${height}px;'>
                                    <img src='${imgData}' alt='chat-img' class='img-fluid placeholder-glow' style='height: ${height}px;' />
                                    </a>`;
                            });
                        }).join('');

                        return imgElements;
                    }

                    let htmlImg = `<div id='mgssend${d.id}' class='mgssend' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgssend-content'>
                                    <div class="mgssend-time mb-2">
                                        <span class='sendviewed text-end'>1</span>
                                        <span class='sendtime'> ${chatTimeJoin} </span>
                                    </div> 
                                    <div class='mgssend-imgs' style="max-width: ${maxwidth}px !important"> ${imgs(imgChat, width, height, d.id)} </div>
                                </div>
                            </div>`;
                    $('#chatMsgHistory').append(htmlImg);
                }
            }
        });
    }
}

function displayPreviousChats(dataResults, day) {
    if (dataResults.length > 0) {
        const creAt = day.split('-');
        const dateTemplate = `<div class="chatDate text-center fs-14px" data-chatDate='${day}'>${creAt[0]}년 ${creAt[1]}월 ${creAt[2]}일</div>`;
        let htmlContent = '';
        $.each(dataResults, function (i, d) {
            let html;
            const imgChat = d.chatImageFile;
            const mgsTime = d.createAt;
            const type = d.type;
            const createAt = mgsTime.split(' ');
            const chatTime = createAt[1].split(':');
            const chatTimeJoin = `${chatTime[0]}:${chatTime[1]}`;
            const mgsSender = d.sender;

            if (mgsSender != auths.id) {
                if (type === 'MESSAGE') {
                    html = `<div id='mgsread${d.id}' class='mgsread' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgsread-content'>
                                    <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                    <div class='mgsread-mgs'> ${d.message} </div>
                                    <div class='mgsread-time'> ${chatTimeJoin} </div>
                                </div>
                            </div>`;
                }
                else if (type === 'IMAGE') {
                    const maxwidth = chatImgDisplayStyle(imgChat).maxwidth;
                    const width = chatImgDisplayStyle(imgChat).width;
                    const height = chatImgDisplayStyle(imgChat).height;
                    const imgs = (imgChat, width, height, id) => {
                        const imgElements = imgChat.flatMap((image) => {
                            return Object.values(image).map((imageName) => {
                                const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                                return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}" style='width: ${width}px; height: ${height}px;'>
                                        <img src='${imgData}' alt='chat-img' class='img-fluid' style='height: ${height}px;'/>
                                    </a>`;
                            });
                        }).join('');

                        return imgElements;
                    }

                    html = `<div id='mgsread${d.id}' class='mgsread' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgsread-content'>
                                    <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' class="mb-2" />
                                    <div class='mgsread-imgs' style='max-width: ${maxwidth}px !important'> ${imgs(imgChat, width, height, d.id)} </div>
                                    <div class='mgsread-time mb-2'> ${chatTimeJoin} </div>
                                </div>
                            </div>`;

                }
            }

            else if (mgsSender === auths.id) {
                if (type === 'MESSAGE') {
                    html = `<div id='mgssend${d.id}' class='mgssend' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgssend-content'>
                                    <div class="mgssend-time">
                                        <span class='sendviewed text-end'>1</span>
                                        <span class='sendtime'> ${chatTimeJoin} </span>
                                    </div> 
                                    <div class='mgssend-mgs'> ${d.message} </div>
                                </div>
                            </div>`;
                }

                else if (type === 'IMAGE') {
                    const maxwidth = chatImgDisplayStyle(imgChat).maxwidth;
                    const width = chatImgDisplayStyle(imgChat).width;
                    const height = chatImgDisplayStyle(imgChat).height;
                    const imgs = (imgChat, width, height, id) => {
                        const imgElements = imgChat.flatMap((image) => {
                            return Object.values(image).map((imageName) => {
                                const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                                return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}" style='width: ${width}px; height: ${height}px;'>
                                    <img src='${imgData}' alt='chat-img' class='img-fluid' style='height: ${height}px;' />
                                    </a>`;
                            });
                        }).join('');

                        return imgElements;
                    }

                    html = `<div id='mgssend${d.id}' class='mgssend' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgssend-content'>
                                    <div class="mgssend-time mb-2">
                                        <span class='sendviewed text-end'>1</span>
                                        <span class='sendtime'> ${chatTimeJoin} </span>
                                    </div> 
                                    <div class='mgssend-imgs' style="max-width: ${maxwidth}px !important"> ${imgs(imgChat, width, height, d.id)} </div>
                                </div>
                            </div>`;
                }
            }
            htmlContent += html || '';
        });

        $('#chatMsgHistory').prepend(htmlContent);
        $('#chatMsgHistory').prepend(dateTemplate);
    }
}

function activateOnScrollEvent() {
    const visibleDiv = document.querySelector('.chat-MsgVisible');
    visibleDiv.addEventListener('scroll', scrollev);
}

function scrollev() {
    const visibleDiv = document.querySelector('.chat-MsgVisible');
    const ascrollableDiv = document.querySelector('#chatMsgHistory');
    const ascrollableOffH = ascrollableDiv.offsetHeight;

    if ($('#consulting_btn').hasClass('active')) {
        if ($(this).scrollTop() <= 5) {
            if (localStorage.getItem('localRoom') && beforedate != null) {
                fetchPreviousMessages(localStorage.getItem('localRoom'), beforedate);
    
                visibleDiv.removeEventListener('scroll', scrollev);
    
                $(document).ready(function () {
                    const newscrollableDiv = document.querySelector('#chatMsgHistory');
                    const newscrollableOffH = newscrollableDiv.offsetHeight;
                    const returnPrevScrollingPositionY = newscrollableOffH - ascrollableOffH - 4;
    
                    $(".chat-MsgVisible").animate({
                        scrollTop: returnPrevScrollingPositionY
                    }, '0');
    
                    visibleDiv.addEventListener('scroll', scrollev);
                })
            }
        }
    }
}

// onload page
$('#consulting_btn, #cpOpenChat').on('click', function () {
    const roomListUrl = `http://210.99.223.38:8081/api/chat/room/list?constructorId=${auths.id}`;
    chatDisplayRooms(roomListUrl);
    $('#chatMsgHistory').empty();
    autoScrollToBotMsg();

    unsubscribeStomp();
})

//  send button
$('#mgsSendBtn').on('click', function() {
    const msg = $('#mgsSendInput').val().trim();
    const fileValue = $('#mgsSendUpload').val();
    const input = document.querySelector('#mgsSendUpload');

    
    // console.log(curSubRoom)
    if (!localStorage.getItem('localRoom')) {  if (!fileValue || !msg) { return; } }

    let imgIds = [];
    let chatImgDto, type, messageDto;

    // console.log(input.files.length);

    if (msg.length > 0) {
        type = 'MESSAGE';

        messageDto = {
            'roomId': localStorage.getItem('localRoom'),
            'senderId': auths.id,
            'receiverId': stompReceiver,
            'message': msg,
            'type': type,
            'fcm': localStorage.FCM,
        }

        publishStomp(messageDto);
        $('#mgsSendInput').val(null);

        setTimeout(function () {
            if (input.files.length > 0) {
                $('#mgsSendBtn').trigger('click');
            }
        }, 50);
    }

    else if (input.files.length > 0) {
        type = 'IMAGE';
        const imageFile = input.files;
        const formData = new FormData();

        for (var i = 0; i < imageFile.length; i++) {
            formData.append('files', imageFile[i], imageFile[i].name);
        }

        const uploadurl = `http://210.99.223.38:8081/api/chat/image`;
        const settings = {
            "url": uploadurl,
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": formData
        };

        $.ajax(settings).done(function (response) {
            chatImgDto = response;
            cImgDto = JSON.parse(chatImgDto);
            imgIds = cImgDto.data.ChatFilesDTO

            messageDto = {
                'roomId': localStorage.getItem('localRoom'),
                'senderId': auths.id,
                'receiverId': stompReceiver,
                'message': msg,
                'type': type,
                'fcm': localStorage.FCM,
                'imageFileIdList': imgIds
            }
            
            publishStomp(messageDto);

            $('#chatImgContainer').addClass('d-none');
            input.value = "";
        });
    }
});


$('#mgsSendUpload').on('change', function() {
    const input = document.querySelector('#mgsSendUpload');
    if (input.files.length > 0) {
        const imageFile = input.files;

        $('#mgsSendImgDiv').empty();
        for (var i = 0; i < imageFile.length; i++) {
            const key = generateRandomKey(7);
            let html = `<div class="mgsSendImg position-relative" data-key="${key}">
                      <div class="position-absolute top-0 start-100 translate-middle">
                        <div class="mgsSendImgClose">
                          <button class="mgsSendImgCloseBtn btn btn-sm btn-primary rounded-circle" data-key="${key}" data-name="${imageFile[i].name}">
                            <i class="fa-solid fa-times"></i>
                          </button>
                        </div>
                      </div>
                      <div class="mgsSendImgCont rounded">
                        <img src="./assets/img/images/no-video.jpg" class="chatimg${key} img-fluid rounded" alt="upload-img">
                      </div>
                    </div>`;

            $('#mgsSendImgDiv').append(html);

            const reader = new FileReader();
            reader.addEventListener('load', function () {
                document.querySelector(`#mgsSendImgDiv .chatimg${key}`).setAttribute('src', this.result);
            })
            reader.readAsDataURL(imageFile[i]);
        }

        $('#chatImgContainer').removeClass('d-none');
        $('#mgsSendTxtDiv').addClass('hasimg').removeClass('hasnoimg');
    }
    else { $('#mgsSendTxtDiv').addClass('hasnoimg').removeClass('hasimg'); }
})

$('#mgsSendInput').on('input', function () {
    const input = document.querySelector('#mgsSendUpload');
    if (input.files.length > 0) {
        $('#chatImgContainer').removeClass('d-none');
        $('#mgsSendTxtDiv').addClass('hasimg').removeClass('hasnoimg');
    }
    else { $('#mgsSendTxtDiv').addClass('hasnoimg').removeClass('hasimg'); }
})

// delete chat img pic before send
$('#chatImgContainer').on('click', '.mgsSendImgCloseBtn', function() {
    const name = $(this).data('name');
    const key = $(this).data('key');

    $(`#mgsSendImgDiv .mgsSendImg[data-key="${key}"`).remove();

    const input = document.querySelector('#mgsSendUpload');
    removeFile(name, 'mgsSendUpload');

    if (input.files.length === 0) { $('#chatImgContainer').addClass('d-none'); }
})