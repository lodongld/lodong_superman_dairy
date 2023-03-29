let cwApartmentListUrl = "http://210.99.223.38:8081/api/apartment/list";
$.get(cwApartmentListUrl).then(cwDisplayApartmentList);

let cwproductobj = {};
let cwdiscountobj = {};




// apartment lists
function cwDisplayApartmentList(response) {
  let container = "cwapartment";
  let template = "cwapartmenttemp";
  let list = response.data;

  let placeholder = `<option></option>`;
  $('#'+container).empty();
  $('#'+container).append(placeholder);

  $.each(list, function (i, d) {
    const data = {
      'apid': d.id,
      'apname': d.name
    }
    mustacheTemplating(container, template, data);
  });
}

// table + btn increment
function increment() { document.querySelector('#productQty').stepUp(); }

// table - btn decrement
function decrement() {  document.querySelector('#productQty').stepDown(); }

// fetch products in select option
function cwDisplayProducts() {
  const prodUrl = `http://210.99.223.38:8081/api/constructor/product/list?constructorId=${localStorage.LoginSession}`;
  const result = getData(prodUrl).data;
  let container = 'cwproduct';
  let template = 'cwproducttemp';
  let placeholder = `<option></option>`;
  $("#" + container).empty();
  $("#" + container).append(placeholder);
  $.each(result, function (i, d) {
    const templateData = {
      'prodid': d.id,
      'prodname': d.name,
      'proddesc': d.writeProductName,
    };
    mustacheTemplating(container, template, templateData);
  });

}

// display added sub products
function cwDisplaySubProductAdded() {
  const cwprodTemplate = "prodArrListTemplate";
  const cwprodCont = "cwdataCont";
  cwDisplaySubProductList(cwprodCont, cwprodTemplate, cwproductobj);
}

// display sub product list
function cwDisplaySubProductList(container, template, data) {
  $("#" + container).empty();
  $.each(data, function (i, d) {
    const templateData = {
      'productName': d.productName,
      'price': d.price,
      'count': d.count,
      'id': d.id
    };
    mustacheTemplating(container, template, templateData);
  });
}

// display added discount 
function cwDisplayDiscountAdded() {
  const cwpdiscTable = "cwdiscTable";
  const cwdiscTemplate = "discArrListTemplate";
  const cwdiscCont = "cwdiscCont";
  cwDisplayDiscountList(cwdiscCont, cwdiscTemplate, cwdiscountobj);
}

// display discount list
function cwDisplayDiscountList(container, template, data) {
  $("#" + container).empty();
  $.each(data, function (i, d) {
    const templateData = {
      'discountContent': d.discountContent,
      'discount': d.discount,
      'id': d.id,
    };
    mustacheTemplating(container, template, templateData);
  });
}

// get product total
function getProductTotal(obj) {
  let total = 0;
  let subtotal = 0;
  $.each(obj, function (i, d) {
    subtotal = d.price * d.count;
    total = total + subtotal;
  });
  return total;
}

// get discount total
function getDiscountTotal(obj) {
  let total = 0;
  let subtotal = 0;
  $.each(obj, function (i, d) {
    subtotal = d.discount * 1;
    total = total + subtotal;
  });
  return total;
}

// get vat
function getVatAmount(sum) {
  let vat = 0;
  let isVat = $("#cwvat").is(":checked");

  if (isVat === true) {
    vat = sum * 0.1;
  }
  return vat;
}

// get grand total
function getGrandTotal() {
  let productTotal = getProductTotal(cwproductobj);
  let discTotal = getDiscountTotal(cwdiscountobj);
  let total = productTotal + getVatAmount(productTotal);
  const grandTotal = total - discTotal;

  return grandTotal;
}

// display grand total
function displayGrandTotal() {
  const container = "cwTotalCont";
  const grandTotal = getGrandTotal();

  $("#" + container).text('0');
  $("#" + container).text(grandTotal);
}

// make product array
function makeProductArr(obj) {
  let cwproducts = [];
  $.each(obj, function (i, d) {
    const templateData = {
      'productName': d.productName,
      'price': Number(d.price),
      'count': Number(d.count),
    }
    cwproducts.push(templateData);
  });
  return cwproducts;
}

// make discount array
function makeDiscountArr(obj) {
  let cwdiscount = [];
  $.each(obj, function (i, d) {
    const templateData = {
      'discountContent': d.discountContent,
      'discount': Number(d.discount),
    };
    cwdiscount.push(templateData);
  });

  return cwdiscount;
}

