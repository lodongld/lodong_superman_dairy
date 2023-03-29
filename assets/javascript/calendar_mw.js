var changeableDate = new Date();
let day, month, year;
const dateToday = setDateToday();
const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const weeks = ["1째주", "2째주", "3째주", "4째주", "5째주"];
let workerEvents = [];
let i, renderValue, eventList;

let thisWeekDates = [];
let thisWeekDateOnly = [];
let wholeYearWednesdays = [];
let monthWednesdays = [];
let workerIds = [];
let weeklyUrl = [];
let yearWeekNum;

const weekDateLength = $('.weekly_calendar-head-legend .weekdate').length;
const weekDateDivs = $('.weekly_calendar-head-legend .weekdate');
const weekDateEventDivs = $('.weekly_calendar-body-legend');

/** GLOBAL FUNCTIONS */
function checkModalHeader() {
    if ($('#globalModal .modal-header').hasClass('bg-danger')) {
        $('#globalModal .modal-header').removeClass('bg-danger').addClass('bg-primary');
        $('#globalModal #taskGetTimeMessage').removeClass('d-block').addClass('d-none');
    }
}
/** END OF GLOBAL FUNCTIONS */


/** MONTHLY FUNCTIONS */
// render calendar
function monthlyRenderCalendar() {
    day = changeableDate.getDate();
    month = changeableDate.getMonth();
    year = changeableDate.getFullYear();

    changeableDate.setDate(1);

    const monthDays = document.querySelector('#monthly_calendar-body-days');
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const lastDateOfCurrMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndexOfCurrMonth = changeableDate.getDay();
    const lastDayIndexOfCurrMonth = new Date(year, month + 1, 0).getDay();
    const nextMonthDays = 7 - lastDayIndexOfCurrMonth - 1;

    document.querySelector('#calendar_title').innerHTML = months[month] + " " + year;

    let days = "";

    // GET THE PREVIOUS DATES OF THE PREVIOUS MONTH
    for (let x = firstDayIndexOfCurrMonth; x > 0; x--) {
        let prevmonth = month;
        let prevdate = prevMonthLastDate - x + 1;

        var stringprevmonth = stringMonthDate(prevmonth);
        var stringprevdate = stringMonthDate(prevdate);

        if (prevmonth == 0 && prevdate > firstDayIndexOfCurrMonth) {
            var newyear = year - 1;
            var newmonth = stringprevmonth = stringprevmonth === '00' ? '12' : stringprevmonth;
            var dataDate = newyear + '-' + newmonth + '-' + stringprevdate;
            days += `<div class=" dayDiv fix-h" data-date="${dataDate}"> <a class="date prevdate"> ${prevdate} </a> <div class="events">  </div> </div>`;
        }

        else {
            days += `<div class=" dayDiv fix-h" data-date="${year}-${stringprevmonth = stringprevmonth === '00' ? '12' : stringprevmonth}-${stringprevdate}"> <a class="date prevdate"> ${prevdate} </a> <div class="events"> </div> </div>`;
        }
    }

    // GET THE DATES OF THE CURRENT MONTH
    for (let i = 1; i <= lastDateOfCurrMonth; i++) {
        let currmonth = month + 1;
        var stringcurrmonth = stringMonthDate(currmonth);
        var stringdate = stringMonthDate(i);

        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            days += `<div class="day dayDiv fix-h" data-date="${year}-${stringcurrmonth}-${stringdate}"> <a class="date today"> ${i} </a> <div class="events"> </div> </div>`;
        } else {
            days += `<div class="day dayDiv fix-h" data-date="${year}-${stringcurrmonth}-${stringdate}"> <a class="date"> ${i} </a> <div class="events">  </div> </div>`;
        }
    }

    // GET THE NEXT EXCEEDING DATES OF THE NEXT MONTH
    for (let j = 1; j <= nextMonthDays; j++) {
        let nextmonth = month + 2;

        var stringnextmonth = stringMonthDate(nextmonth);
        var stingnextdate = stringMonthDate(j);

        if (nextmonth == 13 && lastDateOfCurrMonth > nextMonthDays) {
            days += `<div class=" dayDiv fix-h" data-date="${year + 1}-${stringnextmonth = stringnextmonth === '13' ? '01' : stringnextmonth}-${stingnextdate}"> <a class="date nxtdate"> ${j} </a> <div class="events"> </div> </div>`;
        } else {
            days += `<div class=" dayDiv fix-h" data-date="${year}-${stringnextmonth = stringnextmonth === '13' ? '01' : stringnextmonth}-${stingnextdate}"> <a class="date nxtdate"> ${j} </a> <div class="events"> </div> </div>`;
        }
    }

    monthDays.innerHTML = days; // render the boxes of dates
}

/** DOM QUERIES & MANIPULATION */ 
// get selected worker id
function monthlyGetSelectedWorkerId() {
    let worker_id;
    let worker_all = $('#monthly_workers-head .monthly_workers-all');
    let worker_single = $('#monthly_workers-body .monthly_workers-name');
    if (worker_all.hasClass('active')) {
        worker_id = 'all';
    }
    else if (worker_single.hasClass('selected') || worker_single.hasClass('active')) {
        if (worker_single.hasClass('selected')) {
            worker_id = 'all';
        }
        else if (worker_single.hasClass('active')) {
            worker_id = $('#monthly_workers-body').find('.monthly_workers-name.active').data('worker-id');
        }
    }
    return worker_id;
}

// get active worker id
function monthlyGetActiveWorkerId() {
    let worker_id;
    let worker_all = $('#monthly_workers-head .monthly_workers-all');
    let worker_single = $('#monthly_workers-body .monthly_workers-name');
    if (worker_all.hasClass('active')) {
        worker_id = 'all';
    }
    else if (worker_single.hasClass('selected') || worker_single.hasClass('active')) {
        if (worker_single.hasClass('selected')) {
            worker_id = $('#monthly_workers-body').find('.monthly_workers-name.selected').data('worker-id');
        }
        else if (worker_single.hasClass('active')) {
            worker_id = $('#monthly_workers-body').find('.monthly_workers-name.active').data('worker-id');
        }
    }
    return worker_id;
}

// get active workers name
function monthlyGetActiveWorkerName() {
    let worker_name;
    let worker_all = $('#monthly_workers-head .monthly_workers-all');
    let worker_single = $('#monthly_workers-body .monthly_workers-name');
    if (worker_all.hasClass('active')) {
        worker_name = 'all';
    }
    else if (worker_single.hasClass('selected') || worker_single.hasClass('active')) {
        if (worker_single.hasClass('selected')) {
            worker_name = $('#monthly_workers-body').find('.monthly_workers-name.selected').data('worker-name');
        }
        else if (worker_single.hasClass('active')) {
            worker_name = $('#monthly_workers-body').find('.monthly_workers-name.active').data('worker-name');
        }
    }
    return worker_name;
}

