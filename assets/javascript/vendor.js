// This will hold the main functions to be reuse throughout other scripts
// fetch functions,
function getData(url){
    var tmp = null;
    $.ajax({
        url:url,
        async: false,
        dataType: "json",
        success: function (results) {
            //$.each(results, function (i, result) {
                tmp = results;
            //});
        },
        error: function () {
            console.log("error");
        },
    });
    return tmp;
}

async function asyncGetData(url){ 
    let tmp = null;
    await $.ajax({
        url:url,
        async: false,
        dataType: "json",
        success: function (results) {
            //$.each(results, function (i, result) {
                tmp = results;
            //});
        },
        error: function () {
            console.log("error");
        },
    });
    return tmp;
}

/* sample data structure
    const data = {username: username, password: password} 
    const url = 'http://210.99.223.38:8081/api/login'
*/
function postData(data,url){    
    var result = null;
    $.ajax({
        method: 'POST',
        url: url,
        dataType: 'JSON',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        success: function (responses) {
            result = responses;
        }
    });
    return result;
}

function ajaxpostImg(data,url){    
    var result = null;
    $.ajax({
        url: url,
        method: 'POST',
        timeout: 0,
        dataType: 'JSON',
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: data,
        success: function (responses) {
            result = responses;
        }
    });
    return result;
}

function ajaxPutImg(data, url) {
    var result = null;
    $.ajax({
        url: url,
        method: 'PUT',
        timeout: 0,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: data,
        success: function (responses) {
            result = responses;
        }
    });
    return result;
}

function jsPostData(dataParam, url){
    fetch(url, {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataParam)
      })        
      .then(response => response.json())
      .then(response =>{    
        console.log(response.message);        
      })
      .catch(err => console.error(err)); 
}

function fetchpostImage(dataParam, url){
    fetch(url, {
        method: 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body: dataParam
      })        
      .then(response => response.json())
      .then(response =>{    
        console.log(response.message);        
      })
      .catch(err => console.error(err)); 
}

function putData(data,url){    
    var result = null;
    $.ajax({
        method: 'PUT',
        url: url,
        dataType: 'JSON',
        contentType: "application/json",
        async: false,
        data: JSON.stringify(data),
        success: function (responses) {
            //$.each(responses, function (i, response) {
                result = responses;
            //})
        }
    });
    return result;
}

function ajaxdelData(url){
    let result;
    $.ajax({
        "url": url,
        "method": 'DELETE',
        "timeout": 0,
        success: function (responses) {
            result = responses;
        }
    });
    return result;
}

// mustache function
const mustacheTemplating = (container,template,data) =>{
    const $container = $("#"+container);
    const $template = $("#"+template).html();  

    $container.append(Mustache.render($template, data)); 
}

// call the basic overlay modal
const modal = (title,modalname) =>{
    $("#"+modalname).modal("show");
    $("#"+modalname).find('.modaltitle').text(title);
}

const modalNC = (title, modalname) => {
    $("#" + modalname).modal("show");
    $("#" + modalname).find('.modaltitleNC').text(title);
}
	

const displayTableData = (table,dataSet,columnSet) =>{
    $(table).DataTable({
        processing: true,
        data: dataSet,
        columns: columnSet,
    });
}
const displayHTMLTableData = (table) =>{
    $('#'+table).DataTable();
}
const setTableData = (table) =>{
    $('#'+table).DataTable({
        'fixedHeader': false,
        'searching': false,
        'paging': false,
        'bSort': false,
        'drawCallback': function( settings ) {
            $('#'+table+' thead').remove();
        }
    });
}

// modify dataTable
function noSearchDataTable(table) {
    $('#' + table).DataTable({
        'fixedHeader': false,
        'searching': false,
        'paging': true,
        'bSort': true,
    });
}

// destroy dataTable
function dtDestroy(table, tbody) {
    $('#' + table).DataTable().destroy();
    $('#' + tbody).empty();
}


function getFileName(fullPath){
    if (fullPath) {
        var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
        var filename = fullPath.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        return filename;
    }
}