const acType = $('#acselectType');
const acSearch = $('#acsearchText');
const acSelect = $('#acapartmentsearch');

const arType = $('#arselectType');
const arSearch = $('#arsearchText');
const arSelect = $('#arapartmentsearch');

const acWorkingList = `http://210.99.223.38:8081/api/working?constructorId=${localStorage.LoginSession}`;
const arWorkingList = `http://210.99.223.38:8081/api/working?constructorId=${localStorage.LoginSession}&showByNoPay=true`;


// select option display
function cvSelectDisplay(container, template) {
    const apartUrl = `http://210.99.223.38:8081/api/constructor/apartment/other/list?constructorId=${localStorage.LoginSession}`;
    const results = getData(apartUrl).data;
    $('#' + container).empty();
    const placeholder = `<option></option>`;
    const all = `<option value="전체">전체</option>`;
    $('#' + container).prepend(placeholder);
    $('#' + container).prepend(all);

    $.each(results, function (i, d) {
        const templateData = {
            'id': d.id,
            'name': d.name
        }
        mustacheTemplating(container, template, templateData);
    })
}

// display data now
function displayContractData(container, template, data) {
    $.each(data, function (i, d) {
        const templateData = {
            'contractID': d.contractID,
            'createAt': d.createAt,
            'homeName': d.homeName,
            'homeDong': d.homeDong,
            'homeHosu': d.homeHosu,
            'homeType': d.homeType,
            'homePyeong': d.homePyeong,
            'phoneNumber': d.phoneNumber,
            'name': d.name,
            'productName': d.productName,
            'price': d.price,
            'requestDate': d.requestDate,
            'requestDate_class': d.requestDate_class,
            'workDate': d.workDate,
            'workDate_class': d.workDate_class,
            'note': d.note,
            'constructorId': data.userConstructorId,
            'userConstructorName': d.userConstructorName,
            'completeConstruct': d.completeConstruct,
            'completeConstruct_class': d.completeConstruct_class,
            'completePay': d.completePay,
            'completePay_class': d.completePay_class
        }
        mustacheTemplating(container, template, templateData);
    })
}

// modify data
function newContractData(data) {
    const newData = [];
    const rawData = data;

    var num = 0;
    $.each(rawData, function (i, data) {
        let constructStat;
        let payStat;
        let constructStat_class;
        let payStat_class;
        constructStat = (data.completeConstruct === true) ? "Y" : "N";
        payStat = (data.payStat === true) ? "Y" : "N";
        constructStat_class = (data.completeConstruct === true) ? "text-primary fw-bold" : "text-danger fw-bold";
        payStat_class = (data.payStat === true) ? "text-primary fw-bold" : "text-danger fw-bold";

        newData[i] = {
            'contractID': data.id,
            'createAt': data.createAt,
            'homeName': data.homeName,
            'homeDong': data.homeDong,
            'homeHosu': data.homeHosu,
            'homeType': data.homeType,
            'homePyeong': data.homePyeong,
            'phoneNumber': data.phoneNumber,
            'name': data.name,
            'productName': data.productName,
            'price': data.price,
            'requestDate': data.requestDate,
            'requestDate_class': 'text-primary fw-bold',
            'workDate': data.workDate,
            'workDate_class': 'text-danger fw-bold',
            'note': data.note,
            'constructorId': data.userConstructorId,
            'userConstructorName': data.userConstructorName,
            'completeConstruct': constructStat,
            'completeConstruct_class': constructStat_class,
            'completePay': payStat,
            'completePay_class': payStat_class
        }
        num++;
    });
    return newData;
}