// make day clickable
function monthlyDayClickable(workerId, workerName) {
    if (workerId != 'all') {
        $('.day').map(function () {
            const hasevent = $(this).find(".events .event[data-wid='" + workerId + "']").length;
            if (hasevent == 0) {
                this.addEventListener('mouseenter', (event) => {
                    event.preventDefault();
                    $(this).addClass('cursor-pointer').addClass('hovered');
                });
                
                this.addEventListener('mouseleave', (event) => {
                    event.preventDefault();
                    $(this).removeClass('hovered');
                });
    
                // $(this).addClass('cursor-pointer');
                $(this).on('click', function () {
                    const dataDate = this.getAttribute("data-date")
                    const worker_id = workerId;
                    const worker_name = workerName;
                    const dd = dataDate.split("-");
                    
                    let container = 'globalModalCont'; // where to display the template
                    let template = 'holidayAddTemplate'; // template id
                    let data = {
                        'btnId': 'monthlyHolidayAddBtn',
                        'dataDate': dataDate,
                        'workerid': worker_id,
                        'dateMonth': splitChar(dd[1]),
                        'dateDate': splitChar(dd[2]),
                        'workername': worker_name
                    }
                    checkModalHeader();
                    $('#' + container).empty();
                    mustacheTemplating(container, template, data);
                    
                    let title = "휴무일 지정";
                    let modalname = "globalModal";
                    modal(title, modalname);
                })
            }
        })
    }
}

// make contract draggable
function monthlyContractDraggable(workerId) {
    // DRAG AND DROP
    const draggables = document.querySelectorAll('#monthly_contracts-body .monthly-contracts');
    const dropzones = document.querySelectorAll('#monthly_calendar-body-days .day');

    let dragged_contract, dropped_date;

    // draggable listeners
    for (const draggable of draggables) {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    }

    // Loop through dropzone boxes and add listeners
    for (const dropzone of dropzones) {
        dropzone.addEventListener('dragover', dragOver);
        dropzone.addEventListener('dragenter', dragEnter);
        dropzone.addEventListener('dragleave', dragLeave);
        dropzone.addEventListener('drop', dragDrop);
    }

    // Drag Functions
    function dragStart () {
        dragged_contract = this.getAttribute("data-contract-id");
        const this_contract_id_div = $('.monthly-contracts[data-contract-id="' + dragged_contract + '"]');
        setTimeout(() => (this_contract_id_div.addClass('invisible')), 0);
    }

    function dragEnd () {
        this.className = 'monthly-contracts';
    }

    function dragOver (e) {
        e.preventDefault();
        dropped_date = this.getAttribute("data-date");
        const inholiday = $('#monthly_calendar-body-days .day[data-date="' + dropped_date + '"]').find(".events .event.holiday[data-wid='" + monthlyGetActiveWorkerId() + "']").length;
        if (inholiday > 0) {
            this.removeEventListener('dragover', dragOver);
            return;
        } else {
            this.className += ' hovered';
        }
        // datesClickable();
    }

    function dragEnter (e) {
        e.preventDefault();
    }

    function dragLeave () {
        this.className = 'day dayDiv fix-h';
    }

    function dragDrop () {
        this.className = 'day dayDiv fix-h';
        dropped_date = this.getAttribute("data-date");
        monthlyAddTimeTaskEvent(dropped_date, dragged_contract, workerId);
    }
}

// worker all, onclick-event
function monthlyWorkerAll() {
    $('.monthly_workers-all').addClass('active');
    $('.monthly_workers-name').siblings().removeClass('active').removeClass('selected');
    monthlyRenderCalendar();
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday');
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task');
    monthlyFetchContracts();
    // $('.monthly-contracts').attr('draggable', 'false');
    // $('.monthly-contracts').css('cursor', 'grab');
}

// single click, onclick-event
function monthlyWorkerClick1(thisElem) {
    let workerId = thisElem.getAttribute('data-worker-id');
    let workerName = thisElem.getAttribute('data-worker-name');
    let activeWorker = $('.monthly_workers-name').siblings();
    let worker_all = $('#monthly_workers-head .monthly_workers-all');

    worker_all.removeClass('active');
    activeWorker.removeClass('active').removeClass('selected');
    thisElem.classList += ' selected';

    monthlyRenderCalendar();
    $('.day').map(function () { $(this).children('.events').empty(); });
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), 'all', 'holiday');
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), 'all', 'task');

    // setTimeout(function () {
    monthlyDayClickable(workerId, workerName);
    $('.monthly-contracts').attr('draggable', 'true');
    $('.monthly-contracts').removeClass('cursor-pointer');
    $('.monthly-contracts').css('cursor', 'grab');
    monthlyContractDraggable(workerId)
    // setTimeout(function () {
    addEllipsis();
    // }, 1000);
    // }, 200);
}

// double click, onclick-event
function monthlyWorkerClick2(thisElem) {
    // setTimeout(function () {
    let workerId = thisElem.getAttribute('data-worker-id');
    let workerName = thisElem.getAttribute('data-worker-name');
    let activeWorker = $('.monthly_workers-name').siblings();
    let worker_all = $('#monthly_workers-head .monthly_workers-all');

    worker_all.removeClass('active');
    activeWorker.removeClass('active').removeClass('selected');
    thisElem.classList += ' active';

    // setTimeout(function() {
    monthlyRenderCalendar();
    $('.day').map(function () { $(this).children('.events').empty(); });
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), workerId, 'holiday');
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), workerId, 'task');

    // setTimeout(function () {
    monthlyDayClickable(workerId, workerName);
    $('.monthly-contracts').attr('draggable', 'true');
    $('.monthly-contracts').removeClass('cursor-pointer');
    $('.monthly-contracts').css('cursor', 'grab');
    monthlyContractDraggable(workerId)
    // setTimeout(function () {
    addEllipsis();
    // }, 1000);
    // }, 1000);
    // }, 500);

}

function monthlyGetCalendarMaxHeight() {
    $(document).ready(function () {
        let height = $('#monthly_calendar-body').height();
        $('#monthly_contracts-body').css('max-height', height);
        $('#monthly_workers-body').css('max-height', height);
    });
}

function addEllipsis() {
    $("#monthly_view #monthly_calendar-body-days .day").map(function () {
        const eventsCount = $(this).find('.events .event').length;
        if (eventsCount > 2) {
            $(this).find('.events .event').eq(1).after('<i class="fa-solid fa-ellipsis-vertical text-center d-block fs-12px"></i>');
        }
    })
}

/** FETCH & DISPLAY */
// get url
function monthlyGetWorkerUrl(year, month, workerId, event) {
    if (workerId != 'all') {
        return 'http://210.99.223.38:8081/api/working/worker/' + event + '?year=' + year + '&month=' + month + '&userConstructorId=' + workerId;
    }
    else if (workerId === 'all') {
        return 'http://210.99.223.38:8081/api/working/worker/' + event + '/list?year=' + year + '&month=' + month + '&constructorId=' + session;
    }
}

// fetch workers 
function monthlyFetchWorkers() {
    let worker_url = 'http://210.99.223.38:8081/api/working/worker/list?constructorId=' + session;
    const workerListsData = getData(worker_url).data;
    const workerTemplate = "monthly_workers_template";
    const workerListsContainer = "monthly_workers-body";
    displayWorkers(workerListsContainer, workerTemplate, workerListsData);
}

