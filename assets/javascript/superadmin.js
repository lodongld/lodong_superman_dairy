const saFormFileContainer = document.querySelector('#saFormFileContainer');
const saFormFile = document.querySelector('#saFormFile');
const saFormFileThumbImg = document.querySelector('#saFormFileThumbImg');

let saOnlineFairId, saCategoryId, saContractorId, saExhiboardId;


function saDisplayExhibition (url) {
    let result = getData(url).data;
    let container = 'saOnlineFairBody';
    let template = 'saOnlineFairTemplate';
    $('#' + container).empty();
    $.each(result, function (i, d) {
        const tempData = {
            'endDateTime': d.endDateTime,
            'isOfflineOn': d.isOfflineOn,
            'startDateTime': d.startDateTime,
            'id': d.exhibitionId,
            'name': d.exhibitionName,
        }
        mustacheTemplating(container, template, tempData);
    })

}

function saDisplayCategory(url) {
    let result = getData(url).data;
    let container = 'saCategoryBody';
    let template = 'saCategoryTemplate';

    $('#' + container).empty();
    $.each(result, function (i, d) {
        const tempData = {
            'exhibiId': d.exhibitionId,
            'id': d.id,
            'name': d.name,
        }
        mustacheTemplating(container, template, tempData);
    })

}

function saDisplayContractor(url) {
    let result = getData(url).data;
    let container = 'saContractorBody';
    let template = 'saContractorTemplate';

    $('#' + container).empty();
    $.each(result, function (i, d) {
        const tempData = {
            'exhibiBoardId': d.exhibitionBoardId,
            'id': d.constructorId,
            'name': d.constructorName,
        }
        mustacheTemplating(container, template, tempData);
    })

}

function saDisplayContractorDetails(url, e) {
    let result = getData(url).data;
    console.log(result);

    let constInfo = result.constructorInfo;
    let products = constInfo.product;
    let fileInfo = result.fileInfo;
    let videoLink = result.videoLink;

    const consProduct = (products) => {
        return products.map((product, index) => {
            return `<span>${product}&nbsp;${index < products.length - 1 ? ' / ' : ''}&nbsp;</span>`;
        }).join('');
    }

    // display DATA
    // $('.saDataImg').attr('src', '');
    $('.saDataName').text(constInfo.name);
    $('.saDataProduct').empty();
    $('.saDataProduct').append(consProduct(products));
    $('.saDataAddress1').text(constInfo.address);
    $('.saDataAddress2').text(constInfo.addressDetail);
    $('.saDataInfo').text(constInfo.introduction);

    if (videoLink) {
        $('#saFormTagDiv').removeClass('d-none');
        $('#saFormUrlDiv').addClass('d-none');

        $('#saFormTag').attr('href', videoLink);
        $('#saFormTag').text(videoLink);
        $('#saFormUrl').val(videoLink);
    }

    if(!fileInfo) {
        if ($('#saFormFileDisplayContainer').hasClass('d-block')) {
            $('#saFormFileDisplayContainer').addClass('d-none').removeClass('d-block');
            $('#saFormFileContainer').addClass('d-block').removeClass('d-none');
        }

        $('#saFormFileDiv').removeClass('hasBg');
        saMakeFileDroppable(e);
    }
    else if (fileInfo) {
        $('#saFormFileDisplayContainer').addClass('d-block').removeClass('d-none');
        $('#saFormFileContainer').addClass('d-none').removeClass('d-block');

        $('#saFormFileDisplayDelBtn').attr('data-id', fileInfo.id);
        $('#saFormFileDisplayName').text(fileInfo.name);
        $('#saFormFileDisplayImg').attr('src', '.'+fileInfo.storage);

        // const imageFile = e.dataTransfer.files[0];
        // console.log(imageFile);
        // saFormFileDisplayThumb(imageFile);
        // saFormFile.files = e.dataTransfer.files;
    }

    // if (fileInfo && videoLink) { $('#saFormSubmit').attr('disabled', true); }
    // else if (!fileInfo || !videoLink) { $('#saFormSubmit').attr('disabled', false); }
    
}