// modal show CONTRACT DETAILS
function viewContractDetails(thisElem) {
    const id = thisElem.getAttribute('data-contractID');
    const url = `http://210.99.223.38:8081/api/working/estimate?workingId=${id}`;
    
    let title = '계약 내용';
    let modalContainer = 'globalModalNC';
    modalNC(title, modalContainer);

    let container = 'globalModalContNC';
    let template = 'contractDetailsTemplate';
    $('#' + container).empty();

    const result = getData(url).data;

    const data = {
        'name': result.customerName,
        'phoneNumber': result.phoneNumber,
        'address': result.apartmentName,
        'addressDetail': `${result.east}동 ${result.lake}호`,
        'type': result.type,
        'average': result.planeWater,
        'product': result.productName,
        'note': result.note,
        'moveInDate': result.moveInDate,
        'moveInConfirm': result.isConfirmationMoveInDate,
        'requestDate': result.dateOfRequestForConstruction,
        'requestConfirm': result.isConfirmationDateOfRequestForConstruction,
        'cashReceipt': result.isCashReceipt,
    }
    mustacheTemplating(container, template, data);


    $('#contractMoveInConfirm').attr('checked', result.isConfirmationMoveInDate);
    $('#contractRequestConfirm').attr('checked', result.isConfirmationDateOfRequestForConstruction);
    $('#contractReceipt').attr('checked', result.isCashReceipt);

    if ($('#contractReceipt').is(':checked') === true) {
        $('#contractReceiptDiv').removeClass('d-none')

        if (result.cashReceiptPurpose === true) {
            $('#contractIncomeDeduction').attr('checked', true);
            $('#contractProofExpend').attr('checked', false);
        } else if (result.cashReceiptPurpose === false) {
            $('#contractIncomeDeduction').attr('checked', false);
            $('#contractProofExpend').attr('checked', true);
        }
    }

    $('#' + container).find('input[type="text"], input[type="date"], textarea').prop('readonly', true).css('background', 'transparent');
    $('#' + container).find('input[type="radio"]').prop('disabled', true);
}

// display DATA ON AC TABLE
function displayACTableData(data) {
    const ACTable = "viewallcontractsbyac_table";
    const ACTemplate = "contracttable_template";
    const ACContainer = "contractac_cont";
    dtDestroy(ACTable, ACContainer);
    displayContractData(ACContainer, ACTemplate, newContractData(data));
    noSearchDataTable(ACTable);
}

// display DATA ON AR TABLE
function displayARTableData(data) {
    const ARTable = "viewallcontractsbyar_table";
    const ARTemplate = "contracttable_template";
    const ARContainer = "contractar_cont";
    dtDestroy(ARTable, ARContainer);
    displayContractData(ARContainer, ARTemplate, newContractData(data));
    noSearchDataTable(ARTable);
}

// onload page
$('#viewallcontracts_btn, #viewallcontracts-01_btn').on('click', function () {
    acSearch.val(null);
    acSelect.val(null);
    acType.val('선택');
    
    // display table data
    const results = getData(acWorkingList).data;
    displayACTableData(results);


    // display select option
    const ACSelectCont = "acapartmentsearch";
    const ACSelectTemplate = "cvselectTemplate";
    cvSelectDisplay(ACSelectCont, ACSelectTemplate);
})

// ac search btn
$('#acsearchBtn').on('click', function () {
    const type = acType.val();
    const apartment = acSelect.val();
    var string = acSearch.val();

    if (type === '선택') { return };

    if (type === 'phone') {
        if (apartment.length === 0 || apartment === '전체') {
            if (!string) {
                const results = getData(acWorkingList).data;
                displayACTableData(results);
            }

            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&phoneNumber=${string.trim()}`;
                console.log(url)
                const results = getData(url).data;
                console.log(results);
                displayACTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}phoneNumber=${string.trim()}`;
            const results = getData(url).data;
            displayACTableData(results);
        }
    }

    else if (type === 'lake') {
        const dongHosu = string.split(' ');
        const dong = dongHosu[0];
        const hosu = dongHosu[1];

        if (dongHosu.length === 1) { return; }

        if (apartment.length <= 0 || apartment === '전체') {
            if (!string) {
                const results = getData(acWorkingList).data;
                displayACTableData(results);
            }
            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}`;
                const results = getData(url).data;
                displayACTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}`;
            const results = getData(url).data;
            displayACTableData(results);
        }
    }
})