// fetch contracts
function monthlyFetchContracts() {
    let contract_url = 'http://210.99.223.38:8081/api/working/task/no-worker?constructorId=' + session;
    const contractListsData = getData(contract_url).data;
    const contractTemplate = "monthly_contracts_template";
    const contractListsContainer = "monthly_contracts-body";
    displayContracts(contractListsContainer, contractTemplate, contractListsData);
}

// fetch worker events
function monthlyFetchDisplayWorkerEvents(year, month, workerId, event) {
    $.ajax({
        url: monthlyGetWorkerUrl(year, month, workerId, event),
        async: false,
        dataType: "json",
        success: function (results) {
            if (event === 'holiday') {
                for (i = 0; i < results.data.length; i++) {
                    workerEvents[i] = results.data[i];

                    var holidayId = results.data[i].holidayId;
                    var userConstructorId = results.data[i].userConstructorId;
                    var userConstructorName = results.data[i].name;
                    var holidayDate = results.data[i].date;

                    var alertColor = ['primary', 'secondary', 'success', 'warning', 'info', 'light', 'dark'];

                    // onclick = "monthlyCancelHoliday(this, 'monthly')"
                    $('.day').map(function () {
                        if (holidayDate === $(this).data('date')) {
                            // $(this).children('.events').append(event);
                            eventList = `<div class="cursor-pointer event holiday alert alert-danger p-1 fs-12px mb-1" data-event="${holidayId}" data-wname="${userConstructorName}" data-date="${holidayDate}" data-wid="${userConstructorId}" >` +
                                `<span class="fw-bold"> 휴무 </span>` +
                                `<span class="text-dark fw-bold"> ${userConstructorName} </span>` +
                                `</div>`;

                            $(this).children('.events').append(eventList);
                        }
                    });
                }
            }

            if (event === 'task') {
                for (i = 0; i < results.data.length; i++) {
                    workerEvents[i] = results.data[i];

                    var eventId = results.data[i].id;
                    var workId = results.data[i].workId;
                    var userConstructorId = results.data[i].userConstructorId;
                    var userConstructorName = results.data[i].userConstructorName;
                    var estimateWorkDate = results.data[i].estimateWorkDate;
                    var estimateWorkTime = results.data[i].estimateWorkTime;
                    var wprocess = results.data[i].process;

                    const newWorkTime = estimateWorkTime.split(":");

                    var alertColor = ['primary', 'secondary', 'success', 'warning', 'info', 'light', 'dark'];
                    // onclick = "monthlyCancelTask(this, 'monthly')"
                    $('.day').map(function () {
                        if (estimateWorkDate === $(this).data('date')) {
                            eventList = `<div class="cursor-pointer event task alert alert-primary p-1 fs-12px mb-1" data-event="${eventId}" data-wname="${userConstructorName}" data-time="${estimateWorkTime}" data-date="${estimateWorkDate}" data-wid="${userConstructorId}">` +
                                `<span class="fw-bold"> ${splitChar(newWorkTime[0])}시 </span>` +
                                `<span class="text-dark fw-bold"> ${userConstructorName} </span>` +
                                `<span class="text-dark"> ${wprocess} </span>` +
                                `</div>`;

                            $(this).children('.events').append(eventList);
                        }
                    });
                }
            }
        },
        error: function () {
            console.log(error);
        },
    });
}

// add time in task event
function monthlyAddTimeTaskEvent(ddate, contract, workerid) {
    let workername = $('.monthly_workers-name[data-worker-id="' + workerid + '"]').data('worker-name');

    const dd = ddate.split("-");
    let container = 'globalModalCont' // where to display the template
    let template = 'taskGetTimeTemplate' // template id
    let data;

    data = {
        'value': 'monthly',
        'btnId': 'taskGetTimeBtn',
        'taskid': contract,
        'dataDate': ddate,
        'workerid': workerid,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'workername': workername,
    }

    $('#' + container).empty();
    mustacheTemplating(container, template, data);

    let title = "작업시간 지정";
    let modalname = "globalModal";
    modal(title, modalname);
}

// add task cont
function monthlyConfirmAddTask(ddate, workerid, contract, workername) {
    // console.log('im here');
    let feedback = $('#globalModal .invalid-feedback');
    feedback.text('').removeClass('d-block');

    let thisDateWork = $('#monthly_calendar-body-days .day[data-date="' + ddate + '"]').find(".events .event[data-wid='" + workerid + "']");

    const hasevent = thisDateWork.length;
    var time = $('#globalModal #taskGetTime').val();
    let dd = ddate.split("-");
    var newtime = time + ':00';

    const workTimes = [];
    const splitWorkTimes = [];

    let container = 'globalModalCont'; // where to display the template
    let template = 'taskAddTemplate'; // template id
    let data = {
        'btnId': 'monthlyTaskAddBtn',
        'taskid': contract,
        'dataDate': ddate,
        'workerid': workerid,
        'time': newtime,
        'dtime': time,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'workername': workername,
    };

    if (!time) {
        feedback.text('시간을 선택하세요').addClass('d-block');
        return;
    }
    else {
        let tt = time.split(":");
        if (hasevent > 0) {
            thisDateWork.map(function () {
                const getTime = $(this).data('time');
                workTimes.push(getTime);
            })
            $.each(workTimes, function (i, e) {
                const sWTimes = this.split(":");
                splitWorkTimes.push(sWTimes[0]);
            });
            const checkTimeValues = splitWorkTimes.includes(tt[0]);
            if (checkTimeValues === true) {
                // return message has job
                if ($('#globalModal .modal-header').hasClass('bg-primary')) {
                    $('#globalModal .modal-header').removeClass('bg-primary').addClass('bg-danger');
                    $('#globalModal #taskGetTimeMessage').removeClass('d-none').addClass('d-block');
                    $('#globalModal #taskGetTimeMessage').text('중복된 시간입니다. 다른 시간을 선택해주세요.');
                } else if ($('#globalModal .modal-header').hasClass('bg-danger')) {
                    $('#globalModal #taskGetTimeMessage').text('중복된 시간입니다. 다른 시간을 선택해주세요.');
                }
                return;
            }
            else if ((checkTimeValues === false)) {
                // add task
                checkModalHeader();
                let title = "작업 할당";
                let modalname = "globalModal";
                modal(title, modalname);

                $('#' + container).empty();
                mustacheTemplating(container, template, data);
                // monthlyConfirmAddTask2(data);
            }
        }
        else if (hasevent == 0) {
            checkModalHeader();
            let title = "작업 할당";
            let modalname = "globalModal";
            modal(title, modalname);

            $('#' + container).empty();
            mustacheTemplating(container, template, data);
        }
    }
}
/** END OF MONTHLY FUNCTIONS */


