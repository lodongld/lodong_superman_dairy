function displaymainInfo(container,template,data,search){
    if(search === true) $('#'+container).empty();    
    const templateData = {
        'casenum':data.workingsNum,
        'sales':data.revenue     
    } 
    mustacheTemplating(container,template,templateData);
}

function displaymainChatting(container,template,data,search){
    const profimageurl = "http://210.99.223.38:8081/api/constructor/image?constructorId="+localStorage.LoginSession;
    if(search === true) $('#'+container).empty();
    $.each(data, function (i,d) {       
        const templateData = {
            'hcimage':profimageurl,
            'hcname':"이민지",
            'hcmessage':'안녕하세요 견적서 문의드립니다.^^',
            'hcdate':'2022-11-28'   
        } 
        mustacheTemplating(container,template,templateData);
    })
}

function displaymainrequest(container,template,data,search){
    if(search === true) $(container).empty();
    
    $.each(data, function (i,d) {       
        const templateData = {
            'homereqcustname':d.name,
            'homereqid':d.requestOrderId,
            'homereqdate':d.createAt,
            'homereqstatus':d.status     
        } 
        mustacheTemplating(container,template,templateData);
    })
}

let homeinfourl = "http://210.99.223.38:8081/api/working/num-revenue?constructorId="+session;
const homeinfodata = getData(homeinfourl).data;

const homeinfoTemp = "revenueTemp";
const homeinfoCont = "revenueCont";
displaymainInfo(homeinfoCont,homeinfoTemp,homeinfodata,true);

// let homeinfourl = "http://210.99.223.38:8081/api/working/num-revenue?constructorId="+localStorage.LoginSession;
let homechattingourl = "http://210.99.223.38:8081/api/working/num-revenue?constructorId="+session;
const homechattingdata = getData(homeinfourl).data;

const homechattingTemp = "chatTemp";
const homechattingCont = "chatCont";
displaymainChatting(homechattingCont,homechattingTemp,homechattingdata,true);

let homerequesturl = "http://210.99.223.38:8081/api/order/list?constructorId="+session;
const homerequestdata = getData(homerequesturl).data;
console.log(homerequestdata)
const homerequestTemp = "orderTemp";
const homerequestCont = "orderCont";
displaymainrequest(homerequestCont,homerequestTemp,homerequestdata,true);

$('#orderCont').on('click','.viewRequest',function(){
    let reqid = $(this).attr('data-id');
    let title = "계약서 정보";
    let modalname = "globalModal";
    modal(title,modalname);

    let container = "globalModalCont";
    let template = "requestviewtemp";

    const url = "http://210.99.223.38:8081/api/order/info?requestOrderId="+reqid;
    const dataReq = getData(url).data;
    console.log(dataReq);
    $('#globalModalCont').empty();    
    mustacheTemplating(container,template,dataReq);

    let mainapplication = document.getElementById('mainapplication');
    let mainincomeDeduct = document.getElementById('mainincomeDeduct');
    let mainproofExpend = document.getElementById('mainproofExpend');
    let mainrequestDate = document.getElementById('mainrequestDate');
    let mainmoveinDate = document.getElementById('mainmoveinDate');
    if(dataReq.isCashReceipt === true){
        mainapplication.setAttribute("checked", "checked")
        if(dataReq.cashReceiptPurpose === true) mainincomeDeduct.setAttribute("checked", "checked")
        if(dataReq.cashReceiptPurpose === true) mainproofExpend.setAttribute("checked", "checked")
    }
    if(dataReq.isConfirmationConstruct === true) mainrequestDate.setAttribute("checked", "checked")
    if(dataReq.isConfirmationLiveIn === true) mainmoveinDate.setAttribute("checked", "checked")
    
})
 