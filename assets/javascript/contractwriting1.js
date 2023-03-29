// TO MAKE SET OF DATA FORMAT INSIDE
function makenewcustomer(data) {
  const newarray = [];
  const rawarray = data;

  var num = 0;
  $.each(rawarray, function (i, data) {
    let constructStat;
    let payStat;
    let constructStat_class;
    let payStat_class;
    constructStat = data.completeConstruct === true ? "Y" : "N";
    payStat = data.payStat === true ? "Y" : "N";
    constructStat_class =
      data.completeConstruct === true
        ? "text-primary fw-bold"
        : "text-danger fw-bold";
    payStat_class =
      data.payStat === true ? "text-primary fw-bold" : "text-danger fw-bold";

    newarray[i] = {
      'createAt': data.createAt,
      'homeName': data.homeName,
      'homeDong': data.homeDong,
      'homeHosu': data.homeHosu,
      'homeType': data.homeType,
      'phoneNumber': data.phoneNumber,
      'name': data.name,
      'productName': data.productName,
      'price': data.price,
      'requestDate': data.requestDate,
      'requestDate_class': "text-primary fw-bold",
      'workDate': data.workDate,
      'workDate_class': "text-danger fw-bold",
      'note': data.note,
      'userConstructorName': data.userConstructorName,
      'completeConstruct': constructStat,
      'completeConstruct_class': constructStat_class,
      'completePay': payStat,
      'completePay_class': payStat_class,
    };
    num++;
  });
  return newarray;
}

// TO SET DATA FORMAT INSIDE
function displayProductList(container, template, data) {
  $("#" + container).empty();
  $.each(data, function (i, d) {
    const templateData = {
      'productname': d.productName,
      'productamount': d.price,
      'productqty': d.count,
      'productdisctype': d.discountContent,
      'productdiscamount': d.discount,
      'id': i,
    };
    mustacheTemplating(container, template, templateData);
  });
}

// DISPLAY CUSTOMER INFORMATION
function displayCustomer(data) {
  $("#cwcustname").val(data.name);
  //$('#cwcustphone').val(data.phone);
  $("#cwcustid").val(data.cwid);
  $("#cwconstruction_date").val(data.construction_date);
  $("#cwmovein_date").val(data.movein_date);
  $("#cwnote").val(data.note);
  $("#cwapartment").val(data.apartment);
  $("#cwtype").val(data.type);
  $("#cweastlake").val(data.lake);
  $("#cwreceipt").val(data.receipt);
}

// FOR DISPLAY OPTIONS
function displayoptions(dname, type) {
  const container = $(".cwreceiptCont");
  const phonenum = $(".cwcustphoneCont");
  type === "add" ? container.addClass(dname) : container.removeClass(dname);
  if (type === "add") {
    container.addClass(dname);
    phonenum.addClass(dname);
  } else {
    container.removeClass(dname);
    phonenum.removeClass(dname);
  }
}

// FOR DISPLAY PRODUCT LIST
function displaycwprodlist(container, template, data) {
  $("#" + container).empty();
  $.each(data, function (i, d) {
    const templateData = {
      id: d.id,
      name: d.name,
    };
    mustacheTemplating(container, template, templateData);
  });
}

// GET TOTAL ORDER AMOUNT
function displaySum() {
  let sum = getSum(cwproductlist_temparray, "productamount");
  const container = "cwTotalCont";
  const template = "cwTotalTemp";
  $("#" + container).empty();
  const templateData = {
    sum: sum,
  };
  mustacheTemplating(container, template, templateData);
}

// GET TOTAL AMOUNT
function getSum(arr) {
  let total = 0;
  let subtotal = 0;
  let discount = getDiscSum(cwdiscountlist_temparray);
  $.each(arr, function (i, d) {
    subtotal = d.price * d.count;
    total = total + subtotal;
  });
  total = total + getVatAmount(total) - discount;
  return total;
}

// GET TOTAL DISCOUNT 
function getDiscSum(arr) {
  let total = 0;
  let subtotal = 0;
  $.each(arr, function (i, d) {
    subtotal = d.discount * 1;
    total = total + subtotal;
  });
  return total;
}

// GET VAT AMOUNT
function getVatAmount(sum) {
  let vat = 0;
  let isVat = $("#cwvat").is(":checked");

  if (isVat === true) {
    vat = sum * 0.1;
  }
  return vat;
}

// DISPLAY ADDED PRODUCT
function displayAddedItem() {
  const cwprodTable = "cwdataTable";
  const cwprodTemplate = "prodArrListTemplate";
  const cwprodCont = "cwdataCont";
  displayProductList(cwprodCont, cwprodTemplate, cwproductlist_temparray);
  // displayHTMLTableData(cwprodTable);
  displaySum();
}