/** WEEKLY FUNCTIONS */
// render calendar
function weeklyRenderCalendar() {
    $('.weekly_calendar-head-legend').find('.weekdate[data-date="' + dateToday + '"]').removeClass('text-primary');
    // let thisCurrentDate = new Date();
    // getAllWednesdaysInYear(thisCurrentDate.getFullYear())
    // getAllDatesOfCurrWeek(thisCurrentDate);
    // getAllWednesdaysInMonth(thisWeekDates[3]);

    // yearWeekNum = wholeYearWednesdays.indexOf(thisWeekDates[3]) + 1;
    // let weekMonthNum = monthWednesdays.indexOf(thisWeekDates[3]);
    // const monthName = months[new Date(thisWeekDates[3]).getMonth()];
    // const weekName = weeks[weekMonthNum];

    getAllWednesdaysInYear(changeableDate.getFullYear())
    getAllDatesOfCurrWeek(changeableDate);
    getAllWednesdaysInMonth(thisWeekDates[3]);

    yearWeekNum = wholeYearWednesdays.indexOf(thisWeekDates[3]) + 1;
    let weekMonthNum = monthWednesdays.indexOf(thisWeekDates[3]);
    const monthName = months[new Date(thisWeekDates[3]).getMonth()];
    const weekName = weeks[weekMonthNum];

    year = changeableDate.getFullYear();
    $('#calendar_title').text(monthName + ' ' + year + ', ' + weekName)
    $('.weekly_calendar-head-legend').find('.weekdate[data-date="' + dateToday + '"]').addClass('text-primary');
}

// get all wednesdays in the year
function getAllWednesdaysInYear(year) {
    wholeYearWednesdays = [];
    for (let month = 0; month < 12; month++) {
        let date = new Date(year, month, 1);
        while (date.getDay() !== 3) {
            date.setDate(date.getDate() + 1);
        }
        while (date.getMonth() === month) {
            wholeYearWednesdays.push(formatDate(new Date(date)));
            date.setDate(date.getDate() + 7);
        }
    }
}

// get all wednesday in a month
function getAllWednesdaysInMonth(date) {
    monthWednesdays = [];
    let thisMonthDate = new Date(date);

    thisMonthDate.setDate(1)
    var thisMonth = thisMonthDate.getMonth();

    while (thisMonthDate.getDay() !== 3) {
        thisMonthDate.setDate(thisMonthDate.getDate() + 1);
    }
    // Get all the other Wednesday in the month
    while (thisMonthDate.getMonth() === thisMonth) {
        monthWednesdays.push(formatDate(new Date(thisMonthDate.getTime())));
        thisMonthDate.setDate(thisMonthDate.getDate() + 7);
    }
}

// get all dates of current week
function getAllDatesOfCurrWeek(date) {
    thisWeekDates = [];
    thisWeekDateOnly = [];
    let thisWeekDate = new Date(date);
    thisWeekDate.setDate(thisWeekDate.getDate() - thisWeekDate.getDay());
    for (i = 0; i < 7; i++) {
        thisWeekDates.push(formatDate(new Date(thisWeekDate)));
        thisWeekDateOnly.push(formatDate(new Date(thisWeekDate)).split("-")[2]);
        thisWeekDate.setDate(thisWeekDate.getDate() + 1);
    }

    for (let x = 0; x < weekDateLength; x++) {
        weekDateDivs[x].setAttribute('data-date', thisWeekDates[x]);
        weekDateDivs[x].innerHTML = thisWeekDateOnly[x];
    }
}

/** DOM QUERIES &MANIPULATION */ 
// day clickable
function weeklyDayClickable() {
    const clickables = document.querySelectorAll('.weekly_calendar-body-legend .event-list');
    let clicked_date, clicked_worker, clicked_name;
    for (const clickable of clickables) {
        clickable.addEventListener('mouseover', mouseOver);
        clickable.addEventListener('mouseenter', mouseEnter);
        clickable.addEventListener('mouseleave', mouseLeave);
        clickable.addEventListener('click', onClick);
    }

    function mouseOver(e) {
        e.preventDefault();
        clicked_date = this.parentElement.getAttribute("data-date");
        clicked_worker = this.getAttribute('data-worker-id');
        const hasTask = $('.weekly_calendar-body-legend[data-date="' + clicked_date + '"]').find(".event-list .event[data-wid='" + clicked_worker + "']").length;
        if (hasTask > 0) {
            this.removeEventListener('mouseover', mouseOver);
            this.removeEventListener('mouseenter', mouseEnter);
            this.removeEventListener('mouseleave', mouseLeave);
            this.removeEventListener('click', onClick);
            return;
        } else {
            this.className += ' cursor-pointer hovered';
        }
    }

    function mouseEnter(e) {
        e.preventDefault();
    }

    function mouseLeave() {
        this.className = 'event-list';
    }

    function onClick(e) {
        e.preventDefault();
        clicked_date = this.parentElement.getAttribute('data-date');
        clicked_worker = this.getAttribute('data-worker-id');
        clicked_name = this.getAttribute('data-worker-name');
        // console.log(clicked_date, clicked_worker, clicked_name)

        const dd = clicked_date.split("-");

        let container = 'globalModalCont'; // where to display the template
        let template = 'holidayAddTemplate'; // template id
        let data = {
            'btnId': 'weeklyHolidayAddBtn',
            'dataDate': clicked_date,
            'workerid': clicked_worker,
            'dateMonth': splitChar(dd[1]),
            'dateDate': splitChar(dd[2]),
            'workername': clicked_name
        }
        // checkModalHeader();
        $('#' + container).empty();
        mustacheTemplating(container, template, data);

        let title = "휴무일 지정";
        let modalname = "globalModal";
        modal(title, modalname);
    }
}

// contract draggable
function weeklyContractDraggable() {
    // DRAG AND DROP
    const draggables = document.querySelectorAll('#weekly_contracts-body .weekly-contracts');
    const dropzones = document.querySelectorAll('#weekly_calendar-body .weekly_calendar-body-legend .event-list');

    let dragged_contract, dropped_date;

    // draggable listeners
    for (const draggable of draggables) {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    }

    // Loop through dropzone boxes and add listeners
    for (const dropzone of dropzones) {
        dropzone.addEventListener('dragover', dragOver);
        dropzone.addEventListener('dragenter', dragEnter);
        dropzone.addEventListener('dragleave', dragLeave);
        dropzone.addEventListener('drop', dragDrop);
    }

    // Drag Functions
    function dragStart() {
        dragged_contract = this.getAttribute("data-contract-id");
        const this_contract_id_div = $('.weekly-contracts[data-contract-id="' + dragged_contract + '"]');
        setTimeout(() => (this_contract_id_div.addClass('invisible')), 0);
    }

    function dragEnd() {
        this.className = 'weekly-contracts';
    }

    function dragOver(e) {
        e.preventDefault();
        // dropped_date = this.getAttribute("data-date");
        dropped_date = this.parentElement.getAttribute("data-date");
        dropped_worker = this.getAttribute('data-worker-id');
        const inholiday = $('.weekly_calendar-body-legend[data-date="' + dropped_date + '"]').find(".event-list .event.holiday[data-wid='" + dropped_worker + "']").length;
        if (inholiday > 0) {
            this.removeEventListener('dragover', dragOver);
            return;
        } else {
            this.className += ' hovered';
        }
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.className = 'event-list';
    }

    function dragDrop() {
        this.className = 'event-list';
        dropped_date = this.parentElement.getAttribute("data-date");
        dropped_worker = this.getAttribute('data-worker-id');
        dropped_name = this.getAttribute('data-worker-name');

        weeklyAddTimeTaskEvent(dropped_date, dragged_contract, dropped_worker, dropped_name);
        // console.log(dropped_date, dragged_contract, dropped_worker, dropped_name)
    }
}

