// 2 PAGE ACCORDION
function check_accordion2 (page1, page2, btn, accordion) {
    if ($("#" + page1).hasClass("d-block") ||
        $("#" + page2).hasClass("d-block")) {
        // do nothing
    }
    else if ($("#" + page1).hasClass("d-none") ||
        $("#" + page2).hasClass("d-none")) {
        $("#" + btn).addClass('collapsed');
        $("#" + accordion).removeClass('show');
    }
}

// 4 PAGE ACCORDION
function check_accordion4 (page1, page2, page3, page4, btn, accordion) {
    if ($("#" + page1).hasClass("d-block") ||
        $("#" + page2).hasClass("d-block") ||
        $("#" + page3).hasClass("d-block") ||
        $("#" + page4).hasClass("d-block")) {
        // do nothing
    }
    else if ($("#" + page1).hasClass("d-none") ||
        $("#" + page2).hasClass("d-none") ||
        $("#" + page3).hasClass("d-none") ||
        $("#" + page4).hasClass("d-none")) {
        $("#" + btn).addClass('collapsed');
        $("#" + accordion).removeClass('show');
    }
}

// NO BUTTON PAGE
function check_page1(page) {
    if ($("#" + page).hasClass("d-block")) {
        $("#" + page).addClass("d-none").removeClass("d-block");
    }

    if($(document.body).hasClass('overflow-y-hidden')) {
        $(document.body).removeClass('overflow-y-hidden');
    }
}

// HAS BUTTON PAGE
function check_page2(page, btn) {
    if ($("#" + page).hasClass("d-block")) {
        $("#" + page).addClass("d-none").removeClass("d-block");
        $("#" + btn).removeClass('active');
    }
    
    if ($(document.body).hasClass('overflow-y-hidden')) {
        $(document.body).removeClass('overflow-y-hidden');
    }
} 

// WITH ADD ONS
function check_div(div, btn, addon) {
    if ($("#" + div).hasClass("d-flex")) {
        $("#" + div).addClass("d-none").removeClass("d-flex");
        $("#" + btn).removeClass("active");
        $("#" + addon).addClass("d-none").removeClass("d-block");
    }
}

// viewAll contract page set default open
function setDefault_viewallcontracts() {
    if ($('#viewallcontracts-01_div').hasClass('d-none')) {
        $('#viewallcontracts-01_btn').addClass('active');
        $('#viewallcontracts-01_div').addClass('d-flex').removeClass('d-none');
        $('#viewallcontracts_selectapartmentcomplex01_div').addClass('d-block').removeClass('d-none');
    }

    if ($('#viewallcontracts-02_div').hasClass('d-flex')) {
        $('#viewallcontracts-02_btn').removeClass('active');
        $('#viewallcontracts-02_div').removeClass('d-flex').addClass('d-none');
        $('#viewallcontracts_selectapartmentcomplex02_div').removeClass('d-block').addClass('d-none');

        $('#viewallcontracts-01_btn').addClass('active');
        $('#viewallcontracts-01_div').addClass('d-flex').removeClass('d-none');
        $('#viewallcontracts_selectapartmentcomplex01_div').addClass('d-block').removeClass('d-none');
    }

    if ($('#viewallcontracts-03_div').hasClass('d-flex')) {
        $('#viewallcontracts-03_btn').removeClass('active');
        $('#viewallcontracts-03_div').removeClass('d-flex').addClass('d-none');
        $('#viewallcontracts_calendar_div').removeClass('d-block').addClass('d-none');

        $('#viewallcontracts-01_btn').addClass('active');
        $('#viewallcontracts-01_div').addClass('d-flex').removeClass('d-none');
        $('#viewallcontracts_selectapartmentcomplex01_div').addClass('d-block').removeClass('d-none');
    }
}

// fair management page set default open
function setDefault_fairmanagement() {
    if ($('#fairmanagement-01_div').hasClass('d-none')) {
        $('#fairmanagement-01_btn').addClass('active');
        $('#fairmanagement-01_div').addClass('d-flex').removeClass('d-none');
        $('#fairmanagement-01_title').addClass('d-block').removeClass('d-none');
    }

    if ($('#fairmanagement-02_div').hasClass('d-flex')) {
        $('#fairmanagement-02_btn').removeClass('active');
        $('#fairmanagement-02_div').removeClass('d-flex').addClass('d-none');
        $('#fairmanagement-02_title').removeClass('d-block').addClass('d-none');

        $('#fairmanagement-01_btn').addClass('active');
        $('#fairmanagement-01_div').addClass('d-flex').removeClass('d-none');
        $('#fairmanagement-01_title').addClass('d-block').removeClass('d-none');
    }
}