// DISPLAY ADDED DISCOUNT
function displayAddedDisc() {
  const cwpdiscTable = "cwdiscTable";
  const cwdiscTemplate = "discArrListTemplate";
  const cwdiscCont = "cwdiscCont";
  displayProductList(cwdiscCont, cwdiscTemplate, cwdiscountlist_temparray);
  // displayHTMLTableData(cwpdiscTable);
  displaySum();
}

// ARRAY VAR FOR PRODUCT & DISCOUNT LIST
var cwproductlist_temparray = [];
var cwdiscountlist_temparray = [];
const cwcustinfo = {
  cwid: "",
  name: "",
  phone: "",
  construction_date: "",
  movein_date: "",
  note: "",
  apartment: "",
  receipt: "",
  type: "",
};

// ********************** end of main function here *******************
// setTableData("cwdataTable");
// setTableData("cwdiscTable");
$("#cwMoveinBtn").on("click", function () {
  const btnStat = $(this).attr("data-status");
  const stat = btnStat === "true" ? "false" : "true";
  $("#cwMoveinBtn").attr("data-status", stat);
  if (stat === "true") {
    $(".cwMoveinBtn").removeClass("btn-primary");
    $(".cwMoveinBtn").addClass("btn-secondary");
  } else {
    $(".cwMoveinBtn").removeClass("btn-secondary");
    $(".cwMoveinBtn").addClass("btn-primary");
  }
  console.log(stat);
});
$("#cwConstrucBtn").on("click", function () {
  const btnStat = $(this).attr("data-status");
  const stat = btnStat === "true" ? "false" : "true";
  $("#cwConstrucBtn").attr("data-status", stat);
  if (stat === "true") {
    $(".cwConstrucBtn").addClass("btn-secondary");
    $(".cwConstrucBtn").removeClass("btn-primary");
  } else {
    $(".cwConstrucBtn").addClass("btn-primary");
    $(".cwConstrucBtn").removeClass("btn-secondary");
  }
});

// GET PRODUCT LIST
const url =
  "http://210.99.223.38:8081/api/constructor/product/list?constructorId=" +
  localStorage.LoginSession;
const data = getData(url).data;
displaycwprodlist("cwproductCont", "cwproductTemp", data);
console.log(data);

$("#cwapplication").on("click", function () {
  displayoptions("d-none", "remove");
});

$("#cwnotapplied").on("click", function () {
  let val = $(this).val();
  displayoptions("d-none", "add");
});

// RETRIEVE DATA BUTTON - FOR GETTING CUSTOMER DATA THRU PHONE NUMBER
$("#cwretrieveCustBtn").on("click", function () {
  let phonenum = $("#cwphonenum").val();

  const url =
    "http://210.99.223.38:8081/api/order/customer?phoneNumber=" + phonenum;
  const data = getData(url).data;
  console.log(data.id);
  const cwcustinfo = {
    cwid: data.id,
    name: data.name,
    phone: data.phoneNumber,
    construction_date: "",
    movein_date: "",
    note: "",
    apartment: "",
    receipt: "",
  };
  displayCustomer(cwcustinfo);
});


// ADD PRODUCT
$("#addDataProd").on("click", function () {
  console.log(cwproductlist_temparray);
  let num = cwproductlist_temparray.length;

  // productname,productamount,productQty,discounttype,discountamount
  let productname = $("#productname").val();
  let productamount = $("#productamount").val();
  let productQty = $("#productQty").val();

  cwproductlist_temparray[num] = {
    productName: productname,
    count: productQty,
    price: productamount,
  };
  
  displayAddedItem();
  num++;
});

// ADD DISCOUNT
$("#addDiscount").on("click", function () {
  let num = cwdiscountlist_temparray.length;
  let sum = 0;
  // productname,productamount,productQty,discounttype,discountamount
  let productDiscType = $("#discounttype").val();
  let discountamount = $("#discountamount").val();

  cwdiscountlist_temparray[num] = {
    discountContent: productDiscType,
    discount: discountamount,
  };
  displayAddedDisc();
  num++;
});

// DATA TABLE DELETE
$("#cwdataTable").on("click", ".deleteData", function () {
  let id = $(this).attr("data-id");
  const index = cwproductlist_temparray.indexOf(id);
  cwproductlist_temparray.splice(index, 1);
  displayAddedItem();

  sum =
    getSum(cwproductlist_temparray, "productamount") +
    getVatAmount(getSum(cwproductlist_temparray, "productamount")) -
    getDiscSum(cwdiscountlist_temparray);
  const container = "cwTotalCont";
  const template = "cwTotalTemp";
  displaySum(sum, container, template);
});

