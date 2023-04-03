function payDisplayDetails() {
  const getPayUrl = `http://210.99.223.38:8081/api/setting/payment-request?constructorId=${auths.id}`;
  const result = getData(getPayUrl).data;
  console.log(result);

  const bank = `<option selected value="${result.bank}">${result.bank}</option>`;

  $('#payTemplate').val(result.payTemplate);
  $('#paybank').prepend(bank).change();
  $('#paybankAccount').val(result.bankAccount);

  $('#payTemplate').prop('disabled', true);
  $('#paybank').prop('disabled', true);
  $('#paybankAccount').prop('disabled', true);
}

// onload page
$('#paymentrequestmanagement_btn').on('click', function() {
  payDisplayDetails();
});

// post data
$('#payBtn').on('click', function () {
  let payTemplate = $('#payTemplate').val();
  let bank = $('#paybank').val();
  let bankAccount = $('#paybankAccount').val();

  // Validate if the input fields are not empty
  if (!payTemplate || !bank || !bankAccount) { return; }

  const url = `http://210.99.223.38:8081/api/setting/payment-request`;
  let data = {
    'constructorId': auths.id,
    'payTemplate': payTemplate,
    'bank': bank,
    'bankAccount': bankAccount
  }
  postData(data, url);
  console.log(data);

  setTimeout(function () {
    payDisplayDetails();
  }, 1000);
})

// template toggle
$("#payTempBtn").on('click', function () {
  $('#payTemplate').prop('disabled', function (i, v) { return !v; });
  $('#paybank').prop('disabled', function (i, v) { return !v; });
  $('#paybankAccount').prop('disabled', function (i, v) { return !v; });
})

/** SELECT2 OPTIONS */
$('#paybank').select2({
  theme: 'bootstrap-5',
  width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
  placeholder: $(this).data('placeholder'),
});




