const fileApartmentListUrl = `http://210.99.223.38:8081/api/constructor/apartment/list?constructorId=${session}`;
var fileApartmentId, fileName;

const fileImageInput = document.querySelector('#fileImageInput');
const fileUpload = document.querySelector('#fileUpload');
const fileThumbnailDiv = document.querySelector('#fileThumbnailDiv');

function displayFileApartmentLists(url) {
    let container = "fileApartmentListCont";
    let template = "fileApartmentListTemp";
    $('#' + container).empty();
    let list = getData(url).data;
    $.each(list, function (i, d) {
        let tempData = {
            'apartmentId': d.id,
            'apartmentName': d.name
        }
        mustacheTemplating(container, template, tempData);
    })
}

function displayImage(data, imageUrl) {
    let container = "fileImageDisplay";
    let template = "fileImageDisplayTemp";

    $('#' + container).empty();
    let tempData = {
        // 'createAt': data.createAt,
        // 'extension': data.extension,
        'imageId': data.id,
        'imageName': data.name,
        'image': imageUrl,
        // 'storage': data.storage,
    }

    mustacheTemplating(container, template, tempData);

}

function makeImageDroppable(e) {
    e.preventDefault();

    fileImageInput.addEventListener('dragover', imageDrag);
    fileImageInput.addEventListener('dragleave', imageLeave);
    fileImageInput.addEventListener('drop', imageDrop);
    fileImageInput.addEventListener('change', imageUpload);

    function imageDrag(e) {
        e.preventDefault();
    }

    function imageLeave() { }

    // when dropping
    function imageDrop(e) {
        e.preventDefault();
        let getImageData = `http://210.99.223.38:8081/api/file/price?constructorId=${session}&apartmentId=${fileApartmentId}`;
        let result = getData(getImageData).data;

        if (!result) {

            const imageFile = e.dataTransfer.files[0];
            const fileType = imageFile.type;
            
            if (!fileType.startsWith("image/")) {
                console.error("Not an image file");
                return;
            }
            else {
                displayUploadThumbnail(imageFile);
                fileUpload.files = e.dataTransfer.files;
            }
        }
        else {
            console.log(result);
        }
    }

    // when clicking 
    function imageUpload() {
        let getImageData = `http://210.99.223.38:8081/api/file/price?constructorId=${session}&apartmentId=${fileApartmentId}`;
        let result = getData(getImageData).data;
        
        if(!result) {
            const imageFile = fileUpload.files[0];
            const fileType = imageFile.type;
    
            console.log(imageFile, fileType)
    
            if (!fileType.startsWith("image/")) {
                console.error("Not an image file");
                return;
            }
            else {
                displayUploadThumbnail(imageFile);
            }
        } 
        else {
            console.log(result);
        }
    }
}

// display thumbnail
function displayUploadThumbnail (imageFile) {
    const imageName = imageFile.name;
    $('#fileInputThumbnail').addClass('d-block').removeClass('d-none');
    $('#fileInputThumbnail').addClass('mt-2');
    $('#fileImageName').text(imageName);

    const reader = new FileReader();

    reader.addEventListener('load', function () {
        fileThumbnailDiv.setAttribute('src', this.result);
    })

    reader.readAsDataURL(imageFile);
}

// onload page
$("#filemanagement_btn").on("click", function () {
    fileApartmentId = '', 
    fileName = '';

    if ($('#fileImageInput').hasClass('d-block')) {

        $('#fileUpload').prop('disabled', true);
        $('#fileImageInput').css('cursor', 'default');
        $('#fileImageName').text('');
        $('#fileThumbnailDiv').attr('src', '');
        fileUpload.value = "";


    }

    if ($('#fileInputThumbnail').hasClass('d-block')) {
        $('#fileInputThumbnail').addClass('d-none').removeClass('d-block');
        $('#fileInputThumbnail').removeClass('mt-2');
        $('#fileThumbnailDiv').attr('src', '');
        $('#fileImageName').text('');

        fileUpload.value = "";
    }

    displayFileApartmentLists(fileApartmentListUrl);

});

