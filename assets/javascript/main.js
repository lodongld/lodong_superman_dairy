function displayRevenueInfo(container, template, data) {
    $('#'+container).empty();
    const templateData = {
        'casenum': data.workingsNum,
        'sales': data.revenue
    }
    mustacheTemplating(container, template, templateData);
}

function displayHomeRooms(url) {
    let result = getData(url).data;
    // console.log(result)
    let container = "homeChatCont";
    let template = "homeChatTemplate";
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

            else if (type === 'IMAGE') { chatMgs = '[이미지 전송됨]'; }

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

function displayHomeOrder(container, template, data) {
    $('#'+container).empty();

    $.each(data, function (i, d) {
        let btnReject = d.status === "반려" ? "d-block" : "d-none";
        let btnDelete = d.status === "삭제" ? "d-block" : "d-none";
        let btnNorhold = d.status === "일반" || d.status === "보류" ? "d-block" : "d-none";

        const templateData = {
            'homeOrderCustName': d.name,
            'homeOrderId': d.requestOrderId,
            'homeOrderdate': d.createAt,
            'homeOrderstatus': d.status,
            'btnReject': btnReject,
            'btnNorhold': btnNorhold,
            'btnDelete': btnDelete

        }
        mustacheTemplating(container, template, templateData);
    })
}

// pop up modal
function homeViewOrderDetails(thisElem) {
    const id = thisElem.getAttribute('data-orderId');
    const url = `http://210.99.223.38:8081/api/order/info?requestOrderId=${id}`;

    let title = '계약 내용';
    let modalContainer = 'globalModalNC';
    modalNC(title, modalContainer);

    let container = 'globalModalContNC';
    let template = 'orderDetailsTemplate';
    $('#' + container).empty();

    const result = getData(url).data;

    const data = {
        'name': result.name,
        'phoneNumber': result.phoneNumber,
        'address': result.address,
        'addressDetail': result.addressDetail,
        'product': result.product,
        'note': result.note,
        'moveInDate': result.liveInDate,
        'requestDate': result.requestConstructDate,
        'cashReceipt': result.isCashReceipt,
        'cashReceiptNum': result.cashReceiptPhoneNumber

        // 'incomeDeduction': 
    }
    mustacheTemplating(container, template, data);


    $('#orderMoveInConfirm').attr('checked', result.isConfirmationLiveIn);
    $('#orderRequestConfirm').attr('checked', result.isConfirmationConstruct);
    $('#orderReceipt').attr('checked', result.isCashReceipt);

    if ($('#orderReceipt').is(':checked') === true) {
        $('#orderReceiptDiv').removeClass('d-none')

        if (result.cashReceiptPurpose === true) {
            $('#orderIncomeDeduction').attr('checked', true);
            $('#orderProofExpend').attr('checked', false);
        } else if (result.cashReceiptPurpose === false) {
            $('#orderIncomeDeduction').attr('checked', false);
            $('#orderProofExpend').attr('checked', true);
        }
    }

    $('#' + container).find('input[type="text"], input[type="date"], textarea').prop('readonly', true).css('background', 'transparent');
    $('#' + container).find('input[type="radio"]').prop('disabled', true);
}

$(function () {
    // display revenue
    const revenueUrl = `http://210.99.223.38:8081/api/working/num-revenue?constructorId=${localStorage.LoginSession}`;
    const revenueCont = "revenueCont";
    const revenueTemp = "revenueTemp";
    const revenueResult = getData(revenueUrl).data;
    displayRevenueInfo(revenueCont, revenueTemp, revenueResult);


    // display chats
    const roomListUrl = `http://210.99.223.38:8081/api/chat/room/list?constructorId=${session}`;
    displayHomeRooms(roomListUrl);

    // display request orders
    const orderUrl = `http://210.99.223.38:8081/api/order/list?constructorId=${localStorage.LoginSession}`;
    const orderCont = "homeOrderCont";
    const orderTemp = "homeOrderTemp";
    const orderResult = getData(orderUrl).data;
    displayHomeOrder(orderCont, orderTemp, orderResult);
})

// connect to stomp
// 
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
});

client.onConnect = function (frame) { stompConnected(); };
client.onStompError = function (frame) { stompError(); };
client.activate();