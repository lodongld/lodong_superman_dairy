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



let subscription;
let oldRoomID, customerID;
function openThisChat(thisElem) {
    $('#chatMsgHistory').empty();
    $('#chatRoom_cont .chats').siblings().removeClass('active');
    thisElem.classList += ' active';

    const unsub = () => { subscription.unsubscribe(); }
    if (oldRoomID) { oldRoomID = null; unsub; }

    const custID = thisElem.getAttribute('data-customerID');
    customerID = custID;
    const roomID = thisElem.getAttribute('data-roomID');
    oldRoomID = roomID;

    const currDate = new Date();
    const timestamp = getPosDate(currDate);
    let openChatUrl = `http://210.99.223.38:8081/api/chat/list?roomId=${roomID}&dateTime=${timestamp}`;
    const result = getData(openChatUrl).data;
    displayThisChats(result, timestamp);
    autoScrollToBotMsg();

    stompOnMessage(roomID);
}

async function displayThisChats(dataResults, day) {
    $('#chatMsgHistory').empty();
    // console.log(dataResults);

    if(dataResults.length > 0) {
        const creAt = day.split('-');
        const dateTemplate = `<div class="text-center fs-14px">${creAt[0]}년 ${creAt[1]}월 ${creAt[2]}일</div>`;
        $('#chatMsgHistory').append(dateTemplate);
    
        await $.each(dataResults, function (i, d) {
            let html;
            const imgChat = d.chatImageFile;
            const mgsTime = d.createAt;
            const type = d.type;
            const createAt = mgsTime.split(' ');
            const chatTime = createAt[1].split(':');
            const chatTimeJoin = `${chatTime[0]}:${chatTime[1]}`;
            const mgsSender = d.sender;
            
            if (mgsSender != session) {
                if (type === 'MESSAGE') {
                    html = `<div id='mgsread${d.id}' class='mgsread' data-mgs-type='${type}'>
                                <div class='mgsread-content'>
                                    <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                    <div class='mgsread-mgs'> ${d.message} </div>
                                    <div class='mgsread-time'> ${chatTimeJoin} </div>
                                </div>
                            </div>`;
    
                    $('#chatMsgHistory').append(html);
                }
                else if (type === 'IMAGE') {
                    const imgs = (imgChat, id) => {
                        const imgElements = imgChat.flatMap((image) => {
                            return Object.values(image).map((imageName) => {
                                const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                                return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}"><img src='${imgData}' alt='chat-img' class='img-fluid' /></a>`;
                            });
                        }).join('');

                        return imgElements;
                    }
    
                    let htmlImg = `<div id='mgsread${d.id}' class='mgsread' data-mgs-type='${type}'>
                                        <div class='mgsread-content'>
                                            <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                            <div class='mgsread-imgs'> 
                                                ${imgs(imgChat, d.id)}
                                            </div>
                                            <div class='mgsread-time'> ${chatTimeJoin} </div>
                                        </div>
                                    </div>`;
                    $('#chatMsgHistory').append(htmlImg);
                }
            }
    
            else if (mgsSender === session) {
                if (type === 'MESSAGE') {
                    html = `<div id='mgssend${d.id}' class='mgssend' data-mgs-type='${type}'>
                                <div class='mgssend-content'>
                                    <div class='mgssend-time'> ${chatTimeJoin} </div>
                                    <div class='mgssend-mgs'> ${d.message} </div>
                                </div>
                            </div>`;
    
                    $('#chatMsgHistory').append(html);
                }
    
                else if (type === 'IMAGE') {
                    const imgs = (imgChat, id) => {
                        const imgElements = imgChat.flatMap((image) => {
                            return Object.values(image).map((imageName) => {
                                const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                                return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}"><img src='${imgData}' alt='chat-img' class='img-fluid' /></a>`;
                            });
                        }).join('');

                        return imgElements;
                    }
    
                    let htmlImg = `<div id='mgssend${d.id}' class='mgssend' data-mgs-type='${type}'>
                                        <div class='mgssend-content'>
                                            <div class='mgssend-time'> ${chatTimeJoin} </div>
                                            <div class='mgssend-imgs'> ${imgs(imgChat, d.id)} </div>
                                        </div>
                                    </div>`;
    
                    $('#chatMsgHistory').append(htmlImg);
                }
            }
        });
    }
}

