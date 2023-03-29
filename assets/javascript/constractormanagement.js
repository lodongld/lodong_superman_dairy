let contructorsUrl = `http://210.99.223.38:8081/api/admin/constructor`;
let constDatas = [];


function masterCMDisplay() {
    let windowHeight = $(window).height();
    let parentHeight = windowHeight - 256; //256
    let childHeight = 98;
    const displayCount = Math.floor(parentHeight / childHeight);
    let display = displayCount - 2;
    console.log(display * 2);

    if ($(window).width() < 1200) { masterFetchConstructors(displayCount); }
    if ($(window).width() > 1200) { masterFetchConstructors(displayCount * 2); }
}

function masterFetchConstructors(displayCount) {
    $.ajax({
        url: contructorsUrl,
        success: function (response) {
            let result = response.data;
            console.log(result);
            constDatas = [];

            // Divide the response.data into chunks based on the page size
            for (let i = 0; i < result.length; i += displayCount) {
                constDatas.push(result.slice(i, i + displayCount));
            }

            // Initialize the pagination plugin
            $('#cmContentPagination').bootpag({
                total: constDatas.length,
                page: 1,
                maxVisible: 10,
                leaps: true,
                firstLastUse: true,
                first: '<i class="fa-solid fa-backward-step"></i>',
                last: '<i class="fa-solid fa-forward-step"></i>',
                next: '<i class="fa-solid fa-angles-right"></i>',
                prev: '<i class="fa-solid fa-angles-left"></i>',
                wrapClass: 'pagination',
                activeClass: 'active',
                disabledClass: 'disabled',
                nextClass: 'next',
                prevClass: 'prev',
                lastClass: 'last',
                firstClass: 'first'
            });

            // Display the first page of data
            displayConstructors(constDatas[0]);

            // Listen for page changes
            $('#cmContentPagination').on('page', function (event, num) {
                displayConstructors(constDatas[num - 1]);
            });
        }
    });
}

function displayConstructors(pageData) {
    let html = '';

    const consProduct = (products) => {
        return products.map((product, index) => {
            return `<span>${product}&nbsp;${index < products.length - 1 ? ' / ' : ''}&nbsp;</span>`;
        }).join('');
    }

    pageData.forEach(function (constructors) {
        html += `<div id="cmCDC${constructors.constructorId}" class="cmCDC col-12 col-xl-6">
                    <div class="cmDatas">
                        <img src="assets/img/images/tree.png" alt="" height="64px" width="64px" />
                        <div class="cmDataDetails">
                            <div class="fw-bold h5">${constructors.name} </div>
                            <div class="d-flex justify-content-start align-items-start flex-row flex-nowrap">
                                ${consProduct(constructors.product)}
                            </div>
                        </div>
                    </div>
                </div>`;
    });

    

    $('#cmContentData').html(html);
    
}

$('#smMaster02_btn, #cmMaster02_btn, #saMaster02_btn').on('click', function () {
    // console.log($('.cmCDC').outerHeight()); // 98
    // console.log($('.cmContentData').outerHeight()); // 591

    masterCMDisplay();
})