// clear data and inputs
function cwClearInputs() {
  $('#cwphonenum').val(null);
  $('#cwcustname').val(null);
  $('#cwapartment').val(null);
  $('#cwproduct').val(null);
  $('#cwdong').val(null);
  $('#cwhosu').val(null);
  $('#cwtype').val(null);
  $('#cwnote').val(null);
  $('#cwaverage').val(null);
  $('#cwmoveindate').val(null);
  $('#cwmoveinbtn').attr('data-status', 'false');
  $('#cwconstructiondate').val(null);
  $('#cwconstructionbtn').attr('data-status', 'false');
  $('#cwapplication').attr('checked', false);
  $('#cwnotapplied').attr('checked', true);
  $('#cwincomedd').attr('checked', false);
  $('#cwproofexp').attr('checked', false);
  $('#cwestimateid').val(null);
  $('#cwcustid').val(null);
  $('#cwcustphone').val(null);
  $('#cwTotalCont').text('0');
  $('#cwdownpayment').text('0');
  $('#cwvat').attr('checked', false);
  $('#cwrequestid').val(null);

  $('#cwdataCont').empty();
  $('#cwdiscCont').empty();

  cwproductobj = {};
  cwdiscountobj = {};
}

// display Order info 
function cwDisplayOrderInfo(data) {
  $('#cwphonenum').val(data.phoneNumber);
  $('#cwcustname').val(data.customerName);
  $("#cwapartment option[value='" + data.apartmentCode + "']").prop('selected', true).change();
  $("#cwproduct option[value='" + data.productId + "']").attr('selected', true).change();
  $('#cwdong').val(data.east);
  $('#cwhosu').val(data.lake);
  $('#cwtype').val(data.type);
  $('#cwnote').val(data.note);
  $('#cwaverage').val(data.planeWater);

  $('#cwmoveindate').val(data.moveInDate);
  $('#cwmoveinbtn').attr('data-status', data.isConfirmationMoveInDate);
  if (data.isConfirmationMoveInDate === true) {
    $('#cwmoveinbtn').addClass('btn-secondary').removeClass('btn-primary');
  }

  $('#cwconstructiondate').val(data.dateOfRequestForConstruction);
  $('#cwconstructionbtn').attr('data-status', data.isConfirmationDateOfRequestForConstruction);
  if (data.isConfirmationDateOfRequestForConstruction === true) {
    $('#cwconstructionbtn').addClass('btn-secondary').removeClass('btn-primary');
  }

  $('#cwapplication').attr('checked', data.isCashReceipt);
  if ($('#cwapplication').is(':checked') === true) { 
    $('#cwnotapplied').attr('checked', false);
    $('.cwreceiptCont').removeClass('d-none');

    $('#cwproofexp').attr('checked', data.cashReceiptPurpose);
    if ($('#cwproofexp').is(':checked') === true) { $('#cwincomedd').attr('checked', false); }
    else if ($('#cwproofexp').is(':checked') === false) { $('#cwincomedd').attr('checked', true); }
  }
  else if ($('#cwapplication').is(':checked') === false) { $('#cwnotapplied').attr('checked', true) }

  $('#cwestimateid').val(data.estimateId);
  $('#cwcustid').val(data.customerId);
  $('#cwcustphone').val(data.cashReceiptPhoneNumber);
  $('#cwTotalCont').text(data.price);

  let downpayment = data.downPayment === null ? '0' : data.downPayment;
  $('#cwdownpayment').text(downpayment);

  $('#cwvat').attr('checked', data.isVat);
  $('#cwrequestid').val(data.requestOrderId);

  const products = data.estimateDetails;
  const discounts = data.discounts;

  if (products) {
    $.each(products, function(i, d){
      const id = d.id;
      const productTemp = {
        'productName': d.productName,
        'price': d.price,
        'count': d.count,
        'id': d.id 
      }
      cwproductobj[id] = productTemp;
    })
    cwDisplaySubProductAdded();
  }

  if (discounts) {
    $.each(discounts, function (i, d) {
      const id = d.id;
      const discountTemp = {
        'discountContent': d.discountContent,
        'discount': d.discount,
        'id': d.id,
      };

      cwdiscountobj[id] = discountTemp;
    })
    cwDisplayDiscountAdded();
  }

  displayGrandTotal();
  // console.log(cwproductobj);
}

