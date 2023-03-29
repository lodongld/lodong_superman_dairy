let apartmentListUrl = "http://210.99.223.38:8081/api/apartment/list";
let constructorListUrl = "http://210.99.223.38:8081/api/constructor/list";
let exApartmentUrl = "http://210.99.223.38:8081/api/exhibition/apartment";

let fairExhiId, categoryId, categoryName, constructorId, constructorName;

$.get(apartmentListUrl).then(displayApartmentList);
$.get(constructorListUrl).then(displayFairCompany);

// apartment lists
function displayApartmentList(response) {
    let container = "fmSelectApartmentList";
    let template = "fmSelectApartmentTemp";
    let list = response.data;
    // console.log(list.length)
    $('#'.container).empty();
    $.each(list, function (i, d) {
        const data = {
            'apartmentid': d.id,
            'apartmentname': d.name
        }
        mustacheTemplating(container, template, data);
    });
}

// all constructor list
function displayFairCompany(response) {
    let container = "fmConstructorCont";
    let template = "fmConstructorTemp";
    let list = response.data;
    $('#' + container).empty();
    $.each(list, function (i, d) {
        const data = {
            'contructorId': d.constructorId,
            'contructorName': d.constructorName
        }
        mustacheTemplating(container, template, data);
    });
}

// exhibition apartment list
function displayFairApartment(url) {
    let container = "fairExhibitionCont";
    let template = "fairExhibitionTemp";
    $('#' + container).empty();
    let list = getData(url).data;
    $.each(list, function (i, d) {
        let name = "[" + d.apartmentId + "] " + d.apartmentName;
        const data = {
            'exhibitionId': d.exhibitionId,
            'exhitionName': name
        }
        mustacheTemplating(container, template, data);
    })
}

// display FairCategory
function displayFairCategory(url) {
    let container = "fmFairCatLists";
    let template = "fmFairCategoryTemp";
    let list = getData(url).data;
    $('#' + container).empty();
    $.each(list, function (i, d) {
        const data = {
            'categoryId': d.id,
            'category': d.name
        }
        mustacheTemplating(container, template, data);
    })
}

//display Participants
function displayParticipants(url) {
    let container = "fmExhibiParticipants_table_body";
    let template = "fmExhibiParticipants_template";
    let list = getData(url).data;
    console.log(list);

    $('#' + container).empty();
    $.each(list, function (i, d) {
        let board = d.exhibitionBoard;
        let category = d.exhibitionBoardCategory;
        
        let disALink;
            disALink = !board.videoLink ? 'd-none' : 'd-block';
        let disInputLink;
            disInputLink = !board.videoLink ? '' : 'd-none';
        let disAHashtag;
            disAHashtag = !board.tag ? 'd-none' : 'd-block';
        let disInputHashtag;
            disInputHashtag = !board.tag ? '' : 'd-none';

        const data = {
            "exhibitionid": board.exhibitionId,
            "boardid": board.id,
            "category": category.name,
            "constructorname": board.constructorName,
            "repcontact": board.constructorPhoneNumber,
            "aboutus": board.constructorContent,
            "link": board.videoLink,
            "hashtag": board.tag,
            "disALink": disALink,
            "disInputLink": disInputLink,
            "disAHashtag": disAHashtag,
            "disInputHashtag": disInputHashtag,
        }
        mustacheTemplating(container, template, data);
        $('#fmpay' + board.id).prop('checked', board.isPay);
        $('#fmanswer' + board.id).prop('checked', board.isAnswer);
    })
}

function viewThisAboutUs(thisElem) {
    let aboutUs = thisElem.getAttribute('data-aboutus');
    console.log(aboutUs);

    let container = "globalModalCont";
    let template = "exhibitionAboutUsTemp";
    const tempdata = {
        'aboutus': aboutUs,
    }

    $('#' + container).empty();
    mustacheTemplating(container, template, tempdata);

    let title = "회사이름";
    let modalname = "globalModal";
    modal(title, modalname);
}

// onload the page
$('#fairmanagement_btn').on('click', function() {
    displayFairApartment(exApartmentUrl);
});

// switch offline fair
$("#switch_offlinefair").on('change', function () {
    if ($(this).is(":checked")) {
        $('#switch_offlinefair_time').removeClass('d-none')
    } else {
        $('#switch_offlinefair_time').addClass('d-none');
    }
});