// DISCOUNT TABLE DELETE
$("#cwdiscTable").on("click", ".deleteDiscount", function () {
  let id = $(this).attr("data-id");
  const index = cwdiscountlist_temparray.indexOf(id);
  cwdiscountlist_temparray.splice(index, 1);
  displayAddedDisc();

  sum =
    getSum(cwproductlist_temparray, "productamount") +
    getVatAmount(getSum(cwproductlist_temparray, "productamount")) -
    getDiscSum(cwdiscountlist_temparray);
  const container = "cwTotalCont";
  const template = "cwTotalTemp";
  displaySum(sum, container, template);
});

// CONTRACT WRITING FROM SIDEBAR
$("#contractwriting_btn").on("click", function () {
  $("#cwretrieveCustBtn").removeClass("d-none");
  cwproductlist_temparray = [];
  cwdiscountlist_temparray = [];
  $("#contractwriting_page")
    .find("input[type=text],select,textarea")
    .each(function () {
      $(this).val("");
    });

  $("#contractwriting_page")
    .find("input[type=radio]")
    .each(function () {
      $(this).removeAttr("checked");
    });

  displayAddedItem();
  displayAddedDisc();
});

$("#cwvat").on("click", function () {
  let isVat = $(this).is(":checked");
  if (isVat === true) {
    displaySum();
  }
});

// ACCEPT TO SUBMIT ESTIMATE DETAILS
$("#cwaccept").on("click", function () {
  console.log("master ez");
  const isVat = $("#cwvat").is(":checked");
  const url = "http://210.99.223.38:8081/api/order/estimate";
  let eastlake = $("#cweastlake").val();
  let east = eastlake.substr(0, 4);
  let lake = eastlake.substr(5, 4);
  const isCashReceipt = $("#cwapplication").is(":checked");
  let isPurpose = false;
  if (isCashReceipt === false) {
    isPurpose = false;
  } else {
    isPurpose = $("#cwincomedd").is(":checked");
  }
  let sum = getSum(cwproductlist_temparray, "productamount");
  const data = {
    estimateId: null,
    customerId: $("#cwcustid").val(),
    phoneNumber: $("#cwphonenum").val(),
    customerName: $("#cwcustname").val(),
    requestOrderId: null,
    productId: $("#cwproductCont").val(),
    apartmentCode: $("#cwapartment").val(),
    east: east,
    lake: lake,
    type: $("#cwtype").val(),
    note: $("#cwnote").val(),
    moveInDate: $("#cwmovein_date").val(),
    dateOfRequestForConstruction: $("#cwconstruction_date").val(),
    price: sum,
    isCashReceipt: isCashReceipt,
    isVat: $("#cwvat").is(":checked"),
    isConfirmationMoveInDate: $("#cwMoveinBtn").attr("data-status"),
    isConfirmationDateOfRequestForConstruction:
      $("#cwConstrucBtn").attr("data-status"),
    cashReceiptPurpose: isPurpose,
    cashReceiptPhoneNumber: $("#cwcustphone").val(),
    constructorId: localStorage.LoginSession,
    estimateDetails: cwproductlist_temparray,
    discounts: cwdiscountlist_temparray,
  };
  console.log(data);
  // postData(data,url);
});

// WRITE A QUOTE BUTTON FROM HOME PAGE
$(".openRequest").click(function () {
  $("#cwretrieveCustBtn").addClass("d-none");
  let id = $(this).attr("data-id");
  const url = "http://210.99.223.38:8081/api/order?requestOrderId=" + id;
  const data = getData(url).data;
  let eastlake = data.east + " " + data.lake;
  $("#cwcustid").val(data.customerId);
  $("#cwphonenum").val(data.phoneNumber);
  $("#cwcustname").val(data.customerName);
  $("#cwapartment").val(data.apartmentCode);
  $("#cwnote").val(data.note);
  $("#cweastlake").val(eastlake);
  $("#cwtype").val(data.type);
  $("#cwmovein_date").val(data.moveInDate);
  $("#cwMoveinBtn").val(data.isConfirmationMoveInDate);
  $("#cwconstruction_date").val(data.dateOfRequestForConstruction);
  $("#cwConstrucBtn").val(data.isConfirmationDateOfRequestForConstruction);
  let cwapplication = document.getElementById("cwapplication");
  let cwnotapplied = document.getElementById("cwapplication");
  let cwincomedd = document.getElementById("cwincomedd");
  let cwproofexp = document.getElementById("cwproofexp");
  data.cashReceiptPurpose === true
    ? cwapplication.setAttribute("checked", "checked")
    : cwnotapplied.setAttribute("checked", "checked");
  data.isCashReceipt === true
    ? cwincomedd.setAttribute("checked", "checked")
    : cwproofexp.setAttribute("checked", "checked");
  $("#cwcustphone").val(data.cashReceiptPhoneNumber);
  $("#cwconstructorId").val(data.constructorId);

  cwproductlist_temparray = data.estimateDetails;
  cwdiscountlist_temparray = data.discounts;

  displayAddedItem();
  displayAddedDisc();
  console.log(data);
});

