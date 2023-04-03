// connect to stomp
const stompConnected = () => { console.log('Stomp is Connected.'); }
const stompError = () => { client.reconnect_delay = 200; }
const stompUrl = `ws://210.99.223.38:8081/ws`;
const headers = {
    login: localStorage.Headers,
    passcode: localStorage.Body
}


const client = new StompJs.Client({
    brokerURL: stompUrl,
    connectHeaders: headers,
    debug: function (str) { },
    reconnectDelay: 500,
    heartbeatIncoming: 500,
    heartbeatOutgoing: 500,
});

client.onConnect = function (frame) { stompConnected(); };
client.onStompError = function (frame) { stompError(); };

const sessionStorage = window.sessionStorage;
const sessionKey = generateRandomKey(10);
var subscription, stompReceiver;
const localKey = localStorage.getItem('localKey');
const login = localStorage.getItem('localHeaders');
const passcode = localStorage.getItem('localBody');
const fcm = localStorage.getItem('localRandomKey');
const roomStomp = localStorage.getItem('localRoom');
let fetchingkey;
// const localKey = localStorage.getItem('LocalKey');
let auths = { 
        'id': localKey, 
        'login': login, 
        'passcode': passcode, 
        'fcm': fcm 
    };

$(document).ready(function () {
    if (localStorage.getItem('localRoom')) { localStorage.removeItem('localRoom'); }
    activeStomp();
})

function activeStomp() {
    if (!client.connected) { client.activate(); }
}

function deactiveStomp() {
    if (client.connected) { client.deactivate(); }
}

function unsubscribeStomp() {
    if (localStorage.getItem('localRoom')) { 
        localStorage.removeItem('localRoom');
        subscription.unsubscribe();
        console.log('unsub: ', subscription);
    }
}

function onMessageStomp(message) {
    displayCurrChats(message.body);
    message.ack();
    // autoScrollToBotMsg();
}

function subscribeStomp(roomID) {
    const room = `/topic/room.${roomID}`;
    const headers = { ack: 'client' };
    subscription = client.subscribe(room, onMessageStomp, headers);

    console.log(subscription);
}

function publishStomp(messageDto) {
    console.log(messageDto);
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

function displayCurrChats(mgs) {
    const res = JSON.parse(mgs);
    // console.log(res);
    if (res.id) {
        let html;
        const imgChat = res.imageFileIdList;
        const type = res.type;
        const mgsTime = res.createAt;
        const createAt = res.createAt.split('T');
        const chatTime = createAt[1].split('.');
        const chatTT = chatTime[0].split(':');
        const chatTimeJoin = `${chatTT[0]}:${chatTT[1]}`;
        const mgsSender = res.senderId;

        if (mgsSender != auths.id) {
            if (type === 'MESSAGE') {
                html = `<div id='mgsread${res.id}' class='mgsread' data-mgs-type='${type}' data-date='${mgsTime}'>
                            <div class='mgsread-content'>
                                <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' />
                                <div class='mgsread-mgs'> ${res.message} </div>
                                <div class='mgsread-time'> ${chatTimeJoin} </div>
                            </div>
                        </div>`;
            }
            else if (type === 'IMAGE') {
                const maxwidth = chatImgDisplayStyle(imgChat).maxwidth;
                const width = chatImgDisplayStyle(imgChat).width;
                const height = chatImgDisplayStyle(imgChat).height;
                const imgs = (imgChat, width, height, id) => {
                    const imgElements = imgChat.map((imageName) => {
                        const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                        return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}" style='width: ${width}px; height: ${height}px;'>
                                    <img src='${imgData}' alt='chat-img' class='img-fluid' style='height: ${height}px;'/>
                                </a>`;
                    }).join('');

                    return imgElements;
                }

                html = `<div id='mgsread${res.id}' class='mgsread' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgsread-content'>
                                    <img src='./assets/img/images/tree.png' alt='profile-pic' height='26' width='26' class="mb-2" />
                                    <div class='mgsread-imgs' style='max-width: ${maxwidth}px !important'> ${imgs(imgChat, width, height, res.id)} </div>
                                    <div class='mgsread-time mb-2'> ${chatTimeJoin} </div>
                                </div>
                            </div>`;
            }
        }

        else if (mgsSender === auths.id) {
            if (type === 'MESSAGE') {
                html = `<div id='mgssend${res.id}' class='mgssend' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgssend-content'>
                                    <div class="mgssend-time">
                                        <span class='sendviewed text-end'>1</span>
                                        <span class='sendtime'> ${chatTimeJoin} </span>
                                    </div> 
                                    <div class='mgssend-mgs'> ${res.message} </div>
                                </div>
                            </div>`;
            }

            else if (type === 'IMAGE') {
                const maxwidth = chatImgDisplayStyle(imgChat).maxwidth;
                const width = chatImgDisplayStyle(imgChat).width;
                const height = chatImgDisplayStyle(imgChat).height;
                const imgs = (imgChat, width, height, id) => {
                    const imgElements = imgChat.map((imageName) => {
                        const imgData = `http://210.99.223.38:8081/api/chat/image?chatImageFileName=${imageName}`;
                        return `<a href="${imgData}" target="_blank" data-lightbox="msgImg${id}" style='width: ${width}px; height: ${height}px;'>
                                    <img src='${imgData}' alt='chat-img' class='img-fluid' style='height: ${height}px;'/>
                                </a>`;
                    }).join('');

                    return imgElements;
                }

                html = `<div id='mgssend${res.id}' class='mgssend' data-mgs-type='${type}' data-date='${mgsTime}'>
                                <div class='mgssend-content'>
                                    <div class="mgssend-time mb-2">
                                        <span class='sendviewed text-end'>1</span>
                                        <span class='sendtime'> ${chatTimeJoin} </span>
                                    </div> 
                                    <div class='mgssend-imgs' style="max-width: ${maxwidth}px !important"> ${imgs(imgChat, width, height, res.id)} </div>
                                </div>
                            </div>`;
            }
        }

        const lastChatDate = $('#chatMsgHistory .chatDate').last().attr('data-chatdate');
        console.log(lastChatDate);
        const cdd = new Date().toISOString().substring(0, 10);
        const sdd = cdd.split('-');
        const dd = `${sdd[0]}년 ${sdd[1]}월 ${sdd[2]}일`;
        const dateTemplate = `<div class="chatDate text-center fs-14px" data-chatDate='${cdd}'>${dd}</div>`;

        if (lastChatDate != cdd) {
            $('#chatMsgHistory').append(dateTemplate);
            $('#chatMsgHistory').append(html);
            autoScrollToBotMsg();
        } else {
            $('#chatMsgHistory').append(html);
            autoScrollToBotMsg();
        }
    }

    else if (res.customerCount) {
        console.log(res);
        // if(res.customerCount != 0) {
        //     $('.sendviewed').text(null);
        // }
    }
}