// add Exhibition
$('#fmAddExhibitionBtn').on('click', function (e) {
    e.preventDefault();
    let addExhibitionUrl = "http://210.99.223.38:8081/api/exhibition";

    let apartmentId = $('#fmSelectApartmentList').val();
    let apartmentName = $("#fmSelectApartmentList option:selected").text();
    let startDate = $('#fmstart').val();
    let endDate = $('#fmend').val();

    let type = $('#switch_offlinefair').is(':checked');
    let startTime;
    let endTime;
    if (type === false) {
        startTime = null;
        endTime = null;
    } else {
        startTime = $('#fmstart_time').val();
        endTime = $('#fmend_time').val();
    }

    if (!apartmentId || !startDate || !endDate) { console.log('naay empty nga input sa apartment, startDate ug endDate!');  return; }
    if (startDate > endDate) { console.log('mas una ug date ang endDate kisa startDate!'); return; } 

    const data = {
        "apartmentId": apartmentId,
        "apartmentName": apartmentName,
        "startDate": startDate,
        "endDate": endDate,
        "isOfflineOn": type,
        "offlineStartTime": startTime,
        "offlineEndTime": endTime
    }

    console.log(data);
    $('#fairmanagement_page').find('input[type=date], input[type=time], select').each(function () { $(this).val(''); })

    $('#fairmanagement_page').find('input[type=checkbox]').each(function () {
        $('#switch_offlinefair').is(':checked') === true ? $('#switch_offlinefair_time').addClass('d-none') : ''
        $(this).prop('checked', false);
    })

    postData(data, addExhibitionUrl);
    console.log('posted');
    displayFairApartment(exApartmentUrl);
});

// fairexhibitionCont
$('#fairExhibitionCont').on('change', function (e) {
    fairExhiId = $(this).val();
    let fairExhiCatUrl = 'http://210.99.223.38:8081/api/exhibition/category?exhibitionId=' + fairExhiId;

    let fairExhiPartUrl = 'http://210.99.223.38:8081/api/exhibition/participate?exhibitionId=' + fairExhiId;
    
    // console.log(getData(fairExhiPartUrl));
    // $('#fmExhibiParticipants_table').DataTable();
    $('#fmAddFairCategoryInput').prop('disabled', false);

    displayFairCategory(fairExhiCatUrl);
    displayParticipants(fairExhiPartUrl);
});

// add Fair Category Button
$('#fmAddFairCategoryBtn').on('click', function (e) {
    e.preventDefault();
    let category = $('#fmAddFairCategoryInput').val();
    if (!fairExhiId || !category) return;
    console.log(fairExhiId, category);

    let addFairCatUrl = 'http://210.99.223.38:8081/api/exhibition/category';
    let fairExhiCatUrl = 'http://210.99.223.38:8081/api/exhibition/category?exhibitionId=' + fairExhiId;

    const data = {
        "exhibitionId": fairExhiId,
        "name": category
    }

    postData(data, addFairCatUrl);
    displayFairCategory(fairExhiCatUrl);
    $('#fmAddFairCategoryInput').val('');
});

// select category
$('#fmFairCatLists').on('click', '.fmFairCatName', function (e) {
    e.preventDefault();
    $(this).parent().siblings().removeClass('active');
    $(this).parent().addClass('active');
    categoryId = $(this).parent().data('cat-id');
    categoryName = $(this).parent().data('cat-name');

    console.log(categoryId, categoryName);
});

// delete category
$('#fmFairCatLists').on('click', '.fmFairCatDelBtn', function (e) {
    e.preventDefault();
    categoryId = $(this).parent().data('cat-id');
    categoryName = $(this).parent().data('cat-name');

    let url = "http://210.99.223.38:8081/api/exhibition/category?categoryId=" + categoryId;
    ajaxdelData(url);
    $(this).parent().remove();
});

// select constructor 
$('#fmConstructorCont').on('change', function (e) {
    e.preventDefault();
    constructorId = $('#fmConstructorCont').val();
    constructorName = $("#fmConstructorCont option:selected").text();

    $('#fmConstructorInputSearch').val(constructorName);
})

// search constructor
$('#fmConstructorInputSearch').on('keyup', function (e) {
    var searchTerm = e.target.value.toLowerCase();
    var options = $('#fmConstructorCont').find('option');
    options.each(function (i, option) {
        if (option.text.toLowerCase().indexOf(searchTerm) === -1) {
            option.style.display = 'none';
        } else {
            option.style.display = 'block';
        }
    });
});

