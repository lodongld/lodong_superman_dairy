function displayOrderStatus() {
    const url = `http://210.99.223.38:8081/api/order/order-status/list?constructorId=${auths.id}`;
    const result = getData(url).data;
    const container = "orderstatus_cont";
    const template = "orderstatusTemp";
    $('#' + container).empty();

    $.each(result, function (i, d) {
        let measureDate, orderDate;
        let orderFileArr = [];
        if (!(d.dateOfMeasurement)) { measureDate = null; } 
        else { measureDate = d.dateOfMeasurement.replaceAll('-', '/') }

        if (!(d.dateOfOrder)) { orderDate = null; }
        else { orderDate = d.dateOfOrder.replaceAll('-', '/') }

        if (!(d.orderFileId)) { orderFileArr = [] }
        else { orderFileArr = d.orderFileId; } 
        let tempData = {
            'apartmentName': d.apartmentName,
            'measureDate': measureDate,
            'orderDate': orderDate,
            'east': d.east,
            'estimateId': d.estimateId,
            'construct': d.isConstruct,
            'forwarding': d.isForwarding,
            'lake': d.lake,
            'manuDate': d.manufacturingCompleteDate,
            'orderFileId': orderFileArr,
            'workingId': d.workingId,
        }
        mustacheTemplating(container, template, tempData);
        $('#osForward'+d.workingId).prop('checked', d.isForwarding);
        $('#osConstruct'+d.workingId).prop('checked', d.isConstruct);
    })
}

function viewOrderImages(thisElem) {
    const id = thisElem.getAttribute('data-id');
    const array = thisElem.getAttribute('data-array');
    $('#orderFiles').empty();
    // console.log(array);
    if(array) {
        const fileIds = array.split(',');
        $.each(fileIds, function(i, d) {
            const src = `http://210.99.223.38:8081/api/order/order-status/image?orderFileId=${d}`;
            const template =    `<div class="box">
                                    <a href="${src}" data-lightbox="orderFileImage">
                                        <img src="${src}" alt="photo">
                                    </a>
                                </div>`;
            $('#orderFiles').append(template);
        })
        $('#orderFiles .box:first-child a').trigger('click');
    }
    else if (!array) {
        const title = '주문 파일';
        const modalname = 'globalModal';
        modal(title, modalname);
        const template = 'orderFilesTemp';
        const container = 'globalModalCont';
        const message = { 'message': '이미지 없음' }
        $('#' + container).empty();
        mustacheTemplating(container, template, message);
    }
}

function viewOrderStatusDetails(thisElem) {
    const id = thisElem.getAttribute('data-contractID');
    const url = `http://210.99.223.38:8081/api/working/estimate?workingId=${id}`;

    const title = '발주현황';
    const modalContainer = 'globalModalNC';
    modalNC(title, modalContainer);

    const container = 'globalModalContNC';
    const template = 'estimateDetailsTemplate';
    $('#' + container).empty();
    const result = getData(url).data;

    let moveDate, workDate, cashReceipt;
    if (result.moveInDate) { moveDate = result.moveInDate.replaceAll('-',' / '); }
    if (result.dateOfRequestForConstruction) { workDate = result.dateOfRequestForConstruction.replaceAll('-', ' / '); }
    if (result.isCashReceipt === true ) {
        if (result.cashReceiptPurpose === true ) { cashReceipt = `소득공제용 (${result.cashReceiptPhoneNumber})`;}
        else if (result.cashReceiptPurpose === false) { cashReceipt = `지출증빙용 (${result.cashReceiptPhoneNumber})`; }
    }
    const products = result.estimateDetails;
    const discounts = result.discounts;
    const data = {
        'name': result.customerName,
        'phoneNumber': result.phoneNumber,
        'address': result.apartmentName,
        'addressDetail': `${result.east}동 ${result.lake}호`,
        'type': result.type,
        'average': result.planeWater,
        'moveInDate': moveDate,
        'moveInConfirm': result.isConfirmationMoveInDate,
        'requestDate': workDate,
        'requestConfirm': result.isConfirmationDateOfRequestForConstruction,
        'cashReceipt': cashReceipt,
        'product': result.productName,
        'downpayment': result.downPayment,
        'note': result.note,
        'vat': result.isVat,
        'price': result.price,
    }
    mustacheTemplating(container, template, data);
    osDisplayProductsModal(products);
    osDisplayDiscountsModal(discounts);
    $('#moveinconfi').attr('checked', result.isConfirmationMoveInDate);
    $('#workinconfi').attr('checked', result.isConfirmationDateOfRequestForConstruction);
    $('#estvat').attr('checked', result.isVat);

    $('#' + container).find('input[type="checkbox"]').prop('disabled', true);
}