function weeklyApplyDivMaxHeight() {
    let heights, maxHeight, v, x;
    for (i = 0; i < workerIds.length; i++) {
        v = $('.weekly_calendar-body-legend .event-list[data-worker-id="' + workerIds[i] + '"]')
        x = $('.weekly_workers-body .weekly_workers-name[data-worker-id="' + workerIds[i] + '"]')
        heights = v.map(function () {
            return $(this).outerHeight();
        }).get();
        maxHeight = Math.max.apply(null, heights);
        v.outerHeight(maxHeight);
        x.outerHeight(maxHeight);
    }
}

function weeklyMakeEventListDiv() {
    $('#weekly_calendar-body').empty();

    weekDateDivs.map(function () {
        $('#weekly_calendar-body').append('<div class="weekly_calendar-body-legend"></div>')
    })

    for (let x = 0; x < weekDateLength; x++) {
        $('.weekly_calendar-body-legend')[x].setAttribute('data-date', thisWeekDates[x]);
    }

    $('.weekly_workers-name').map(function () {
        let workerId = $(this).data('worker-id');
        let workerName = $(this).data('worker-name');
        workerIds.push(workerId);
        $('.weekly_calendar-body-legend').append('<div class="event-list" data-worker-id="' + workerId + '" data-worker-name="' + workerName + '"></div>');
    })
}

/** FETCH AND DISPLAY */
// get url
function weeklyGetWorkerUrl(year, week, event) {
    let url = 'http://210.99.223.38:8081/api/working/worker/' + event + '/list?year=' + year + '&week=' + week + '&constructorId=' + session;
    // console.log(url);
    return url;
}

// fetch worker events
function weeklyFetchDisplayWorkerEvents(year, weeknum, event) {
    $.ajax({
        url: weeklyGetWorkerUrl(year, weeknum, event),
        async: false,
        dataType: "json",
        success: function (results) {
            if (event === 'holiday') {
                for (i = 0; i < results.data.length; i++) {
                    workerEvents[i] = results.data[i];

                    var holidayId = results.data[i].holidayId;
                    var userConstructorId = results.data[i].userConstructorId;
                    var userConstructorName = results.data[i].name;
                    var holidayDate = results.data[i].date;

                    $('.weekly_calendar-body-legend .event-list').map(function () {
                        if (userConstructorId === $(this).data('worker-id') && holidayDate === $(this).parent().data('date')) {
                            eventList = `<div class="cursor-pointer event holiday alert alert-danger fs-12px" data-event="${holidayId}" data-wname="${userConstructorName}" data-date="${holidayDate}" data-wid="${userConstructorId}" >` +
                                `<span class="fw-bold"> 휴무 </span>` +
                                `</div>`;

                            $(this).append(eventList);
                        }
                    });
                }
            }

            if (event === 'task') {
                for (i = 0; i < results.data.length; i++) {
                    workerEvents[i] = results.data[i];

                    var eventId = results.data[i].id;
                    var workId = results.data[i].workId;
                    var userConstructorId = results.data[i].userConstructorId;
                    var userConstructorName = results.data[i].userConstructorName;
                    var estimateWorkDate = results.data[i].estimateWorkDate;
                    var estimateWorkTime = results.data[i].estimateWorkTime;
                    var wprocess = results.data[i].process;

                    const newWorkTime = estimateWorkTime.split(":");

                    var alertColor = ['primary', 'secondary', 'success', 'warning', 'info', 'light', 'dark'];
                    $('.weekly_calendar-body-legend .event-list').map(function () {
                        if (userConstructorId === $(this).data('worker-id') && estimateWorkDate === $(this).parent().data('date')) {
                            eventList = `<div class="cursor-pointer event task alert alert-primary fs-12px" data-event="${eventId}" data-wname="${userConstructorName}" data-time="${estimateWorkTime}" data-date="${estimateWorkDate}" data-wid="${userConstructorId}">` +
                                `<span class="fw-bold"> ${splitChar(newWorkTime[0])}시 </span> <br/>` +
                                `<span class="text-dark fw-bold"> ${userConstructorName} </span> <br/>` +
                                `<span class="text-dark"> ${wprocess} </span>` +
                                `</div>`;

                            $(this).append(eventList);
                        }
                    });
                }
            }
        },
        error: function () {
            console.log(error);
        },
    });
}

// fetch contracts
function weeklyFetchContracts() {
    let contract_url = 'http://210.99.223.38:8081/api/working/task/no-worker?constructorId=' + session;
    const contractListsData = getData(contract_url).data;
    const contractTemplate = "weekly_contracts_template";
    const contractListsContainer = "weekly_contracts-body";
    displayContracts(contractListsContainer, contractTemplate, contractListsData);
}

// fetch workers
function weeklyFetchWorkers() {
    let worker_url = 'http://210.99.223.38:8081/api/working/worker/list?constructorId=' + session;
    const workerListsData = getData(worker_url).data;
    const workerTemplate = "weekly_workers_template";
    const workerListsContainer = "weekly_workers-body";
    displayWorkers(workerListsContainer, workerTemplate, workerListsData);  // used a reusable function
}

// add time in task
function weeklyAddTimeTaskEvent(ddate, contract, workerid, workername) {

    const dd = ddate.split("-");
    let container = 'globalModalCont' // where to display the template
    let template = 'taskGetTimeTemplate' // template id
    let data;

    data = {
        'value': 'weekly',
        'btnId': 'taskGetTimeBtn',
        'taskid': contract,
        'dataDate': ddate,
        'workerid': workerid,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'workername': workername,
    }

    $('#' + container).empty();
    mustacheTemplating(container, template, data);

    let title = "작업시간 지정";
    let modalname = "globalModal";
    modal(title, modalname);
}