//VIEW CONTRACT LIST TO CONTRACT WRITING
$("#contractlistCont").on("click", ".contractListView", function () {
  $("#cwretrieveCustBtn").addClass("d-none");
  let id = $(this).attr("data-id");
  console.log(id);
  // const url = "http://210.99.223.38:8081/api/order/estimate/resend?requestOrderId="+id;
  const url = "http://210.99.223.38:8081/api/order?requestOrderId=" + id;
  const data = getData(url).data;
  let listEastlake = data.east + " " + data.lake;
  $("#cwcustid").val(data.customerId);
  $("#cwphonenum").val(data.phoneNumber);
  $("#cwcustname").val(data.customerName);
  $("#cwapartment").val(data.apartmentCode);
  $("#cwnote").val(data.note);
  $("#cweastlake").val(listEastlake);
  $("#cwtype").val(data.type);
  $("#cwmovein_date").val(data.moveInDate);
  $("#cwMoveinBtn").val(data.isConfirmationMoveInDate);
  $("#cwconstruction_date").val(data.dateOfRequestForConstruction);
  $("#cwConstrucBtn").val(data.isConfirmationDateOfRequestForConstruction);
  let listApplication = document.getElementById("cwapplication");
  let listNotapplied = document.getElementById("cwapplication");
  let listIncomedd = document.getElementById("cwincomedd");
  let listProofexp = document.getElementById("cwproofexp");
  data.cashReceiptPurpose === true
    ? listApplication.setAttribute("checked", "checked")
    : listNotapplied.setAttribute("checked", "checked");
  data.isCashReceipt === true
    ? listIncomedd.setAttribute("checked", "checked")
    : listProofexp.setAttribute("checked", "checked");
  $("#cwcustphone").val(data.cashReceiptPhoneNumber);
  $("#cwconstructorId").val(data.constructorId);

  cwproductlist_temparray = data.estimateDetails;
  cwdiscountlist_temparray = data.discounts;

  displayAddedItem();
  displayAddedDisc();
  console.log(data);
});

//VIEW CONTRACT LIST TO CONTRACT WRITING
$("#contractlistCont").on("click", ".contractAmend", function () {
  $("#cwretrieveCustBtn").addClass("d-none");
  let id = $(this).attr("data-id");
  console.log(id);
  // const url = 'http://210.99.223.38:8081/api/order/estimate/resend?requestOrderId=6f16e659-c2b4-484d-a44c-326fa1e06874'
  // console.log(url);

  const url = "http://210.99.223.38:8081/api/order/estimate/resend?requestOrderId="+id;
  // const url = "http://210.99.223.38:8081/api/order?requestOrderId=" + id;
  // 6f16e659-c2b4-484d-a44c-326fa1e06874
  const data = getData(url).data;
  console.log(data);
  let listEastlake = data.east + " " + data.lake;
  $("#cwcustid").val(data.customerId);
  $("#cwphonenum").val(data.phoneNumber);
  $("#cwcustname").val(data.customerName);
  $("#cwapartment").val(data.apartmentCode);
  $("#cwnote").val(data.note);
  $("#cweastlake").val(listEastlake);
  $("#cwtype").val(data.type);
  $("#cwmovein_date").val(data.moveInDate);
  $("#cwMoveinBtn").val(data.isConfirmationMoveInDate);
  $("#cwconstruction_date").val(data.dateOfRequestForConstruction);
  $("#cwConstrucBtn").val(data.isConfirmationDateOfRequestForConstruction);
  let listApplication = document.getElementById("cwapplication");
  let listNotapplied = document.getElementById("cwapplication");
  let listIncomedd = document.getElementById("cwincomedd");
  let listProofexp = document.getElementById("cwproofexp");
  data.cashReceiptPurpose === true
    ? listApplication.setAttribute("checked", "checked")
    : listNotapplied.setAttribute("checked", "checked");
  data.isCashReceipt === true
    ? listIncomedd.setAttribute("checked", "checked")
    : listProofexp.setAttribute("checked", "checked");
  $("#cwcustphone").val(data.cashReceiptPhoneNumber);
  $("#cwconstructorId").val(data.constructorId);

  cwproductlist_temparray = data.estimateDetails;
  cwdiscountlist_temparray = data.discounts;

  displayAddedItem();
  displayAddedDisc();
  console.log(data);
});