// display Quote info 
function cwDisplayQuoteInfo(data) {
  $('#cwphonenum').val(data.phoneNumber);
  $('#cwcustname').val(data.name);
  $("#cwproduct option[value='" + data.productId + "']").attr('selected', true).change();
  $("#cwapartment option[value='" + data.apartmentCode + "']").prop('selected', true).change();
  $('#cwdong').val(data.dong);
  $('#cwhosu').val(data.hosu);
  $('#cwtype').val(data.apartmentType);
  $('#cwnote').val(data.note);
  $('#cwaverage').val(data.pyeong);

  $('#cwmoveindate').val(data.liveInDate);
  $('#cwmoveinbtn').attr('data-status', data.confirmationLiveIn);
  if (data.confirmationLiveIn === true) {
    $('#cwmoveinbtn').addClass('btn-secondary').removeClass('btn-primary');
  }

  $('#cwconstructiondate').val(data.requestConstructDate);
  $('#cwconstructionbtn').attr('data-status', data.confirmationConstruct);
  if (data.confirmationConstruct === true) {
    $('#cwconstructionbtn').addClass('btn-secondary').removeClass('btn-primary');
  }

  $('#cwapplication').attr('checked', data.cashReceipt);
  if ($('#cwapplication').is(':checked') === true) {
    $('#cwnotapplied').attr('checked', false);
    $('.cwreceiptCont').removeClass('d-none');

    $('#cwproofexp').attr('checked', data.cashReceiptPurpose);
    if ($('#cwproofexp').is(':checked') === true) { $('#cwincomedd').attr('checked', false); }
    else if ($('#cwproofexp').is(':checked') === false) { $('#cwincomedd').attr('checked', true); }
  }
  else if ($('#cwapplication').is(':checked') === false) { $('#cwnotapplied').attr('checked', true) }

  $('#cwestimateid').val(data.estimateId);
  $('#cwcustid').val(data.customerId);
  $('#cwcustphone').val(data.cashReceiptPhoneNumber);
  $('#cwTotalCont').text(data.price);

  let downpayment = data.downPayment === null ? '0' : data.downPayment;
  $('#cwdownpayment').text(downpayment);

  $('#cwvat').attr('checked', data.isVat);
  $('#cwrequestid').val(data.id);

  const products = data.estimateDetails;
  const discounts = data.discounts;

  if (products) {
    $.each(products, function (i, d) {
      const id = d.id;
      const productTemp = {
        'productName': d.productName,
        'price': d.price,
        'count': d.count,
        'id': d.id
      }
      cwproductobj[id] = productTemp;
    })
    cwDisplaySubProductAdded();
  }

  if (discounts) {
    $.each(discounts, function (i, d) {
      const id = d.id;
      const discountTemp = {
        'discountContent': d.discountContent,
        'discount': d.discount,
        'id': d.id,
      };

      cwdiscountobj[id] = discountTemp;
    })
    cwDisplayDiscountAdded();
  }

  displayGrandTotal();
  // console.log(cwproductobj);
}

// onload page
$('#contractwriting_btn').on('click', function () {
  cwClearInputs();
  cwDisplayProducts();
})

// retrieve costumer data
$('#cwretrieveCustBtn').on('click', function () {
  const num = $('#cwphonenum').val().trim();
  const url = `http://210.99.223.38:8081/api/order/customer?phoneNumber=${num}`;
  const result = getData(url).data;
  console.log(result);

  if(result) {
    const data = {
      'fcm' : result.fcm,
      'id' : result.id,
      'name' : result.name,
      'num': result.phoneNumber
    }
  
    $('#cwcustname').val(result.name);
    $('#cwcustid').val(result.id);
    $('#cwcustphone').val(result.phoneNumber);
  
    const fcmUrl = `http://210.99.223.38:8081/api/auth/fcm`;
    const fcmData = {
      'fcm' : result.fcm,
      'userConstructorId': localStorage.LoginSession
    }
    putData(fcmData, fcmUrl);
  }
})

// moveindate confirm btn
$('#cwmoveinbtn').on('click', function () {
  const moveinDate = $('#cwmoveindate').val();
  if(!moveinDate) {return;}
  
  const btnStat = $(this).attr("data-status");
  const stat = btnStat === "true" ? "false" : "true";
  $("#cwmoveinbtn").attr("data-status", stat);
  if (stat === "true") {
    $("#cwmoveinbtn").addClass("btn-secondary").removeClass("btn-primary");
  } else if (stat === "false") {
    $("#cwmoveinbtn").addClass("btn-primary").removeClass("btn-secondary");
  }
})

