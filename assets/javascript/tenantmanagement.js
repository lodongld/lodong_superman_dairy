
let apId, hasWinners;
let inRaffle = {};
let raffleKeys = [];
let raffleKeyWinners = [];
let winnersData = {};
let toPostData = {};

function displayTenantApartment(url) {
    let container = "tenantApartmentCont";
    let template = "tenantApartmentTemp";
    let list = getData(url).data;
    // console.log(list)
    $('#' + container).empty();
    $.each(list, function (i, d) {
        let hasWinners = d.prizeDraw.toString();
        const data = {
            'apartmentId': d.apartmentId,
            'apartmentName': d.apartmentName,
            'hasWinners': hasWinners,
        }
        mustacheTemplating(container, template, data);
    })
}

function displayTenant(url) {
    let container = "tenantCont";
    let template = "tenantTemp";
    let list = getData(url).data;
    console.log(list)
    $('#' + container).empty();
    $.each(list, function (i, d) {
        const data = {
            'apartment': d.apartmentName,
            'dong': d.dong,
            'lake': d.hosu,
            'type': d.type,
            'name': d.name,
            'contactnum': d.phoneNumber,
            'numcontract': d.workingNum
        }
        mustacheTemplating(container, template, data);
    })
}

// postWinners
function postWinnersData(data) {
    const prizeDrawDtos = [];
    $.each(data, function (i, d) {
        let tempdata = {
            'name': d.name,
            'phoneNumber': d.phoneNumber
        }
        prizeDrawDtos.push(tempdata);
    })

    toPostData = {
        'exhibitionApartmentId': apId,
        prizeDrawDtos
    };

    // console.log(toPostData);
    let postUrl = 'http://210.99.223.38:8081/api/exhibition/tenant/prize';
    postData(toPostData, postUrl);

    // // for testing only
    // let getUrl = 'http://210.99.223.38:8081/api/exhibition/tenant/prize?exhibitionApartmentId=' + apId;
    // console.log(getData(getUrl).data);
}

// display winners
function displayWinners() {
    let title = "추첨 당첨자";
    let modalname = "globalModal";
    modal(title, modalname);

    // for open modal template
    let containerModal = 'globalModalCont';
    let templateModal = 'prizeDrawContTemp';
    let nodata = {}
    $('#' + containerModal).empty();
    mustacheTemplating(containerModal, templateModal, nodata);


    // for displaying the winners
    let getUrl = 'http://210.99.223.38:8081/api/exhibition/tenant/prize?exhibitionApartmentId=' + apId;
    let container = 'priceDrawPartiCont';
    let template = 'prizeDrawPartiTemp';
    let list = getData(getUrl).data;
    $('#' + container).empty();
    $.each(list, function (i, d) {
        let tempdata = {
            'name': d.name,
            'phoneNumber': d.phoneNumber
        }
        mustacheTemplating(container, template, tempdata);
    })

}

//  onload page
$('#fairmanagement-02_btn').on('click', function () {
    const tenantApartmentUrl = 'http://210.99.223.38:8081/api/exhibition/tenant/apartment/list';
    displayTenantApartment(tenantApartmentUrl);
})

// fetch tenants in the apartment
$('#tenantApartmentCont').on('change', function(e) {
    e.preventDefault();
    hasWinners = $('#tenantApartmentCont option:selected').attr('data-win');
    apId = $(this).val();
    let tenantListUrl = 'http://210.99.223.38:8081/api/exhibition/tenant?exhibitionApartmentId=' + apId;
    displayTenant(tenantListUrl);

    if (hasWinners === 'false') {
        $('#tenantCriteria').prop('disabled', false);
        $('#tenantGen').prop('disabled', false);
    } else {
        $('#tenantCriteria').prop('disabled', true);
        $('#tenantGen').prop('disabled', true);
    }
    // for testing only
    // let getUrl = 'http://210.99.223.38:8081/api/exhibition/tenant/prize?exhibitionApartmentId=' + apId;
    // console.log(getData(getUrl).data);
});