// onchange ac search
$('#acapartmentsearch').on('change', function () {
    const type = acType.val();
    const apartment = acSelect.val();
    var string = acSearch.val();

    if (type === '선택') { 
        const url = `http://210.99.223.38:8081/api/working/apartment?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}`;
        const results = getData(url).data;
        displayACTableData(results);
    }

    else if (type === 'phone') {
        if (apartment.length === 0 || apartment === '전체') {
            if (!string) {
                const results = getData(acWorkingList).data;
                displayACTableData(results);
            }
            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&phoneNumber=${string.trim()}`;
                const results = getData(url);
                displayACTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}phoneNumber=${string.trim()}`;
            const results = getData(url).data;
            displayACTableData(results);
        }
    }

    else if (type === 'lake') {
        const dongHosu = string.split(' ');
        const dong = dongHosu[0];
        const hosu = dongHosu[1];

        if (apartment.length <= 0 || apartment === '전체') {
            if (!string) {
                const results = getData(acWorkingList).data;
                displayACTableData(results);
            }
            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}`;
                const results = getData(url).data;
                displayACTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}`;
            const results = getData(url).data;
            displayACTableData(results);
        }
    }
})

$('#viewallcontracts-02_btn').on('click', function () {
    arSearch.val(null);
    arSelect.val(null);
    arType.val('선택');

    // display table data
    const results = getData(arWorkingList).data;
    displayARTableData(results);


    // display select option
    const ARSelectCont = "arapartmentsearch";
    const ARSelectTemplate = "cvselectTemplate";
    cvSelectDisplay(ARSelectCont, ARSelectTemplate);
})

// ar search btn
$('#arsearchBtn').on('click', function () {
    const type = arType.val();
    const apartment = arSelect.val();
    var string = arSearch.val();

    if (type === '선택') { return };

    if (type === 'phone') {
        if (apartment.length === 0 || apartment === '전체') {
            if (!string) {
                const results = getData(arWorkingList).data;
                displayARTableData(results);
            }

            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&phoneNumber=${string.trim()}&showByNoPay=true`;
                console.log(url)
                const results = getData(url).data;
                console.log(results);
                displayARTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}phoneNumber=${string.trim()}&showByNoPay=true`;
            const results = getData(url).data;
            displayARTableData(results);
        }
    }

    else if (type === 'lake') {
        const dongHosu = string.split(' ');
        const dong = dongHosu[0];
        const hosu = dongHosu[1];

        if (dongHosu.length === 1) { return; }

        if (apartment.length <= 0 || apartment === '전체') {
            if (!string) {
                const results = getData(acWorkingList).data;
                displayARTableData(results);
            }
            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}&showByNoPay=true`;
                const results = getData(url).data;
                displayARTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}&showByNoPay=true`;
            const results = getData(url).data;
            displayARTableData(results);
        }
    }
})

// onchange ar search
$('#arapartmentsearch').on('change', function () {
    const type = arType.val();
    const apartment = arSelect.val();
    var string = arSearch.val();

    if (type === '선택') {
        const url = `http://210.99.223.38:8081/api/working/apartment?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}&showByNoPay=true`;
        const results = getData(url).data;
        displayARTableData(results);
    }

    else if (type === 'phone') {
        if (apartment.length === 0 || apartment === '전체') {
            if (!string) {
                const results = getData(arWorkingList).data;
                displayARTableData(results);
            }
            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&phoneNumber=${string.trim()}&showByNoPay=true`;
                const results = getData(url);
                displayARTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/phone-number?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}phoneNumber=${string.trim()}&showByNoPay=true`;
            const results = getData(url).data;
            displayARTableData(results);
        }
    }

    else if (type === 'lake') {
        const dongHosu = string.split(' ');
        const dong = dongHosu[0];
        const hosu = dongHosu[1];

        if (apartment.length <= 0 || apartment === '전체') {
            if (!string) {
                const results = getData(arWorkingList).data;
                displayARTableData(results);
            }
            else if (string) {
                const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}&showByNoPay=true`;
                const results = getData(url).data;
                displayARTableData(results);
            }
        }
        else if (apartment.length > 0) {
            const url = `http://210.99.223.38:8081/api/working/dong-hosu?constructorId=${localStorage.LoginSession}&apartmentId=${apartment}&apartmentDong=${dong.trim()}&apartmentHosu=${hosu.trim()}&showByNoPay=true`;
            const results = getData(url).data;
            displayARTableData(results);
        }
    }
})


/** SELECT2 OPTIONS */
// view all contracts by ac
$('#acapartmentsearch').select2({
    theme: 'bootstrap-5',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
});

// view all contracts by ar
$('#arapartmentsearch').select2({
    theme: 'bootstrap-5',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
});
