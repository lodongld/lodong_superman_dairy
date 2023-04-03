function displayContractList(pageSize, url){
    let contListArr = [];
    $.ajax({
        url: url,
        success: function (response) {
            let result = response.data;
            // console.log(result);
            contListArr = [];

            // Divide the response.data into chunks based on the page size
            for (let i = 0; i < result.length; i += pageSize) {
                contListArr.push(result.slice(i, i + pageSize));
            }

            // Initialize the pagination plugin
            $('#contractListsPagination').bootpag({
                total: contListArr.length,
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
            displayContractPage(contListArr[0]);

            // Listen for page changes
            $('#contractListsPagination').on('page', function (event, num) {
                displayContractPage(contListArr[num - 1]);
            });
        }
    });
}

// DISPLAY A PAGE OF DATA
function displayContractPage(pageData) {
    let html = '';

    // console.log(pageData);
    if (!pageData || pageData.length === 0) {
      $("#contractlistCont").html('<div class="p-5 text-center text-secondary">No Results</div>');
      return;
    }
    pageData.forEach(function (contract) {
      if (contract.rejectMessage === null) { contract.rejectMessage = ''}
      html += `<div class="${contract.status} col-md-12 col-xl-6">
                <div class="cpDataDetails">
                  <div class="row g-0">
                    <div class="col-7 col-xxl-10 border rounded-start">
                      <div class="cpDataDLeft">
                        <div class="p-3">
                          <div class="row g-2">
                            <div class="col-7 col-xl-7 col-xl-7 col-xxl-9">
                              <h5 class="cpDataName"> ${contract.name} </h5>
                              <p class="cpDataMgs"> ${contract.rejectMessage} </p>
                            </div>
                            <div class="col-5 col-xxl-3">
                              <select id="stat${contract.requestOrderId}" class="form-select form-select-sm selectStatus" data-status='${contract.status}' data-id="${contract.requestOrderId}">
                                <option value="일반" >일반</option>
                                <option value="보류" >보류</option>
                                <option value="삭제" >삭제</option>
                                <option value="반려" >반려</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-5 col-md-5 col-lg-5 col-xxl-2 border border-primary rounded-end">
                      <div class="cpDataDRight">
                        <!-- single button (삭제: Delete) -->
                        <div id="btnDelete${contract.requestOrderId}" class="btnDelete">
                          <button data-id="${contract.requestOrderId}" class="contractModalView btn btn-outline-primary" onclick="viewContractListDetails(this)"> 
                            계약서 보기 
                          </button> <!-- view modal contract -->
                        </div> 
                          
                        <!-- single button (반려: Reject)-->
                        <div id="btnReject${contract.requestOrderId}" class="btnReject">
                          <button data-id="${contract.requestOrderId}" class="contractAmend btn btn-outline-primary"> 계약서 수정 </button> 
                        </div>

                        <!-- double button (일반: Normal | 보류: Hold)-->
                        <div id="btnNorhold${contract.requestOrderId}" class="btnNormHold">
                          <button data-id="${contract.requestOrderId}" class="contractModalView btn btn-outline-primary" onclick="viewContractListDetails(this)"> 계약서 보기 </button>
                          <button data-id="${contract.requestOrderId}" class="contractListView btn btn-primary border-0"> 견적서 쓰기 </button> 
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;
    
    })
  
    // DISPLAY CONTRACT TO HTML
    $('#contractlistCont').html(html);  

    // FOR CUSTOMER SELECT STATUS
    $('#contractlistCont .selectStatus').map(function () {
        let status = $(this).data('status');
        let id = $(this).data('id');
        // console.log(status);

        $(this).find('option[value='+status+']').attr("selected", true);

        if (status === '반려') {
            $(this).find("option[value='일반']").attr("hidden", true); 
        } else if (status != "반려") {
            $(this).find("option[value='반려']").attr("hidden", true);
        }

        let btnReject = status === "반려" ? "d-block" : "d-none";
        let btnDelete = status === "삭제" ? "d-block" : "d-none";
        let btnNorhold = status === "일반" || status === "보류" ? "d-block" : "d-none";

        $("#btnReject"+id).addClass(btnReject);
        $("#btnNorhold"+id).addClass(btnNorhold);
        $('#btnDelete'+id).addClass(btnDelete); 
    })

}


// view modal details 
function viewContractListDetails(thisElem) {
  const id = thisElem.getAttribute('data-id');

  let title = "계약 내용";
  let modalname = "globalModalNC";
  modalNC(title, modalname);

  let container = "globalModalContNC";
  let template = "contractListDetailsTemplate";
  $('#' + container).empty();

  const url = "http://210.99.223.38:8081/api/order/info?requestOrderId=" + id;

  const result = getData(url).data;
  // console.log(result);

  const data = {
    'name': result.name,
    'phoneNumber': result.phoneNumber,
    'address': result.address,
    'addressDetail': result.addressDetail,
    'product': result.product,
    'process': result.process,
    'note': result.note,
    'moveInDate': result.liveInDate,
    'requestDate': result.requestConstructDate,
    'cashReceiptNum': result.cashReceiptPhoneNumber
  }
  mustacheTemplating(container, template, data);

  $('#contractListMoveInConfirm').attr('checked', result.isConfirmationLiveIn);
  $('#contractListRequestConfirm').attr('checked', result.isConfirmationConstruct);
  $('#contractListReceipt').attr('checked', result.isCashReceipt);

  if ($('#contractListReceipt').is(':checked') === true) {
    $('#contractListReceiptDiv').removeClass('d-none')

    if (result.cashReceiptPurpose === true) {
      $('#contractListIncomeDeduction').attr('checked', true);
      $('#contractListProofExpend').attr('checked', false);
    } else if (result.cashReceiptPurpose === false) {
      $('#contractListIncomeDeduction').attr('checked', false);
      $('#contractListProofExpend').attr('checked', true);
    }
  }

  $('#' + container).find('input[type="text"], input[type="date"], textarea').prop('readonly', true).css('background', 'transparent');
  $('#' + container).find('input[type="radio"]').prop('disabled', true);
}

// FOR CUSTOMER SELECT - UPDATE STATUS
$('#contractlistCont').on('change', '.selectStatus', function () {
  let selectID = $(this).data('id'); 
  let selectedStatus = $(this).val();
  const url = "http://210.99.223.38:8081/api/order/menu/list?constructorId="+auths.id;
  const putURL ="http://210.99.223.38:8081/api/order/menu/status?requestOrderId="+selectID+"&status="+selectedStatus; 

  const statusUpdate = {
    'requestOrderId': selectID,
    'status': selectID
  };
  putData(statusUpdate, putURL); 
  
  setTimeout(function () {
    // console.log("statusUpdated");
    displayContractList(10, url); 
  }, 1000); 
})


// FOR SEARCH / FILTERING OF DATA BY STATUS
$(".listSelect").on("change", function () {
  let url = "http://210.99.223.38:8081/api/order/menu/list?constructorId="+auths.id;
  let sValue = $(".listSelect").val();
  let alldata = getData(url).data;

  // TO FILTER BY STATUS
  if (sValue === "전체") {
    displayContractList(10, url);
  } else {
    const filteredData = alldata.filter((obj) => {
      return obj.status === sValue;
    });

    datas = [];

    // make new array of datas to display
    for (let i = 0; i < filteredData.length; i += 10) {
      datas.push(filteredData.slice(i, i + 10));
    }

    // Initialize the pagination plugin
    $("#contractListsPagination").bootpag({
      total: datas.length,
      page: 1,
      maxVisible: 5,
      leaps: true,
      firstLastUse: true,
      first: '<i class="fa-solid fa-backward-step"></i>',
      last: '<i class="fa-solid fa-forward-step"></i>',
      next: '<i class="fa-solid fa-angles-right"></i>',
      prev: '<i class="fa-solid fa-angles-left"></i>',
      wrapClass: "pagination",
      activeClass: "active",
      disabledClass: "disabled",
      nextClass: "next",
      prevClass: "prev",
      lastClass: "last",
      firstClass: "first",
    });

    // Display the first page of data
    displayContractPage(datas[0]);

    // Listen for page changes
    $("#contractListsPagination").on("page", function (event, num) {
      displayContractPage(datas[num - 1]);
    });
  }
});

// DISPLAY CONTRACT LIST PAGE FROM SIDEBAR - MENU
$('#contract_btn').on('click',function(){
    let url = "http://210.99.223.38:8081/api/order/menu/list?constructorId="+auths.id;
    displayContractList(10, url);

});


// button function for search - NO FUNCTION YET, NO PROVIDED API FOR SEARCH
$('#listBtn').on('click', function(){
    // let searchUrl = "http://210.99.223.38:8081/api/order/menu/list?constructorId="+auths.id;
    let searchKey = $('#listSearch').val();
    console.log(searchKey);
});