// add task cont
function weeklyConfirmAddTask(ddate, workerid, contract, workername) {
    // console.log('im here');
    let feedback = $('#globalModal .invalid-feedback');
    feedback.text('').removeClass('d-block');

    let thisDateWork = $('.weekly_calendar-body-legend[data-date="' + ddate + '"]').find('.event-list .event[data-wid="' + workerid + '"]');
    const hasevent = thisDateWork.length;
    var time = $('#globalModal #taskGetTime').val();
    let dd = ddate.split("-");
    var newtime = time + ':00';

    const workTimes = [];
    const splitWorkTimes = [];

    let container = 'globalModalCont'; // where to display the template
    let template = 'taskAddTemplate'; // template id
    let data = {
        'btnId': 'weeklyTaskAddBtn',
        'taskid': contract,
        'dataDate': ddate,
        'workerid': workerid,
        'time': newtime,
        'dtime': time,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'workername': workername,
    };

    if (!time) {
        feedback.text('시간을 선택하세요').addClass('d-block');
        return;
    }
    else {
        let tt = time.split(":");
        if (hasevent > 0) {
            thisDateWork.map(function () {
                const getTime = $(this).data('time');
                workTimes.push(getTime);
            })
            $.each(workTimes, function (i, e) {
                const sWTimes = this.split(":");
                splitWorkTimes.push(sWTimes[0]);
            });
            const checkTimeValues = splitWorkTimes.includes(tt[0]);
            if (checkTimeValues === true) {
                // return message has job
                if ($('#globalModal .modal-header').hasClass('bg-primary')) {
                    $('#globalModal .modal-header').removeClass('bg-primary').addClass('bg-danger');
                    $('#globalModal #taskGetTimeMessage').removeClass('d-none').addClass('d-block');
                    $('#globalModal #taskGetTimeMessage').text('중복된 시간입니다. 다른 시간을 선택해주세요.');
                } else if ($('#globalModal .modal-header').hasClass('bg-danger')) {
                    $('#globalModal #taskGetTimeMessage').text('중복된 시간입니다. 다른 시간을 선택해주세요.');
                }
                return;
            }
            else if ((checkTimeValues === false)) {
                // add task
                checkModalHeader();
                let title = "작업 할당";
                let modalname = "globalModal";
                modal(title, modalname);

                $('#' + container).empty();
                mustacheTemplating(container, template, data);
                // monthlyConfirmAddTask2(data);
            }
        }
        else if (hasevent == 0) {
            checkModalHeader();
            let title = "작업 할당";
            let modalname = "globalModal";
            modal(title, modalname);

            $('#' + container).empty();
            mustacheTemplating(container, template, data);
        }
    }
}
/** END OF WEEKLY FUNCTIONS */


/** USED BOTH IN MONTHLY AND WEEKLY FUNCTIONS */
// view contract details
function viewTaskDetails(thisElem) {
    const id = thisElem.getAttribute('data-contract-id');

    let title = "작업 정보";
    let modalname = "globalModalNC";
    modalNC(title, modalname);

    let container = "globalModalContNC";
    let template = "taskDetailsTemplate";
    $('#'+container).empty();

    const url = "http://210.99.223.38:8081/api/working/task?workDetailId=" + id;

    const result = getData(url).data;
    console.log(result);

    const data = {
        'name': result.customerName,
        'phoneNumber': result.phoneNumber,
        'address': result.address,
        'addressDetail': result.addressDetail,
        'product': result.product,
        'process': result.process,
        'note': result.note,
        'moveInDate': result.liveInDate,
        'requestDate': result.requestConstructDate,
        'cashReceiptNum': result.cashReceiptPhoneNumber
        // 'incomeDeduction': 
    }
    mustacheTemplating(container, template, data);

    $('#taskMoveInConfirm').attr('checked', result.isConfirmationLiveIn);
    $('#taskRequestConfirm').attr('checked', result.isConfirmationConstruct);
    $('#taskReceipt').attr('checked', result.isCashReceipt);

    if ($('#taskReceipt').is(':checked') === true) {
        $('#taskReceiptDiv').removeClass('d-none')

        if (result.cashReceiptPurpose === true) {
            $('#taskIncomeDeduction').attr('checked', true);
            $('#taskProofExpend').attr('checked', false);
        } else if (result.cashReceiptPurpose === false) {
            $('#taskIncomeDeduction').attr('checked', false);
            $('#taskProofExpend').attr('checked', true);
        }
    }

    $('#' + container).find('input[type="text"], input[type="date"], textarea').prop('readonly', true).css('background', 'transparent');
    $('#' + container).find('input[type="radio"]').prop('disabled', true);
}

// display worker
function displayWorkers(container, template, data) {
    $('#' + container).empty();
    $.each(data, function (i, d) {
        const templateData = {
            'userConstructorId': d.userConstructorId,
            'name': d.name,
        }
        mustacheTemplating(container, template, templateData);
    })
}

// display contracts
function displayContracts(container, template, data) {
    $('#' + container).empty();
    $.each(data, function (i, d) {
        const templateData = {
            'id': d.id,
            'workId': d.workId,
            'apartmentName': d.apartmentName,
            'apartmentDong': d.apartmentDong,
            'apartmentHosu': d.apartmentHosu,
            'productName': d.productName,
            'process': d.process,
        }
        mustacheTemplating(container, template, templateData);
    })
}
/** END OF USED BOTH IN MONTHLY AND WEEKLY FUNCTIONS */

// SELECT OPTION
function getCalendarRenderValue() {
    renderValue = $('#calendar_select').find(":selected").val();

    if (renderValue === 'monthly') {
        $('#monthly_view').addClass('d-flex').removeClass('d-none');
        $('#weekly_view').addClass('d-none').removeClass('d-flex');
        $('#monthly_view .worker_all').addClass('active');
        $('#calendarprevBtn #calendar_prevBtn').addClass('monthly').removeClass('weekly');
        $('#calendarnxtBtn #calendar_nxtBtn').addClass('monthly').removeClass('weekly');
        $(document.body).removeClass('overflow-y-hidden');
        $('.calendar-card').removeClass('max-h');

        monthlyFetchWorkers();
        monthlyFetchContracts();
        monthlyRenderCalendar();
        monthlyGetCalendarMaxHeight();
        monthlyWorkerAll()
        addEllipsis();
    }

    else if (renderValue === 'weekly') {
        $('#weekly_view').addClass('d-flex').removeClass('d-none');
        $('#monthly_view').addClass('d-none').removeClass('d-flex');
        $('#calendarprevBtn #calendar_prevBtn').addClass('weekly').removeClass('monthly');
        $('#calendarnxtBtn #calendar_nxtBtn').addClass('weekly').removeClass('monthly');
        $(document.body).addClass('overflow-y-hidden');
        $('.calendar-card').addClass('max-h');

        weeklyFetchWorkers();
        weeklyFetchContracts();
        weeklyRenderCalendar();
        weeklyMakeEventListDiv();
        weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
        weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
        weeklyApplyDivMaxHeight();

        $('.weekly-contracts').attr('draggable', 'true');
        $('.weekly-contracts').removeClass('cursor-pointer');
        $('.weekly-contracts').css('cursor', 'grab');
        weeklyContractDraggable();
        weeklyDayClickable();


    }
}

// EVENT LISTENERS
$('#viewallcontracts-03_btn').on('click', function () {
    $("#calendar_select").val("monthly");
    getCalendarRenderValue();
})