// construction date confirm btn
$('#cwconstructionbtn').on('click', function () {
  const constructionDate = $('#cwconstructiondate').val();
  if (!constructionDate) { return; }

  const btnStat = $(this).attr("data-status");
  const stat = btnStat === "true" ? "false" : "true";
  $("#cwconstructionbtn").attr("data-status", stat);
  if (stat === "true") {
    $("#cwconstructionbtn").addClass("btn-secondary").removeClass("btn-primary");
  } else if (stat === "false") {
    $("#cwconstructionbtn").addClass("btn-primary").removeClass("btn-secondary");
  }
})

// cash receipt radio btn -> true
$('#cwapplication').on('change', function () {
  if ($(this).is(':checked') === true) { $('.cwreceiptCont').removeClass('d-none'); }
})

// cash receipt radio btn -> false
$('#cwnotapplied').on('change', function () {
  if($(this).is(':checked') === true) { $('.cwreceiptCont').addClass('d-none'); }
})

// VAT radio btn toggle
$('#cwvat').on('click', function () {
  const vatRadio = $(this);
  if(vatRadio.attr('data-waschecked') === 'true') {
    vatRadio.prop('checked', false);
    vatRadio.attr('data-waschecked', 'false');
  } 
  else if (vatRadio.attr('data-waschecked') === 'false') {
    vatRadio.prop('checked', true);
    vatRadio.attr('data-waschecked', 'true');
  }

  displayGrandTotal();
})

// add sub product data btn
$('#cwAddDataProd').on('click', function () {
  const id = generateRandomKey(5);

  let productName = $("#cwproductname").val().trim();
  let price = $("#cwproductamount").val().trim();
  let count = $("#productQty").val();

  if (!productName || !price) {return}

  const productTemp = { 
    'productName': productName, 
    'price': price, 
    'count': count,
    'id': id 
  };

  cwproductobj[id] = productTemp;

  cwDisplaySubProductAdded();

  $("#cwproductname").val(null);
  $("#cwproductamount").val(null);
  $("#productQty").val('1');
  
  displayGrandTotal();
})

// delete product
$("#cwdataTable").on("click", ".deleteData", function () {
  let id = $(this).attr("data-id");
  delete cwproductobj[id];

  cwDisplaySubProductAdded();
  displayGrandTotal();
})

// add discount data btn
$('#cwAddDiscount').on('click', function () {
  const id = generateRandomKey(5);
  let discountContent = $("#cwdiscounttype").val().trim();
  let discount = $("#cwdiscountamount").val().trim();
  if (!discountContent || !discount) { return }

  const discountTemp = {
    'discountContent': discountContent,
    'discount': discount,
    'id': id,
  };

  cwdiscountobj[id] = discountTemp;

  cwDisplayDiscountAdded();

  $("#cwdiscounttype").val(null);
  $("#cwdiscountamount").val(null);

  displayGrandTotal();
})

// delete discount
$("#cwdiscTable").on("click", ".deleteDiscount", function () {
  let id = $(this).attr("data-id");
  delete cwdiscountobj[id];

  cwDisplayDiscountAdded();
  displayGrandTotal();
});