async function displayCurrChats(mgs) {
    const res = JSON.parse(mgs);
    console.log(res);
    if(res.id) {
        let html;
        const imgChat = res.imageFileIdList;
        console.log(imgChat);
        const type = res.type;
        const createAt = res.createAt.split('T');
        const chatTime = createAt[1].split('.');
        const chatTT = chatTime[0].split(':');
        const chatTimeJoin = `${chatTT[0]}:${chatTT[1]}`;
        const mgsSender = res.senderId;

        if (mgsSender != session) {
            if (type === 'MESSAGE') {
                html = `<div id='mgsread${res.id}' class='mgsread' data-mgs-type='${type}'>
                            <div class='mgsread-content'>
                                <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                <div class='mgsread-mgs'> ${res.message} </div>
                                <div class='mgsread-time'> ${chatTimeJoin} </div>
                            </div>
                        </div>`;

                $('#chatMsgHistory').append(html);
            }
            else if (type === 'IMAGE') {
                const imgs = (imgChat, id) => {
                    const imgElements = imgChat.map((imageName) => {
                            const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                            return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}"><img src='${imgData}' alt='chat-img' class='img-fluid' /></a>`;
                        }).join('');

                    return imgElements;
                }

                let htmlImg = `<div id='mgsread${res.id}' class='mgsread' data-mgs-type='${type}'>
                                    <div class='mgsread-content'>
                                        <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                        <div class='mgsread-imgs'> 
                                            ${imgs(imgChat, res.id)}
                                        </div>
                                        <div class='mgsread-time'> ${chatTimeJoin} </div>
                                    </div>
                                </div>`;
                $('#chatMsgHistory').append(htmlImg);
            }
        }

        else if (mgsSender === session) {
            if (type === 'MESSAGE') {
                html = `<div id='mgssend${res.id}' class='mgssend' data-mgs-type='${type}'>
                            <div class='mgssend-content'>
                                <div class='mgssend-time'> ${chatTimeJoin} </div>
                                <div class='mgssend-mgs'> ${res.message} </div>
                            </div>
                        </div>`;

                $('#chatMsgHistory').append(html);
            }

            else if (type === 'IMAGE') {
                const imgs = (imgChat, id) => {
                    const imgElements = imgChat.map((imageName) => {
                        const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                        return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}"><img src='${imgData}' alt='chat-img' class='img-fluid' /></a>`;
                    }).join('');

                    return imgElements;
                }

                let htmlImg = `<div id='mgssend${res.id}' class='mgssend' data-mgs-type='${type}'>
                                    <div class='mgssend-content'>
                                        <div class='mgssend-time'> ${chatTimeJoin} </div>
                                        <div class='mgssend-imgs'> ${imgs(imgChat, res.id)} </div>
                                    </div>
                                </div>`;

                $('#chatMsgHistory').append(htmlImg);
            }
        }
    }
}


function stompOnMessage(roomID) {
    const onmessage = (message) => {
        console.log('mgs.body: ', message.body)
        displayCurrChats(message.body); 
        autoScrollToBotMsg();
    };

    const room = `/topic/room.${roomID}`;
    const headers = { ack: 'client' };
    subscription = client.subscribe(room, onmessage, headers);
}

// onload page
$('#consulting_btn, #cpOpenChat').on('click', function () {
    autoScrollToBotMsg();
    const roomListUrl = `http://210.99.223.38:8081/api/chat/room/list?constructorId=${session}`;
    chatDisplayRooms(roomListUrl);
    $('#chatMsgHistory').empty();
})

//  send button
$('#mgsSendBtn').on('click', function() {
    const msg = $('#mgsSendInput').val();
    const fileValue = $('#mgsSendUpload').val();
    const input = document.querySelector('#mgsSendUpload');

    console.log(oldRoomID)
    if (!oldRoomID) {  if (!fileValue || !msg) { return; } }

    let imgIds = [];
    let chatImgDto, type, messageDto;

    console.log(input.files.length);

    if (input.files.length > 0) {
        type = 'IMAGE';
        const imageFile = input.files;
        const formData = new FormData();

        // formData.append('files', imageFile[0], imageFile[0].name);

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
            // console.log(chatImgDto);
            cImgDto = JSON.parse(chatImgDto);
            console.log(cImgDto);

            imgIds = cImgDto.data.ChatFilesDTO

            console.log(imgIds);

            messageDto = {
                'roomId': oldRoomID,
                'senderId': session,
                'receiverId': customerID,
                'message': msg,
                'type': type,
                'fcm': localStorage.FCM,
                'imageFileIdList': imgIds
            }

            const destination = `/pub/msg`;
            const tx = client.begin();
            client.publish({
                destination: destination,
                headers: { transaction: tx.id },
                body: JSON.stringify(messageDto),
                skipContentLengthHeader: true,
            });
            tx.commit();
        });
    }

    else if (input.files.length === 0) {
        type = 'MESSAGE';

        messageDto = {
            'roomId': oldRoomID,
            'senderId': session,
            'receiverId': customerID,
            'message': msg,
            'type': type,
            'fcm': localStorage.FCM,
        }

        const destination = `/pub/msg`;
        const tx = client.begin();
        client.publish({
            destination: destination,
            headers: { transaction: tx.id },
            body: JSON.stringify(messageDto),
            skipContentLengthHeader: true,
        });
        tx.commit();
    }


    
    $('#chatImgContainer').addClass('d-none');
    input.value = "";
    $('#mgsSendInput').val(null);

    
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
    console.log(input.files);
})