// 16
function setDefault_cardusagehistory() {
    if ($('#cardusagehistory-01_div').hasClass('d-none')) {
        $('#cardusagehistory-01_btn').addClass('active');
        $('#cardusagehistory-01_div').addClass('d-flex').removeClass('d-none');
        $('#cardusagehistory_date01_div').addClass('d-block').removeClass('d-none');
    }

    if ($('#cardusagehistory-02_div').hasClass('d-flex')) {
        $('#cardusagehistory-02_btn').removeClass('active');
        $('#cardusagehistory-02_div').removeClass('d-flex').addClass('d-none');
        $('#cardusagehistory_card02_div').removeClass('d-block').addClass('d-none');

        $('#cardusagehistory-01_btn').addClass('active');
        $('#cardusagehistory-01_div').addClass('d-flex').removeClass('d-none');
        $('#cardusagehistory_date01_div').addClass('d-block').removeClass('d-none');
    }

    if ($('#cardusagehistory-03_div').hasClass('d-flex')) {
        $('#cardusagehistory-03_btn').removeClass('active');
        $('#cardusagehistory-03_div').removeClass('d-flex').addClass('d-none');
        $('#cardusagehistory_account03_div').removeClass('d-block').addClass('d-none');

        $('#cardusagehistory-01_btn').addClass('active');
        $('#cardusagehistory-01_div').addClass('d-flex').removeClass('d-none');
        $('#cardusagehistory_date01_div').addClass('d-block').removeClass('d-none');
    }
}

// master page set default open
function setDefault_master() {
    if ($('#subscriberManagement').hasClass('d-none')) {
        $('#subscriberManagement').addClass('d-block').removeClass('d-none');
    }

    if ($('#constructorManagement').hasClass('d-block')) {
        $('#constructorManagement').addClass('d-none').removeClass('d-block');
    }

    if ($('#superAdmin').hasClass('d-block')) {
        $('#superAdmin').addClass('d-none').removeClass('d-block');
    }
}

// scroll to Top
let scrollBtn = document.getElementById("scrollToTop");
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// dates
function setDateToday() {
    let dateToday = new Date();
    return dateToday.getFullYear() + '-' + stringMonthDate(dateToday.getMonth() + 1) + '-' + stringMonthDate(dateToday.getDate());
}

function splitChar(string) {
    var strng = ''
    if (string.charAt(0) == '0') {
        strng = string.charAt(1);
    } else {
        strng = string;
    }
    return strng;
}

function stringMonthDate(number) {
    var string = String(number).padStart(2, '0');
    return string;
}

function formatDate(date) {
    var newDate = new Date(date);
    return newDate.getFullYear() + '-' + stringMonthDate(newDate.getMonth() + 1) + '-' + stringMonthDate(newDate.getDate());
}


function getCurrMonthTime() {
    const dateNow = new Date();
    const yy = dateNow.getFullYear();
    const MM = stringMonthDate(dateNow.getMonth() + 1);
    const dd = `01`;
    const HH = `00`;
    const mm = `00`;
    const ss = `00`;

    return `${yy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

function getPosDate(date) {
    const posDate = new Date(date);
    return posDate.getFullYear() + '-' + stringMonthDate(posDate.getMonth() + 1) + '-' + stringMonthDate(posDate.getDate());
}

function joinDate(yy, mm, dd) {
    return yy + '-' + mm + '-' + dd;
}


//  randomKeys
function generateRandomKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

// remove file from input[type=file]
function removeFile(filename, inputfile) {
    const input = document.querySelector('#' + inputfile);
    const files = input.files;
    for (var i = 0; i < files.length; i++) {
        if (files[i].name === filename) {
            var newFiles = new Array();
            for (var j = 0; j < files.length; j++) {
                if (j !== i) {
                    newFiles.push(files[j]);
                }
            }
            var dataTransfer = new DataTransfer();
            for (var k = 0; k < newFiles.length; k++) {
                dataTransfer.items.add(newFiles[k]);
            }
            input.files = dataTransfer.files;
            break;
        }
    }
}

function chatImgDisplayStyle(imgs) {
    const numImages = imgs.length;
    let width, height, maxwidth;
    if (numImages === 1) {
        width = 230;
        height = 230;
        maxwidth = 472;
    } else if (numImages === 2) {
        width = 200;
        height = 200;
        maxwidth = 416;
    } else if (numImages === 3 || numImages >= 5) {
        width = 150;
        height = 150;
        maxwidth = 474;
    } else if (numImages === 4) {
        width = 150;
        height = 150;
        maxwidth = 316;
    } 

    let dimension = {
        'width': width,
        'height': height,
        'maxwidth' : maxwidth
    }

    return dimension;
}