function osDisplayProductsModal(arr) {
    if (arr.length > 0) {
        $('#estDetailsMidProductBody').empty();
        $.each(arr, function (i, d) {
            const template = `<div class="border-bottom py-1 px-3">
                                <div class="row gy-2">
                                    <div class="col-4 text-center">
                                        <span class="text-center"> ${d.productName} </span>
                                    </div>
                                    <div class="col-4 text-center">
                                        <span class="text-center"> ${d.count} </span>
                                    </div>
                                    <div class="col-4 text-center">
                                        <span class="text-center"> ${d.price} </span>
                                    </div>
                                </div>
                            </div>`;

            $('#estDetailsMidProductBody').append(template);
        })
    }
}

function osDisplayDiscountsModal(arr) {
    if (arr.length > 0) {
        $('#estDetailsMidDiscountContent').empty();
        $.each(arr, function (i, d) {
            const template = `<div class="border-bottom py-1 px-3">
                                <div class="row gy-2">
                                    <div class="col-4 text-center">
                                        <span class="fw-bold text-center"> 할인 </span>
                                    </div>
                                    <div class="col-4 text-center">
                                        <span class="text-center"> ${d.discountContent} </span>
                                    </div>
                                    <div class="col-4 text-center">
                                        <span class="fw-bold text-center"> -${d.discount} </span>
                                    </div>
                                </div>
                            </div>`;

            $('#estDetailsMidDiscountContent').append(template);
        })
    }
}

function osManuDate(thisElem) {
    const id = thisElem.getAttribute('data-id');
    console.log(id);
    const forward = $('#osForward' + id).is(":checked");
    const construct = $('#osConstruct' + id).is(":checked");
    const manuDateVal = $('#osManuDate' + id).val();
    let manuDate;

    
    if (!manuDateVal) { manuDate = null; }
    else { 
        let newmanuDate = new Date(manuDateVal);
        let year = newmanuDate.getFullYear();
        let month = newmanuDate.getMonth() + 1;
        let date = newmanuDate.getDate();
        manuDate = [year, stringMonthDate(month), stringMonthDate(date)].join('-');
    }

    const data = {
        "workingId": id,
        "manufacturingCompleteDate": manuDate,
        "isForwarding": forward,
        "isConstruct": construct
    }

    console.log(data);
    updateOS(data);
}

function osForward(thisElem) {
    const id = thisElem.getAttribute('data-id');
    console.log(id);
    const forward = $('#osForward' + id).is(":checked");
    const construct = $('#osConstruct' + id).is(":checked");
    const manuDateVal = $('#osManuDate' + id).val();
    let manuDate;


    if (!manuDateVal) { manuDate = null; }
    else {
        let newmanuDate = new Date(manuDateVal);
        let year = newmanuDate.getFullYear();
        let month = newmanuDate.getMonth() + 1;
        let date = newmanuDate.getDate();
        manuDate = [year, stringMonthDate(month), stringMonthDate(date)].join('-');
    }

    const data = {
        "workingId": id,
        "manufacturingCompleteDate": manuDate,
        "isForwarding": forward,
        "isConstruct": construct
    }

    console.log(data);
    updateOS(data);
}

function osConstruct(thisElem) {
    const id = thisElem.getAttribute('data-id');
    console.log(id);
    const forward = $('#osForward' + id).is(":checked");
    const construct = $('#osConstruct' + id).is(":checked");
    const manuDateVal = $('#osManuDate' + id).val();
    let manuDate;


    if (!manuDateVal) { manuDate = null; }
    else {
        let newmanuDate = new Date(manuDateVal);
        let year = newmanuDate.getFullYear();
        let month = newmanuDate.getMonth() + 1;
        let date = newmanuDate.getDate();
        manuDate = [year, stringMonthDate(month), stringMonthDate(date)].join('-');
    }

    const data = {
        "workingId": id,
        "manufacturingCompleteDate": manuDate,
        "isForwarding": forward,
        "isConstruct": construct
    }

    console.log(data);
    updateOS(data);
}

function updateOS(data) {
    let putUrl = `http://210.99.223.38:8081/api/order/order-status`;
    putData(data, putUrl);

    $.notify("Order Status updated successfully!", "success");
}

// onload
$('#orderstatus_btn').on('click', function () {
    const table = 'orderstatus_table';
    const tbody = 'orderstatus_cont';

    dtDestroy(table, tbody)
    displayOrderStatus();
    displayHTMLTableData(table);
});