// add exhibition constructor
$('#fmAddExhibitionConstructorBtn').on('click', function (e) {
    e.preventDefault();
    if (!fairExhiId || !categoryId || !constructorId || !constructorName) return;

    let addExhiPartUrl = 'http://210.99.223.38:8081/api/exhibition/participate';
    let fairExhiPartUrl = 'http://210.99.223.38:8081/api/exhibition/participate?exhibitionId=' + fairExhiId;

    const data = {
        "exhibitionId": fairExhiId,
        "categoryId": categoryId,
        "constructorId": constructorId,
        "constructorName": constructorName
    }

    postData(data, addExhiPartUrl);
    displayParticipants(fairExhiPartUrl);

    $('#fmConstructorCont').val('');
    $('#fmConstructorInputSearch').val();
    $('#fmFairCatLists').children().removeClass('active');
});

// edit
$('#fmExhibiParticipants_table_body').on('click', '.editBtn', function (e) {
    e.preventDefault();
    //update participants
    let id = $(this).data('id');
    $(this).addClass('d-none')
    $('#fmExhibiParticipants_table_body .updateBtn[data-id="'+id+'"]').removeClass('d-none');
    
    let disInputLink = $('#fmExhibiParticipants_table_body .disInputLink[data-id="' + id +'"]');
    let disALink = $('#fmExhibiParticipants_table_body .disALink[data-id="' + id + '"]');
    let disInputHashtag = $('#fmExhibiParticipants_table_body .disInputHashtag[data-id="' + id + '"]');
    let disAHashtag = $('#fmExhibiParticipants_table_body .disAHashtag[data-id="' + id + '"]');

    let checkpay = $('#fmpay' + id);
    let checkanswer = $('#fmanswer' + id);
    let inputLink = $('#fmvideo' + id);
    let inputHashtag = $('#fmhashtag' + id);

    let link = disALink.text().trim();
    let hashTag = disAHashtag.text().trim();

    checkpay.prop('disabled', false);
    checkanswer.prop('disabled', false);
    inputLink.prop('disabled', false);
    inputHashtag.prop('disabled', false);

    checkpay.parent().css('cursor', 'pointer');
    checkanswer.parent().css('cursor', 'pointer');

    if(disInputLink.has('d-none')) {
        disALink.addClass('d-none');
        disInputLink.removeClass('d-none');
        if (link) { inputLink.val(link)}
    }

    if (disInputHashtag.has('d-none')) {
        disAHashtag.addClass('d-none');
        disInputHashtag.removeClass('d-none');
        if (hashTag) { inputHashtag.val(hashTag) }
    }
});

// update
$('#fmExhibiParticipants_table_body').on('click', '.updateBtn', function (e) {
    e.preventDefault();
    //update participants

    let fairParticipants = "http://210.99.223.38:8081/api/exhibition/participate?exhibitionId=" + fairExhiId;
    let url = "http://210.99.223.38:8081/api/exhibition/participate";
    let id = $(this).attr('data-id')

    let answer = $('#fmanswer' + id).is(':checked');
    let pay = $('#fmpay' + id).is(':checked');
    let video = $('#fmvideo' + id).val();
    let hashtag = $('#fmhashtag' + id).val();
    
    console.log(pay);

    if (!video.trim()) video = null;
    if (!hashtag.trim()) hashtag = null;

    let data = {
        "boardId": id,
        "isAnswer": answer,
        "isPay": pay,
        "videoLink": video,
        "tag": hashtag
    }

    putData(data, url);
    displayParticipants(fairParticipants);
});

// delete
$('#fmExhibiParticipants_table_body').on('click', '.deleteBtn', function () {
    //delete participants       
    let id = $(this).attr('data-id');
    let fairParticipants = "http://210.99.223.38:8081/api/exhibition/participate?exhibitionId=" + fairExhiId;
    let delExConstructorUrl = "http://210.99.223.38:8081/api/exhibition/participate?id=" + id;
    let data = {
        "id": id
    }

    console.log(ajaxdelData(delExConstructorUrl));
    displayParticipants(fairParticipants);

});



/** SELECT2 OPTIONS */
// fair management apartment list
$('#fmSelectApartmentList').select2({
    theme: 'bootstrap-5',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
});

