let dailyDate = new Date();

const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

const parentDiv = document.querySelector('#daily_date-column');

const currentDiv = document.querySelector('#daily_date_currColumn');
const prevDiv = document.querySelector('#daily_date_prevColumn');
const nextDiv = document.querySelector('#daily_date_nextColumn');


const parentDivJquery = $('#daily_date-column');
const currentDivJquery = $('#daily_date_currColumn');
const prevDivJquery = $('#daily_date_prevColumn');
const nextDivJquery = $('#daily_date_nextColumn');

// let targetFirst = '#daily_date_currColumn .daily_date-column-legend.currFirstDay';
// let targetLast = '#daily_date_currColumn .daily_date-column-legend.currLastDay';

let fetchedDates; // the elements being fetched
let dailyDataDate; // data date of current div
let dataDate; // SPECIFIC DATA DATE ON CLICK
let initialPosX; // starting position of the parent div at loading the page.
let targetPosX; // target position width
let startX; // horizontal coordinate of the mouse pointer
let divWidthCurr, divWidthPrev, divWidthNext; // total width of the fetchedDates
// let visibleWidth = parentDiv.scrollLeft // total visible div's width
let totalWidth;  // = parentDiv.scrollWidth; // total width of div including the hidden elements

function dailyFetchDisplayWorkerTasks (url) {
    $('.event-lists').empty();
    let eventList = '';
    $.ajax({
        url: url,
        async: false,
        dataType: "json",
        success: function (results) {
            for (let i = 0; i < results.data.length; i++) {
                let userConstructorName = results.data[i].userConstructorName;

                let estimateWorkTime = results.data[i].estimateWorkTime;
                let wprocess = results.data[i].process;

                let tt = estimateWorkTime.split(':');
                
                let tV = 'tt' + tt[0];
                $('.event-lists').map(function () {
                    if (tV === $(this).data('time')) {
                        eventList = `<div class="event alert alert-primary py-1 text-center me-2">` +
                                        `<span class="fw-bold">${userConstructorName}</span> <br/>` +
                                        `<span>${wprocess}</span> <br/>` +
                                    `</div>`;

                        $(this).append(eventList);
                    }
                });
            }
        }
    });
}

function dailyFetchDisplayWorkerHolidays(url) {
    $('#event-holiday').empty();
    let eventList = '';
    $.ajax({
        url: url,
        async: false,
        dataType: "json",
        success: function (results) {
            for (let i = 0; i < results.data.length; i++) {
                let userConstructorName = results.data[i].name;
                eventList = `<div class="event alert alert-danger py-1 text-center me-2">` +
                                    `<span class="fw-bold">${userConstructorName}</span> <br/>` +
                                    `<span>휴무</span> <br/> </div>`;
                $('#event-holiday').append(eventList);
            }
        }
    });
}


function dailyRenderCalendar(identifier) {
    day = dailyDate.getDate();
    month = dailyDate.getMonth();
    year = dailyDate.getFullYear();

    dailyDate.setDate(1);
    const lastDateOfCurrMonth = new Date(year, month + 1, 0).getDate();

    if (identifier === 'curr') {
        fetchedDates = document.querySelector('#daily_date_currColumn');
    } else if (identifier === 'prev') {
        fetchedDates = document.querySelector('#daily_date_prevColumn');
    } else if (identifier === 'next') {
        fetchedDates = document.querySelector('#daily_date_nextColumn');
    }

    let days = '';

    // GET THE DATES OF THE CURRENT MONTH
    for (let i = 1; i <= lastDateOfCurrMonth; i++) {
        let currmonth = month + 1;
        var stringcurrmonth = stringMonthDate(currmonth);
        var stringdate = stringMonthDate(i);

        let daily = year + '-' + stringcurrmonth + '-' + stringdate;
        let newDailyDate = new Date(daily);
        let weekDayEq = newDailyDate.getDay();


        if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
            if (i === 1) {
                days += `<div class="daily_date-column-legend active ${identifier}FirstDay" data-date="${daily}"><div class="weekday">${weekdays[weekDayEq]}</div> <div class="weekdate">${stringdate}</div> </div>`;
            } else if (lastDateOfCurrMonth === i) {
                days += `<div class="daily_date-column-legend active ${identifier}LastDay" data-date="${daily}"><div class="weekday">${weekdays[weekDayEq]}</div> <div class="weekdate">${stringdate}</div> </div>`;
            }
            else {
                days += `<div class="daily_date-column-legend active" data-date="${daily}"><div class="weekday">${weekdays[weekDayEq]}</div> <div class="weekdate">${stringdate}</div> </div>`;
            }
        } 
        else {
            if (i === 1) {
                days += `<div class="daily_date-column-legend ${identifier}FirstDay" data-date="${daily}"><div class="weekday">${weekdays[weekDayEq]}</div> <div class="weekdate">${stringdate}</div> </div>`;
            } else if (lastDateOfCurrMonth === i) {
                days += `<div class="daily_date-column-legend ${identifier}LastDay" data-date="${daily}"><div class="weekday">${weekdays[weekDayEq]}</div> <div class="weekdate">${stringdate}</div> </div>`;
            } else {
                days += `<div class="daily_date-column-legend" data-date="${daily}"><div class="weekday">${weekdays[weekDayEq]}</div> <div class="weekdate">${stringdate}</div> </div>`;
            }
        }
    }

    fetchedDates.innerHTML = days;
}

