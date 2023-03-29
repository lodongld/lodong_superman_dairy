profDisplayInfo();

function profDisplayInfo() {
    const profUrl = `http://210.99.223.38:8081/api/constructor?constructorId=${localStorage.LoginSession}`;
    const result = getData(profUrl).data;

    // console.log(result);
    const profProducts = (products) => {
        return products.map((product, index) => {
            return `<span>${product}&nbsp;${index < products.length - 1 ? ' / ' : ''}&nbsp;</span>`;
        }).join('');
    }

    $('#profName').text(result.name);
    $('#profNumber').text(result.phoneNumber);    
    $('#profAddress').val(result.address);
    $('#profAddress2').val(result.addressDetail);
    $('#profIntro').val(result.introduction);
    $('#profProducts').empty();
    $('#profProducts').append(profProducts(result.product));
    $('#viewbusinesslicenseBtn').attr('data-id', result.constructorId);

    const profImgUrl = `http://210.99.223.38:8081/api/constructor/image?constructorId=${result.constructorId}`;

    let profImg;
    if (!profImgUrl) { profImg = `./assets/img/images/tree.png`;}
    else { profImg = profImgUrl }
    $('#profProfileImg').attr('src', profImg);

    $('#nvprofileImg').attr('src', profImg);
    $('#nvprofilename').text(result.name);

    $('#profAddress').prop('disabled', true);
    $('#profAddress2').prop('disabled', true);
    $('#profIntro').prop('disabled', true);
    $('#editprofile').val(null);
}

// onload
$('#profile_btn').on('click', function () { profDisplayInfo(); })

// modal
$('#viewbusinesslicenseBtn').on('click', function () {
    const reqid = $(this).attr('data-id');
    const title = "사업자 등록";
    const modalname = "globalModal";
    modal(title, modalname);

    const container = "globalModalCont";
    const template = "businesslicensetemp";
    const businessLicenseUrl = `http://210.99.223.38:8081/api/constructor/license?constructorId=${reqid}`;
    // const businessLicenseUrl = `./assets/img/images/switch_subscription.png`;

    const data = { 'image': businessLicenseUrl }
    $('#globalModalCont').empty();
    mustacheTemplating(container, template, data);
});

// update details
$('#profilesaveBtn').on('click', function(e) {
    e.preventDefault();

    const address = $('#profAddress').val();
    const addressDetail = $('#profAddress2').val();
    const introduction = $('#profIntro').val();
    const constructorId = localStorage.LoginSession;

    // const profileImg = $('#editprofile').val();
    const imageInput = document.querySelector('#editprofile');
    const imageFile = imageInput.files[0];

    if ($('#profAddress').prop('disabled') === false || $('#profAddress2').prop('disabled') === false || $('#profIntro').prop('disabled') === false) {
        const url = `http://210.99.223.38:8081/api/constructor`;
        const data = {
            'constructorId' : constructorId,
            'address': address,
            'addressDetail': addressDetail,
            'introduction': introduction
        }
        putData(data, url);

        setTimeout(function () {
            profDisplayInfo();
        }, 1000);
    }
    if (imageFile) {
        const imageName = getFileName(imageInput.value);
        const url = `http://210.99.223.38:8081/api/constructor/image`;

        const form = new FormData();
        form.append("constructorId", constructorId);
        form.append("file", imageFile, imageName);

        ajaxpostImg(form, url);

        setTimeout(function () {
            profDisplayInfo();
        }, 1000);
    }
})

// TOGGLE DISABLED INPUTS
// address1
$("#profAddress_btn").on('click', function () {
    $('#profAddress').prop('disabled', function (i, v) { return !v; });
})

// address2
$("#profAddress2_btn").on('click', function () {
    $('#profAddress2').prop('disabled', function (i, v) { return !v; });
})

// intro
$("#profIntro_btn").on('click', function () {
    $('#profIntro').prop('disabled', function (i, v) { return !v; });
})