function saMakeFileDroppable(e) {
    e.preventDefault();

    saFormFileContainer.addEventListener('dragover', imageDrag);
    saFormFileContainer.addEventListener('dragleave', imageLeave);
    saFormFileContainer.addEventListener('drop', imageDrop);
    saFormFileContainer.addEventListener('change', imageUpload);

    function imageDrag(e) {
        e.preventDefault();
    }

    function imageLeave() { }

    // when dropping
    function imageDrop(e) {
        e.preventDefault();

        if (e.dataTransfer.files[0]) {
            const imageFile = e.dataTransfer.files[0];
            console.log(imageFile);
            saFormFileDisplayThumb(imageFile);
            saFormFile.files = e.dataTransfer.files;
        }
    }

    // when clicking 
    function imageUpload() {

        if (saFormFile.files[0]) {
            const imageFile = saFormFile.files[0];
            console.log(imageFile);
            saFormFileDisplayThumb(imageFile);
        }
    }
}

function saFormFileDisplayThumb(imageFile) {
    const imageName = imageFile.name;
    $('#saFormFileThumbDiv').addClass('d-block').removeClass('d-none');
    $('#saFormFileThumbName').text(imageName);

    const reader = new FileReader();

    reader.addEventListener('load', function () {
        saFormFileThumbImg.setAttribute('src', this.result);
    })

    reader.readAsDataURL(imageFile);
}

function saResetDisplay() {
    $('.saDataName').text('');
    $('.saDataProduct').empty();
    $('.saCRTChildData').text('');
    $('#saFormUrl').val(null);
    $('#saFormFile').val(null);

    if ($('#saFormUrlDiv').hasClass('d-none')) {
        $('#saFormTagDiv').addClass('d-none');
        $('#saFormUrlDiv').removeClass('d-none');

        $('#saFormTag').attr('href', null);
        $('#saFormTag').text(null);
    }

    saResetImgData();

    $('#saFormUrl').attr('disabled', true);
    $('#saFormFile').attr('disabled', true);
    $('#saFormSubmit').attr('disabled', true);
}

function saResetImgData() {
    
    $('#saFormFileThumbDiv').addClass('d-none').removeClass('d-block');
    $('#saFormFileThumbName').text(null);
    $('#saFormFileThumbImg').attr('src', null);
    saFormFile.value = null;

    if ($('#saFormFileDisplayContainer').hasClass('d-block')) {
        $('#saFormFileDisplayContainer').addClass('d-none').removeClass('d-block');
        $('#saFormFileContainer').addClass('d-block').removeClass('d-none');
    }

    $('#saFormFileDisplayDelBtn').attr('data-id', null);
    $('#saFormFileDisplayName').text(null);
    $('#saFormFileDisplayImg').attr('src', null);
}

$('#smSuperAdmin_btn, #cmSuperAdmin_btn, #saSuperAdmin_btn').on('click', function () {
    let saExhibiUrl = `http://210.99.223.38:8081/api/admin/exhibition/list`;
    saDisplayExhibition(saExhibiUrl);
    saResetDisplay();

    $('#saFlushBtn2').addClass('collapsed');
    $('#saFlushControl2').removeClass('show');
    $('#saFlushBtn3').addClass('collapsed');
    $('#saFlushControl3').removeClass('show');
    $('#saCategoryBody').empty();
    $('#saContractorBody').empty();
});


$('#saOnlineFairBody').on('click', '.saOnFair', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    saOnlineFairId = $(this).data('id');

    $('#saContractorBody').empty();

    let url = `http://210.99.223.38:8081/api/admin/exhibition/category/list?exhibitionId=${saOnlineFairId}`;

    saDisplayCategory(url);
    $('#saFormFileDiv').addClass('hasBg');
    saResetDisplay();
    

    $('#saFlushBtn2').removeClass('collapsed');
    $('#saFlushControl2').addClass('show');

    $('#saFlushBtn3').addClass('collapsed');
    $('#saFlushControl3').removeClass('show');
})