// post and show winners in raffle
$('#tenantDrawBtn').on('click', function (e) {
    const hasWinners = $('#tenantApartmentCont option:selected').attr('data-win');
    const tableDataSourceTr = $('#tenantCont tr');
    const lotCriteria = Number($('#tenantCriteria').val());
    const lotGen = Number($('#tenantGen').val());
    const aid = $('#tenantApartmentCont').val();

    
    if (hasWinners === 'true') {  displayWinners()  }
    else {

        if (tableDataSourceTr.length <= 0 || !aid || !lotCriteria || !lotGen) {return;}
    
        let numTickets;
        inRaffle = {};
        raffleKeys = [];
        raffleKeyWinners = []; 
        winnersData = {};
        
        // get each table body tr
        tableDataSourceTr.map(function(){
            let name = $(this).children(":nth-child(5)").text().trim();
            let contactnum = $(this).children(":nth-child(6)").text().trim();
            let numcontract = Number($(this).children(":nth-child(7)").text());
    
            const tempArr = {
                'name' : name,
                'phoneNumber': contactnum
            }
    
            if (numcontract < lotCriteria) { return; }
            else if (numcontract >= lotCriteria) {
                numTickets = Math.round(numcontract / lotCriteria);
    
                for(let i=0;i < numTickets; i++) {
                    const thisKey = generateRandomKey(5);
                    raffleKeys.push(thisKey);
                    inRaffle[thisKey] = tempArr;
                }
            }
        })
    
        if (lotGen < raffleKeys.length) {
            // generate winners
            for (let x = 0; x < lotGen; x++) {
                const randomIndex = Math.floor(Math.random() * raffleKeys.length);
                const selectedWinner = raffleKeys[randomIndex];
                raffleKeyWinners.push(selectedWinner);
                raffleKeys.splice(randomIndex, 1);
            }
    
            // transfer the winners data from the inRaffle{} into winnerData{}
            for (let m = 0; m < raffleKeyWinners.length; m++) {
                let index = raffleKeyWinners[m];
                winnersData[index] = inRaffle[index];
                delete inRaffle[index];
            }
            // display data from winnersData{}
            postWinnersData(winnersData);
            displayWinners();
        } 
        else if (lotGen >= raffleKeys.length) {
            postWinnersData(inRaffle);
            displayWinners();
        }
    
        const d = { inRaffle, winnersData, raffleKeys, raffleKeyWinners }
        console.log(d);
        $('#tenantCriteria').val(null);
        $('#tenantGen').val(null);
        $('#tenantApartmentCont').val(null);
    }
})

// show add tenant form
$('#tenantmanagement_div_btn').on('click', function () {
    $('#tenantmanagement_form_div').addClass('d-block').removeClass('d-none');
    $('#tenantmanagement_div').addClass('d-none').removeClass('d-block');
});

// add tenant btn
$('#addTenantBtn').on('click', function () {
    var apartmentName = $('#pdapartname').val();
    var dong = $('#pddong').val();
    var lake = $('#pdlake').val();
    var type = $('#pdtype').val();
    var name = $('#pdname').val();
    var phone = $('#pdphone').val();
    var contracts = $('#pdnumcontracts').val();


    if (!apId || !apartmentName || !dong || !lake || !type || !name || !phone || !contracts) {  return; }
    else {
        const data = { apartmentName, dong, lake, type, name, phone, contracts }
        
        console.log(data);
        const tableDataSourceBody = $('#tenantCont');

        let row = `<tr>
                    <td> ${apartmentName} </td>
                    <td> ${dong} </td>
                    <td> ${lake} </td>
                    <td> ${type} </td>
                    <td> ${name} </td>
                    <td> ${phone} </td>
                    <td> ${contracts} </td>
                  </tr> `;

        tableDataSourceBody.append(row);

        $('#pdapartname').val(null);
        $('#pddong').val(null);
        $('#pdlake').val(null);
        $('#pdtype').val(null);
        $('#pdname').val(null);
        $('#pdphone').val(null);
        $('#pdnumcontracts').val(null);

        $('#tenantmanagement_form_div').addClass('d-none').removeClass('d-block');
        $('#tenantmanagement_div').addClass('d-block').removeClass('d-none');
    }
    
    
    
    
})