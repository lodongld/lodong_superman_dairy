
// FOR DISPLAY
function displayTechList(container, template, data){
    $('#'+container).empty();
    $.each(data,function(i,d){
        const tempData = {
            'userConstructorId':d.userConstructorId,
            'name':d.name,
            'active':d.active
        }
        mustacheTemplating(container,template,tempData);
    })
}

// Create New Array for Display
function makeNewTech(data){
    const newarray = [];
    const rawarray = data;
    var num = 0;
    $.each(rawarray,function(i,data){
        let techStat = (data.active === true) ? "checked" : "";
        newarray[i] = {
            'userConstructorId':data.userConstructorId,
            'name':data.name,
            'active':techStat
        }
        num++;
    });
    return newarray;
}

//fetch Technician List
$('#technicianmanagement_btn').on('click', function(){
    let url = "http://210.99.223.38:8081/api/setting/worker/on-off?constructorId="+localStorage.LoginSession;
    const data = getData(url).data;
    const techTemplate = "listTechTemp";
    const techContainer = "listTechCont";
    displayTechList (techContainer, techTemplate, makeNewTech(data),true); 
})


// FOR SWITCHES BUTTONS
$('#listTechCont ').on('change', '.techSwitchButton', function() {
    let switchStatus = this.checked ? "true" : "false"; 
    const userConstructorId = $(this).attr('data-workerId');
    const url = "http://210.99.223.38:8081/api/setting/worker/on-off?userConstructorId="+userConstructorId+"&isActive="+switchStatus;

    const switchUpdate = {
        'userConstructorId': userConstructorId,
        'isActive': switchStatus
    }
    postData(switchUpdate,url);
    console.log('Worker Status Updated');
});



  // POST INVITE TECHNICIAN
$('#invBtn').on('click', function(e){
    e.preventDefault();

    let techname = $('#techname').val();
    let phonenumber = $('#phonenumber').val();

    const url = "";
    const data ={
        'constructorId': localStorage.LoginSession,
        'techname': techname,
        'phonenumber': phonenumber
    }
    console.log(data);
})


$('#technicianmanagement_btn').on('click', function () {
    // run ur code

    let url = `http://210.99.223.38:8081/api/setting/worker/on-off?constructorId=${localStorage.LoginSession}`;
    const data = getData(url).data;
    const techTemplate = "listTechTemp";
    const techContainer = "listTechCont";
    displayTechList(techContainer, techTemplate, makeNewTech(data), true);
});