$('#saCategoryBody').on('click', '.saCat', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    saCategoryId = $(this).data('id');


    let url = `http://210.99.223.38:8081/api/admin/exhibition/constructor/participate/list?exhibitionId=${saOnlineFairId}&categoryId=${saCategoryId}`;

    // console.log(getData(url));
    saDisplayContractor(url);
    $('#saFormFileDiv').addClass('hasBg');
    saResetDisplay();

    $('#saFlushBtn3').removeClass('collapsed');
    $('#saFlushControl3').addClass('show');
})


$('#saContractorBody').on('click', '.saContName', function (e) {
    e.preventDefault();

    $(this).parent().siblings().removeClass('active');
    $(this).parent().addClass('active');
    saContractorId = $(this).parent().data('id');
    saExhiboardId = $(this).parent().data('exhiboard-id');

    let url = `http://210.99.223.38:8081/api/admin/exhibition/constructor?constructorId=${saContractorId}&exhibitionBoardId=${saExhiboardId}`;

    saResetDisplay();
    saDisplayContractorDetails(url, e);

    $('#saFormUrl').attr('disabled', false);
    $('#saFormFile').attr('disabled', false);
})

// delete exhiboard
$('#saContractorBody').on('click', '.saContDelBtn', function () {
    // saDisplayContractorDetails(url, e);
    saResetDisplay();

    let exhiId = $(this).parent().data('exhiboard-id');
    let url = `http://210.99.223.38:8081/api/admin/exhibition/constructor/participate?exhibitionBoardId=${exhiId}`;
    ajaxdelData(url);
    $(this).parent().remove();
})


$('#saFormTagBtn').on('click', function () {
    $('#saFormTagDiv').addClass('d-none');
    $('#saFormUrlDiv').removeClass('d-none');

    $('#saFormSubmit').attr('disabled', false);
})

$('#saFormFileThumbDelBtn').on('click', function () {
    saResetImgData();
})


$('#saFormSubmit').on('click', function (e) {
    e.preventDefault()

    const imageFile = saFormFile.files[0];
    const saFormUrl = $('#saFormUrl').val();
    
    if (imageFile) {
        const imageName = getFileName(saFormFile.value);

        const uploadurl = "http://210.99.223.38:8081/api/admin/exhibition/constructor/participate";
    
        const formData = new FormData();
            formData.append('constructorId', saContractorId);
            formData.append('file', imageFile, imageName);
            formData.append('exhibitionBoardId', saExhiboardId);
            formData.append('videoLink', saFormUrl);
    
    
        console.log(formData);
        ajaxPutImg(formData, uploadurl);
    
        saResetImgData();
    
        $.notify("Constructor Info Updated", "success");
    
        setTimeout(function () {
            let url = `http://210.99.223.38:8081/api/admin/exhibition/constructor?constructorId=${saContractorId}&exhibitionBoardId=${saExhiboardId}`;
            saDisplayContractorDetails(url, e);
        }, 1000);
    }

    else if (!imageFile) {

        // const uploadUrl = `http://210.99.223.38:8081/api/admin/exhibition/constructor/participate/video-link?exhibitionBoardId=${saExhiboardId}&videoLink=${saFormUrl}`;

        const uploadUrl = `http://210.99.223.38:8081/api/admin/exhibition/constructor/participate/video-link`;

        const data = {
            'exhibitionBoardId': saExhiboardId,
            'videoLink': saFormUrl
        }
        putData(data, uploadUrl);

        setTimeout(function () {
            let url = `http://210.99.223.38:8081/api/admin/exhibition/constructor?constructorId=${saContractorId}&exhibitionBoardId=${saExhiboardId}`;
            saDisplayContractorDetails(url, e);
        }, 1000);

        $.notify("Constructor Info Updated", "success");
    }


})

// delete image
$('#saFormFileDisplayDelBtn').on('click', function (e) {
    e.preventDefault();
    let id = $(this).attr('data-id');

    console.log(id);
    let deleteImgUrl = `http://210.99.223.38:8081/api/admin/exhibition/constructor/participate/file?fileListId=${id}`;
    ajaxdelData(deleteImgUrl);

    $('#saFormFileDiv').removeClass('hasBg');
    saResetImgData();

    $.notify("File Image Deleted!", "success");
    $('#saFormSubmit').attr('disabled', false);
})