// post data
$('#cwaccept').on('click', function () {
  let phonenum = $('#cwphonenum').val();
  let name = $('#cwcustname').val();
  let apartment = $('#cwapartment').val();
  let dong = $('#cwdong').val();
  let hosu = $('#cwhosu').val();
  let type = $('#cwtype').val();
  let average = $('#cwaverage').val();
  let note = $('#cwnote').val();
  let product = $('#cwproduct').val();

  let moveindate = $('#cwmoveindate').val();
  let moveinConfirm = $('#cwmoveinbtn').attr('data-status');
  let constructiondate = $('#cwconstructiondate').val();
  let constructionConfirm = $('#cwconstructionbtn').attr('data-status');

  let cashreceiptapptrue = $('#cwapplication').is(":checked");
  let cashreceiptappfalse = $('#cwnotapplied').is(":checked");
  let incomededuct = $('#cwincomedd').is(":checked");
  let proffexpi = $('#cwproofexp').is(":checked");
  let cashphonenum = $('#cwcustphone').val();

  let estimateid = $('#cwestimateid').val();
  let requestid = $('#cwrequestid').val();
  let custid = $('#cwcustid').val();

  let grandTotal = $('#cwTotalCont').text();
  let vat = $('#cwvat').is(":checked");
  let downpayment = $('#cwdownpayment').val();

  let constID = localStorage.LoginSession;

  let isCashReceipt;

  if (!estimateid) { estimateid = null; }
  if (!custid) { custid = null; }
  if (!requestid) { requestid = null; }
  if (!cashphonenum) { cashphonenum = null; }
  if (!downpayment) { downpayment = '0'; }

  if (moveinConfirm === 'false') { moveinConfirm = false }
  else if (moveinConfirm === 'true') { moveinConfirm = true }

  if (constructionConfirm === 'false') { constructionConfirm = false }
  else if (constructionConfirm === 'true') { constructionConfirm = true }

  if (cashreceiptapptrue === true) {
    if (incomededuct === false && proffexpi === false) { return; }
    if (proffexpi === true) { isCashReceipt = true }
  }

  if (cashreceiptapptrue === false) { isCashReceipt = false; }

  if (!phonenum && !name && !apartment && !product && !dong && !hosu && !type && !note && !average && !moveindate && !constructiondate) {return;}

  const data = {
    "estimateId": estimateid,
    "customerId": custid,
    "phoneNumber": phonenum,
    "customerName": name,
    "requestOrderId": requestid,
    "productId": product,
    "apartmentCode": apartment,
    "east": dong,
    "lake": hosu,
    "type": type,
    "planeWater": average,
    "note": note,
    "moveInDate": moveindate,
    "dateOfRequestForConstruction": constructiondate,
    "price": Number(grandTotal),
    "isCashReceipt": isCashReceipt,
    "isVat": vat,
    "isConfirmationMoveInDate": moveinConfirm,
    "isConfirmationDateOfRequestForConstruction": constructionConfirm,
    "cashReceiptPurpose": proffexpi,
    "cashReceiptPhoneNumber": cashphonenum,
    "constructorId": constID,
    "downPayment": downpayment,
    "estimateDetails": makeProductArr(cwproductobj),
    "discounts": makeDiscountArr(cwdiscountobj)
  }

  console.log(data)
  const url = `http://210.99.223.38:8081/api/order/estimate`;
  console.log(postData(data, url));

  // cwClearInputs();
})

// from home btn [계약서 수정]
$('#homeOrderCont').on('click', '.openOrderInfo', function () {
  cwClearInputs();
  const id = $(this).attr('data-orderId');
  const reqUrl = `http://210.99.223.38:8081/api/order/estimate/resend?requestOrderId=${id}`;
  const result = getData(reqUrl).data;
  console.log('id: ', id);
  console.log('result: ', result)

  if(result) {
    cwDisplayProducts();
    cwDisplayOrderInfo(result);
  }
});

// from home btn [견적서 쓰기]
$('#homeOrderCont').on('click', '.openWriteQuote', function () {
  cwClearInputs();
  const id = $(this).attr('data-orderId');
  const reqUrl = `http://210.99.223.38:8081/api/order?requestOrderId=${id}`;
  const result = getData(reqUrl).data;
  console.log('id: ', id);
  console.log('result: ', result)

  if (result) {
    cwDisplayProducts();
    cwDisplayQuoteInfo(result);
  }
});

// from contract list [계약서 수정]
$("#contractlistCont").on("click", ".contractAmend", function () {
  cwClearInputs();
  const id = $(this).attr('data-id');
  const reqUrl = `http://210.99.223.38:8081/api/order/estimate/resend?requestOrderId=${id}`;
  const result = getData(reqUrl).data;
  console.log('id: ', id);
  console.log('result: ', result);

  if (result) {
    cwDisplayProducts();
    cwDisplayOrderInfo(result);
  }
});

// from contract list  [견적서 쓰기]
$("#contractlistCont").on("click", ".contractListView", function () {
  cwClearInputs();
  const id = $(this).attr('data-id');
  const reqUrl = `http://210.99.223.38:8081/api/order?requestOrderId=${id}`;
  const result = getData(reqUrl).data;
  console.log('id: ', id);
  console.log('result: ', result);

  if (result) {
    cwDisplayProducts();
    cwDisplayQuoteInfo(result);
  }
});


/** SELECT2 OPTIONS */
// contract writing => apartment
$('#cwapartment').select2({
  theme: 'bootstrap-5',
  width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
  placeholder: $(this).data('placeholder'),
});

// contract writing => product list
$('#cwproduct').select2({
  theme: 'bootstrap-5',
  width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
  placeholder: $(this).data('placeholder'),
});