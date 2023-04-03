function displayTechList(pageSize, url) {
    let techListArr = [];
    $.ajax({
        url: url,
        success: function (response) {
            let result = response.data;
            // console.log(result);
            techListArr = [];

            // Divide the response.data into chunks based on the page size
            for (let i = 0; i < result.length; i += pageSize) {
                techListArr.push(result.slice(i, i + pageSize));
            }

            // Initialize the pagination plugin
            $('#techmPagination').bootpag({
                total: techListArr.length,
                page: 1,
                maxVisible: 5,
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
            displayTechPage(techListArr[0]);

            // Listen for page changes
            $('#techmPagination').on('page', function (event, num) {
                displayTechPage(techListArr[num - 1]);
            });
        }
    });
}

function displayTechPage(pageData) {
    let html = '';

    pageData.forEach(function (tech) {
        const active = tech.active === true ? 'checked' : ''; 
        html += `<div class="col-12 col-xxl-6">
                  <div class="techmTechData card rounded-5">
                    <div class="techmTechDetails">
                      <p class="techmTechName"> ${tech.name} </p>
                      <p class="techmTechNum "> ${tech.userConstructorId} </p>
                    </div>
                    <div class="techmTechSwitch">
                      <label class="switch">
                        <input id="techmTechSwitchBtn${tech.userConstructorId}" class="switch-input techmTechSwitchBtn" data-id="${tech.userConstructorId}" data-status="${tech.active}" type="checkbox" ${active}/>
                        <span class="switch-label" data-off="Off" data-on="On"></span> 
                        <span class="switch-handle"></span> 
                      </label>
                    </div>
                  </div>
                </div>`;
    })

    // DISPLAY Tech TO HTML
    $('#techmDataCont').html(html);
}


// onload page
$('#technicianmanagement_btn').on('click', function () {
    let url = `http://210.99.223.38:8081/api/setting/worker/on-off?constructorId=${auths.id}`;
    displayTechList(10, url);
});


// FOR SWITCHES BUTTONS
$('#techmDataCont ').on('change', '.techmTechSwitchBtn', function () {
    const id = $(this).attr('data-id');
    const status = $(this).attr('data-status');
    let active;
    if(status === 'true') {
        $(this).attr('data-status', 'false');
        $(this).prop('checked', false);
        active = false;
    } 
    else if (status === 'false') {
        $(this).attr('data-status', 'true');
        $(this).prop('checked', true);
        active = true
    }
    const url = `http://210.99.223.38:8081/api/setting/worker/on-off?userConstructorId=${id}&isActive=${active}`;
    const data = {
        'userConstructorId': id,
        'isActive': active
    }
    postData(data, url);
});