// select apartment
$('#fileApartmentListCont').on('change', function (e) {
    e.preventDefault();
    fileApartmentId = $(this).val();

    
    let getImageData = `http://210.99.223.38:8081/api/file/price?constructorId=${session}&apartmentId=${fileApartmentId}`;
    
    let result = getData(getImageData).data;
    console.log(result)
    if(result) {
        // display the image
        let imageUrl = `http://210.99.223.38:8081/api/file/price/image?constructorId=${session}&apartmentId=${fileApartmentId}`;
        displayImage(result, imageUrl);

        $('#fileImageInput').addClass('d-none').removeClass('d-block');
        $('#fileImageDisplay').addClass('d-block').removeClass('d-none');
        $('#fileUpload').prop('disabled', true);
        $('#fileImageInput').css('cursor', 'default');
    }

    else if (!result) {
        // walay unod
        if ($('#fileInputThumbnail').hasClass('d-block')) {
            $('#fileInputThumbnail').addClass('d-none').removeClass('d-block');
            $('#fileInputThumbnail').removeClass('mt-2');
            $('#fileThumbnailDiv').attr('src', '');
            $('#fileImageName').text('');

            fileUpload.value = "";
        }

        else if ($('#fileInputThumbnail').hasClass('d-none')) {
            $('#fileImageInput').addClass('d-block').removeClass('d-none');
            $('#fileImageDisplay').addClass('d-none').removeClass('d-block');
            $('#fileUpload').prop('disabled', false);
            $('#fileImageInput').css('cursor', 'pointer');

            makeImageDroppable(e);
        }
        
    }
});


// search apartment
$('#fileSearchApartment').on('keyup', function (e) {
    e.preventDefault();
    var searchTerm = e.target.value.toLowerCase();
    var options = $('#fileApartmentListCont').find("option");
    options.each(function (i, option) {
        if (option.text.toLowerCase().indexOf(searchTerm) === -1) {
            option.style.display = "none";
        } else {
            option.style.display = "block";
        }
    });
});


// upload btn
$('#fileUploadBtn').on('click', function (e) {
    e.preventDefault()
    const imageFile = fileUpload.files[0];
    const imageName = getFileName(fileUpload.value);

    if (!fileApartmentId || !imageFile) { return; }

    const uploadurl = "http://210.99.223.38:8081/api/file/price";

    const formData = new FormData();
    formData.append('constructorId', localStorage.LoginSession);
    formData.append('apartmentId', fileApartmentId);
    formData.append('file', imageFile, imageName);

    
    const x = ajaxpostImg(formData, uploadurl);
    console.log(x);

    setTimeout(function () {
        $('#fileImageInput').addClass('d-none').removeClass('d-block');
        $('#fileInputThumbnail').addClass('d-none').removeClass('d-block');
        $('#fileInputThumbnail').removeClass('mt-2');
        $('#fileImageName').text('');
        $('#fileThumbnailDiv').attr('src', '');

        fileUpload.value = "";
        $.notify("File Uploaded", "success");

        $('#fileImageDisplay').addClass('d-block').removeClass('d-none');
        let getImageData = `http://210.99.223.38:8081/api/file/price?constructorId=${session}&apartmentId=${fileApartmentId}`;
        let result = getData(getImageData).data;
        console.log(result);
        let imageUrl = `http://210.99.223.38:8081/api/file/price/image?constructorId=${session}&apartmentId=${fileApartmentId}`;
        displayImage(result, imageUrl);
    }, 2000);

    
})

// remove thumbnail
$('#fileUploadThumbBtn').on('click', function (e) {
    e.preventDefault();
    $('#fileInputThumbnail').addClass('d-none').removeClass('d-block');
    $('#fileInputThumbnail').removeClass('mt-2');
    $('#fileImageName').text('');
    fileUpload.value = "";
}) 

// remove data img 
$('#fileImageDisplay').on('click', '#fileGetThumbBtn', function (e) {
    e.preventDefault();
    let thisId = $(this).data('id');
    console.log(thisId);
    let deleteImgUrl = `http://210.99.223.38:8081/api/file/price?fileListId=${thisId}`;

    ajaxdelData(deleteImgUrl);

    setTimeout(function () {
        $('#fileImageInput').addClass('d-block').removeClass('d-none');
        $('#fileImageDisplay').addClass('d-none').removeClass('d-block');
        $('#fileUpload').prop('disabled', false);
        $('#fileImageInput').css('cursor', 'pointer');

        
        $.notify("File Deleted", "warning");
        $('#fileImageDisplay').children().remove();
    }, 1000);
})