function autoScrollToday() {
    var $scrollableDiv = $('#daily_date-column');
    var $targetChild = $('.daily_date-column-legend.active', $scrollableDiv);
    if ($targetChild.length) {
        targetPosX = $targetChild.position().left;
        initialPosX = targetPosX - 24;
        $scrollableDiv.animate({
            scrollLeft: initialPosX,
        }, 200);
    }
}

function autoScrollToCurrentPosX(identifier, div) {
    var $scrollableDiv = $('#daily_date-column');
    var $targetChild = $(identifier);

    if (div === 'prev') {
        targetPosX = $targetChild.position().left;
        initialPosX = targetPosX - 24;
        $scrollableDiv.animate({
            scrollLeft: initialPosX,
        }, 0);
    }
    else if (div === 'next') {
        targetPosX = divWidthPrev + divWidthCurr - parentDivJquery.outerWidth() + $targetChild.outerWidth() + 16;
        initialPosX = targetPosX;
        $scrollableDiv.animate({
            scrollLeft: initialPosX,
        }, 0);
    }
}

function dailyDisplayWorkerEvents() {
    let thisActive = $('#daily_date-column ').find('.active').data('date');

    const dd = thisActive.split('-');
    const thisyear = dd[0];
    const thismonth = dd[1];
    const thisday = dd[2];

    let dailyTitle = `${thisyear}년 ${thismonth}월 ${thisday}일`;
    $('#daily_title').text(dailyTitle);

    let holidayUrl = `http://210.99.223.38:8081/api/working/worker/holiday/list?year=${thisyear}&month=${thismonth}&day=${thisday}&constructorId=${auths.id}`;


    let taskUrl = `http://210.99.223.38:8081/api/working/worker/task/list?year=${thisyear}&month=${thismonth}&day=${thisday}&constructorId=${auths.id}`;

    dailyFetchDisplayWorkerHolidays(holidayUrl);
    dailyFetchDisplayWorkerTasks(taskUrl);
}

/** START OF PARENT DIV EVENT LISTENER */
function dailyMouseDown(thisElem) {
    // $(this).addClass('cursor-grab').removeClass('cursor-grabbing');
    thisElem.addEventListener('mousemove', dailyMouseMove);
}

function dailyMouseUp(thisElem) {
    // $(this).addClass('cursor-grab').removeClass('cursor-grabbing');
    thisElem.removeEventListener('mousemove', dailyMouseMove);
}