/** START OF MONTHLY PROCESS */
// prev button
$('#calendarprevBtn').on('click', '#calendar_prevBtn.monthly', function () {
    changeableDate.setMonth(changeableDate.getMonth() - 1);
    monthlyRenderCalendar();
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday');
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task');    
    monthlyGetCalendarMaxHeight();
    // setTimeout(function () {
        addEllipsis();
        if (monthlyGetActiveWorkerId() != 'all') {
            $('.monthly-contracts').attr('draggable', 'true');
            $('.monthly-contracts').removeClass('cursor-pointer');
            $('.monthly-contracts').css('cursor', 'grab');
            monthlyContractDraggable(monthlyGetActiveWorkerId());
            monthlyDayClickable(monthlyGetActiveWorkerId(), monthlyGetActiveWorkerName());
        }
    // }, 1000);
});
// next button
$('#calendarnxtBtn').on('click', '#calendar_nxtBtn.monthly', function () {
    changeableDate.setMonth(changeableDate.getMonth() + 1);
    monthlyRenderCalendar();
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday');
    monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task');
    monthlyGetCalendarMaxHeight();
    // setTimeout(function () {
        addEllipsis();
        if (monthlyGetActiveWorkerId() != 'all') {
            $('.monthly-contracts').attr('draggable', 'true');
            $('.monthly-contracts').removeClass('cursor-pointer');
            $('.monthly-contracts').css('cursor', 'grab');
            monthlyContractDraggable(monthlyGetActiveWorkerId());
            monthlyDayClickable(monthlyGetActiveWorkerId(), monthlyGetActiveWorkerName());
        }
    // }, 1000);
});

// CANCEL HOLIDAY initiation
$('#monthly_calendar-body-days').on('click', '.events .event.holiday', function (e) {
    e.preventDefault();
    const id = $(this).data('event');
    const wname = $(this).data('wname');
    const wdate = $(this).data('date');

    const dd = wdate.split("-");

    let container = 'globalModalCont' // where to display the template
    let template = 'holidayCancelTemplate' // template id
    const data = {
        'btnId': 'monthlyHolidayCancelBtn',
        'id': id,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'workername': wname
    }

    $('#' + container).empty();
    mustacheTemplating(container, template, data);

    // $('#cancelHolidayModal').modal('show');
    let title = "휴무일 취소";
    let modalname = "globalModal";
    modal(title, modalname);
});

// CANCEL TASK initiation
$('#monthly_calendar-body-days').on('click', '.events .event.task', function (e) {
    e.preventDefault();
    const id = $(this).data('event');
    const wname = $(this).data('wname');
    const time = $(this).data('time');
    const wdate = $(this).data('date');
    const wid = $(this).data('wid');

    const dd = wdate.split("-");
    const tt = time.split(":");

    const container = 'globalModalCont' // where to display the template
    const template = 'taskCancelTemplate' // template id
    const data = {
        'btnId': 'monthlyTaskCancelBtn',
        'id': id,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'timeHr': splitChar(tt[0]),
        'timeMi': splitChar(tt[1]),
        'workername': wname
    }

    // console.log(data);

    $('#' + container).empty();
    mustacheTemplating(container, template, data);

    let title = "작업 취소";
    let modalname = "globalModal";
    modal(title, modalname);
});

// CANCEL HOLIDAY confirm
$('#globalModal').on('click', '#monthlyHolidayCancelBtn', function (e) {
    e.preventDefault();
    let holidayId = $(this).data('holiday');
    let url = 'http://210.99.223.38:8081/api/working/worker/holiday?holidayId=' + holidayId;
    ajaxdelData(url);

    setTimeout( function () {
        monthlyRenderCalendar();
        $('.day').map(function () { $(this).children('.events').empty(); });
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday'); 
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task');
        $('#globalModal').modal('hide');
        addEllipsis();

    }, 1000); 

    
});

// CANCEL TASK confirm
$('#globalModal').on('click', '#monthlyTaskCancelBtn', function (e) {
    e.preventDefault();
    let taskId = $(this).data('task');
    let url = 'http://210.99.223.38:8081/api/working/worker/task?id=' + taskId;
    const thisdata = { 'id': taskId }
    putData(thisdata, url);

    setTimeout(function () {
        monthlyFetchContracts();
        $('.day').map(function () { $(this).children('.events').empty(); });
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday');
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task'); //.
        checkModalHeader();
        addEllipsis();
        if (monthlyGetActiveWorkerId() != 'all') {
            $('.monthly-contracts').attr('draggable', 'true');
            $('.monthly-contracts').removeClass('cursor-pointer');
            $('.monthly-contracts').css('cursor', 'grab');
            monthlyContractDraggable(monthlyGetActiveWorkerId());
            monthlyDayClickable(monthlyGetActiveWorkerId(), monthlyGetActiveWorkerName());
        }
        $('#globalModal').modal('hide');
    }, 1000);
});

/// ADD HOLIDAY confirm
$('#globalModal').on('click', '#monthlyHolidayAddBtn', function (e) {
    e.preventDefault();
    // console.log('clickes');
    let dataDate = $(this).data('date');
    let worker_id = $(this).data('id');
    let url = 'http://210.99.223.38:8081/api/working/worker/holiday';
    const thisdata = {
        'date': dataDate,
        'userConstructorId': worker_id
    }
    const post = postData(thisdata, url);
    console.log(post);
    // console.log(postData(this))
    setTimeout(function () {
        $('.day').map(function () { $(this).children('.events').empty(); });
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday');
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task');
        addEllipsis();
        if (monthlyGetActiveWorkerId() != 'all') {
            $('.monthly-contracts').attr('draggable', 'true');
            $('.monthly-contracts').removeClass('cursor-pointer');
            $('.monthly-contracts').css('cursor', 'grab');
            monthlyContractDraggable(monthlyGetActiveWorkerId());
            monthlyDayClickable(monthlyGetActiveWorkerId(), monthlyGetActiveWorkerName());
        }

        $('#globalModal').modal('hide');
    }, 1000);
});

// ADD TASK confirm
$('#globalModal').on('click', '#monthlyTaskAddBtn', function (e) {
    e.preventDefault();
    let ddate = $(this).data('date');
    let time = $(this).data('time');
    let workerid = $(this).data('worker-id');
    let contract = $(this).data('task-id');

    let url = 'http://210.99.223.38:8081/api/working/worker/task';
    const thisdata = {
        'id': contract,
        'userConstructorId': workerid,
        'estimateWorkDate': ddate,
        'estimateWorkTime': time
    }

    postData(thisdata, url);

    setTimeout(function () {
        monthlyRenderCalendar();
        monthlyFetchContracts();
        $('.day').map(function () { $(this).children('.events').empty(); });
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'holiday');
        monthlyFetchDisplayWorkerEvents(year, stringMonthDate(month + 1), monthlyGetSelectedWorkerId(), 'task');
        
        addEllipsis();
        $('.monthly-contracts').attr('draggable', 'true');
        $('.monthly-contracts').removeClass('cursor-pointer');
        $('.monthly-contracts').css('cursor', 'grab');
        monthlyContractDraggable(monthlyGetActiveWorkerId());
        monthlyDayClickable(monthlyGetActiveWorkerId(), monthlyGetActiveWorkerName(monthlyGetActiveWorkerId()));

        $('#globalModal').modal('hide');
    }, 1000); 
    
});

/** END OF MONTHLY PROCESS */