function dailyMouseMove(e) {
    deltaX = startX - e.pageX;
    parentDiv.scrollLeft += deltaX;

    if (parentDiv.scrollLeft === 0) {
        console.log('im at ZERO')
        startX = e.pageX;
        parentDiv.removeEventListener('mousemove', dailyMouseMove);

        nextDivJquery.empty();

        // transfer all child from current div to next div
        while (currentDiv.firstChild) {
            nextDiv.appendChild(currentDiv.firstChild);
        }
        nextDivJquery.find('.currFirstDay').addClass('nextFirstDay').removeClass('currFirstDay');
        nextDivJquery.find('.currLastDay').addClass('nextLastDay').removeClass('currLastDay');

        // transfer all child from previous div to current div
        while (prevDiv.firstChild) {
            currentDiv.appendChild(prevDiv.firstChild);
        }
        currentDivJquery.find('.prevFirstDay').addClass('currFirstDay').removeClass('prevFirstDay');
        currentDivJquery.find('.prevLastDay').addClass('currLastDay').removeClass('prevLastDay');

        dailyDataDate = $('#daily_date_currColumn .currFirstDay').data('date');
        dailyDate = new Date(dailyDataDate)
        dailyDate.setMonth(dailyDate.getMonth() - 1);
        dailyRenderCalendar('prev');

        let targetFirst = '#daily_date_currColumn .daily_date-column-legend.currFirstDay';
        let targetLast = '#daily_date_currColumn .daily_date-column-legend.currLastDay';

        divWidthPrev = prevDiv.offsetWidth;
        divWidthCurr = currentDiv.offsetWidth;
        divWidthNext = nextDiv.offsetWidth;

        parentDiv.scrollWidth = divWidthPrev + divWidthCurr + divWidthNext;
        autoScrollToCurrentPosX(targetFirst, 'prev');
    }
  
    else if (parentDiv.scrollLeft + parentDiv.clientWidth >= parentDiv.scrollWidth - 1) {
        console.log('im at END');
        parentDiv.removeEventListener('mousemove', dailyMouseMove);

        prevDivJquery.empty();

        // transfer all child from current div to previous div
        while (currentDiv.firstChild) {
            prevDiv.appendChild(currentDiv.firstChild);
        }
        prevDivJquery.find('.currFirstDay').addClass('prevFirstDay').removeClass('currFirstDay');
        prevDivJquery.find('.currLastDay').addClass('prevLastDay').removeClass('currLastDay');


        // transfer all child from next div to current div
        while (nextDiv.firstChild) {
            currentDiv.appendChild(nextDiv.firstChild);
        }
        currentDivJquery.find('.nextFirstDay').addClass('currFirstDay').removeClass('nextFirstDay');
        currentDivJquery.find('.nextLastDay').addClass('currLastDay').removeClass('nextLastDay');

        // get the data date of the newly child of the div
        dailyDataDate = $('#daily_date_currColumn .currFirstDay').data('date');

        // console.log(dailyDataDate)
        dailyDate = new Date(dailyDataDate)
        dailyDate.setMonth(dailyDate.getMonth() + 1);
        dailyRenderCalendar('next');

        let targetFirst = '#daily_date_currColumn .daily_date-column-legend.currFirstDay';
        let targetLast = '#daily_date_currColumn .daily_date-column-legend.currLastDay';

        divWidthPrev = prevDiv.offsetWidth;
        divWidthCurr = currentDiv.offsetWidth;
        divWidthNext = nextDiv.offsetWidth;

        parentDiv.scrollWidth = divWidthPrev + divWidthCurr + divWidthNext;
        autoScrollToCurrentPosX(targetLast, 'next');
    }
}


$(document).ready(function () {
    dailyRenderCalendar('curr');
    dailyDisplayWorkerEvents();
    
    // fetch prev month
    dailyDataDate = $('#daily_date_currColumn .currFirstDay').data('date');
    dailyDate = new Date(dailyDataDate)
    dailyDate.setMonth(dailyDate.getMonth() - 1);
    dailyRenderCalendar('prev');
    
    // fetch next month
    dailyDataDate = $('#daily_date_currColumn .currFirstDay').data('date');
    dailyDate = new Date(dailyDataDate)
    dailyDate.setMonth(dailyDate.getMonth() + 1);
    dailyRenderCalendar('next');
    
    autoScrollToday();
});

$('#daily_date-column').on('mouseover', function (e) {
    startX = e.pageX;
    $(this).css('cursor', 'pointer');
    // $(this).addClass('cursor-grab').removeClass('cursor-grabbing');
    $(this).attr('onmousedown', 'dailyMouseDown(this)');
    $(this).attr('onmouseup', 'dailyMouseUp(this)');
});

$('#daily_date-column').on('mouseleave', function (e) {
    $(this).css('cursor', 'default');
    // $(this).addClass('cursor-default').removeClass('cursor-grab');
    parentDiv.removeEventListener('mousemove', dailyMouseMove);

    $(this).attr('onmousedown', '');
    $(this).attr('onmouseup', '');
});

/** END OF PARENT DIV EVENT LISTENER */


$('#daily_date-column ').on('mouseenter', '.daily_date-column-legend', function (e) {
    $(this).css('cursor', 'pointer');
})

$('#daily_date-column ').on('click', '.daily_date-column-legend', function (e) {
    dataDate = $(this).data('date');
    $('#daily_date-column ').find('.active').removeClass('active');
    $(this).addClass('active');

    dailyDisplayWorkerEvents();
})