/** START OF WEEKLY PROCESS */
// prev button
$('#calendarprevBtn').on('click', '#calendar_prevBtn.weekly', function () {
    // console.clear();
    // let newPrevDate = new Date(thisWeekDates[0]);
    // newPrevDate.setDate(newPrevDate.getDate() - 7);
    // var passDate = new Date(newPrevDate);
    // weeklyGetDatesOfPreviousWeek(passDate);

    changeableDate = new Date(thisWeekDates[0]);
    changeableDate.setDate(changeableDate.getDate() - 7);
    weeklyRenderCalendar();
    weeklyMakeEventListDiv();
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
    weeklyApplyDivMaxHeight();

    $('.weekly-contracts').attr('draggable', 'true');
    $('.weekly-contracts').removeClass('cursor-pointer');
    $('.weekly-contracts').css('cursor', 'grab');
    weeklyContractDraggable();
    weeklyDayClickable();

});
// nxt button
$('#calendarnxtBtn').on('click', '#calendar_nxtBtn.weekly', function () {
    // let newNextDate = new Date(thisWeekDates[6]);
    // newNextDate.setDate(newNextDate.getDate() + 7);
    // var passDate = new Date(newNextDate);
    // weeklyGetDatesOfNextWeek(passDate);

    changeableDate = new Date(thisWeekDates[6]);
    changeableDate.setDate(changeableDate.getDate() + 7);
    weeklyRenderCalendar();
    weeklyMakeEventListDiv();
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
    weeklyApplyDivMaxHeight();

    $('.weekly-contracts').attr('draggable', 'true');
    $('.weekly-contracts').removeClass('cursor-pointer');
    $('.weekly-contracts').css('cursor', 'grab');
    weeklyContractDraggable();
    weeklyDayClickable();

});

// CANCEL HOLIDAY initiation
$('#weekly_calendar-body').on('click', '.event-list .event.holiday', function (e) {
    e.preventDefault();
    const id = $(this).data('event');
    const wname = $(this).data('wname');
    const wdate = $(this).data('date');

    const dd = wdate.split("-");

    let container = 'globalModalCont' // where to display the template
    let template = 'holidayCancelTemplate' // template id
    const data = {
        'btnId': 'weeklyHolidayCancelBtn',
        'id': id,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'workername': wname
    }

    $('#' + container).empty();
    mustacheTemplating(container, template, data);

    // $('#cancelHolidayModal').modal('show');
    let title = "휴무일 취소";
    let modalname = "globalModal";
    modal(title, modalname);
});

// CANCEL TASK initiation
$('#weekly_calendar-body').on('click', '.event-list .event.task', function (e) {
    e.preventDefault();
    const id = $(this).data('event');
    const wname = $(this).data('wname');
    const time = $(this).data('time');
    const wdate = $(this).data('date');
    const wid = $(this).data('wid');

    const dd = wdate.split("-");
    const tt = time.split(":");

    const container = 'globalModalCont' // where to display the template
    const template = 'taskCancelTemplate' // template id
    const data = {
        'btnId': 'weeklyTaskCancelBtn',
        'id': id,
        'dateMonth': splitChar(dd[1]),
        'dateDate': splitChar(dd[2]),
        'timeHr': splitChar(tt[0]),
        'timeMi': splitChar(tt[1]),
        'workername': wname
    }

    // console.log(data);

    $('#' + container).empty();
    mustacheTemplating(container, template, data);

    let title = "작업 취소";
    let modalname = "globalModal";
    modal(title, modalname);
});

// CANCEL HOLIDAY confirm
$('#globalModal').on('click', '#weeklyHolidayCancelBtn', function (e) {
    e.preventDefault();
    let holidayId = $(this).data('holiday');
    let url = 'http://210.99.223.38:8081/api/working/worker/holiday?holidayId=' + holidayId;

    // console.log('del')
    ajaxdelData(url);

    setTimeout(function () {
        weeklyMakeEventListDiv();
        weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
        weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
        weeklyApplyDivMaxHeight();
    
        $('.weekly-contracts').attr('draggable', 'true');
        $('.weekly-contracts').removeClass('cursor-pointer');
        $('.weekly-contracts').css('cursor', 'grab');
        weeklyContractDraggable();
        weeklyDayClickable();
        
        $('#globalModal').modal('hide');
    }, 200);
});

// CANCEL TASK confirm
$('#globalModal').on('click', '#weeklyTaskCancelBtn', function (e) {
    e.preventDefault();
    let taskId = $(this).data('task');
    let url = 'http://210.99.223.38:8081/api/working/worker/task?id=' + taskId;
    const thisdata = { 'id': taskId }
    putData(thisdata, url);

    weeklyFetchContracts();

    weeklyMakeEventListDiv();
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
    weeklyApplyDivMaxHeight();

    $('.weekly-contracts').attr('draggable', 'true');
    $('.weekly-contracts').removeClass('cursor-pointer');
    $('.weekly-contracts').css('cursor', 'grab');
    weeklyContractDraggable();
    weeklyDayClickable();

    $('#globalModal').modal('hide');

});

/// ADD HOLIDAY confirm
$('#globalModal').on('click', '#weeklyHolidayAddBtn', function (e) {
    e.preventDefault();
    // console.log('clickes');
    let dataDate = $(this).data('date');
    let worker_id = $(this).data('id');
    let url = 'http://210.99.223.38:8081/api/working/worker/holiday';
    const thisdata = {
        'date': dataDate,
        'userConstructorId': worker_id
    }
    postData(thisdata, url);
    

    weeklyMakeEventListDiv();
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
    weeklyApplyDivMaxHeight();

    $('.weekly-contracts').attr('draggable', 'true');
    $('.weekly-contracts').removeClass('cursor-pointer');
    $('.weekly-contracts').css('cursor', 'grab');
    weeklyContractDraggable();
    weeklyDayClickable();

    $('#globalModal').modal('hide');
});

// ADD TASK confirm
$('#globalModal').on('click', '#weeklyTaskAddBtn', function (e) {
    e.preventDefault();
    let ddate = $(this).data('date');
    let time = $(this).data('time');
    let workerid = $(this).data('worker-id');
    let contract = $(this).data('task-id');

    let url = 'http://210.99.223.38:8081/api/working/worker/task';
    const thisdata = {
        'id': contract,
        'userConstructorId': workerid,
        'estimateWorkDate': ddate,
        'estimateWorkTime': time
    }

    postData(thisdata, url);

    weeklyFetchContracts();

    weeklyMakeEventListDiv();
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'holiday');
    weeklyFetchDisplayWorkerEvents(year, yearWeekNum, 'task');
    weeklyApplyDivMaxHeight();

    $('.weekly-contracts').attr('draggable', 'true');
    $('.weekly-contracts').removeClass('cursor-pointer');
    $('.weekly-contracts').css('cursor', 'grab');
    weeklyContractDraggable();
    weeklyDayClickable();

    $('#globalModal').modal('hide');
});

// scroll on the weekly
let targetA = $("#weekly_calendar-body")[0];
$("#weekly_workers-body").scroll(function () {
    targetA.scrollTop = this.scrollTop;
});

let targetB = $("#weekly_workers-body")[0];
$("#weekly_calendar-body").scroll(function () {
    targetB.scrollTop = this.scrollTop;
});


/** END OF WEEKLY PROCESS */