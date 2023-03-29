let onconstructorListUrl = "http://210.99.223.38:8081/api/constructor/list";
let exhibitionUrl = 'http://210.99.223.38:8081/api/exhibition/list';

let exhibiDatas = [];
let thisExhibitionId;
let parentHeight, childHeight;

$.get(onconstructorListUrl).then(displayOnlineFairCompany);

function displayOnlineFairCompany(response) {
    let container = "ofSelectConstructorList";
    let template = "ofSelectConstructorListTemp";
    let list = response.data;
    $('#' + container).empty();
    // $('#' + container).append('<option value="all">All</option>');
    $('#' + container).append('<option value="전체">전체</option>');
    $.each(list, function (i, d) {
        const data = {
            'contructorId': d.constructorId,
            'contructorName': d.constructorName
        }
        mustacheTemplating(container, template, data);
    })
    
}

// fetch exhibitions
function fetchExhibition(pageSize) {
    // Get all the data from the API
    $.ajax({
        url: exhibitionUrl,
        success: function (response) {
            let result = response.data;
            console.log(result);
            exhibiDatas = [];

            // Divide the response.data into chunks based on the page size
            for (let i = 0; i < result.length; i += pageSize) {
                exhibiDatas.push(result.slice(i, i + pageSize));
            }

            // Initialize the pagination plugin
            $('#exhibitionListsPagination').bootpag({
                total: exhibiDatas.length,
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
            displayPage(exhibiDatas[0]);

            // console.log(exhibiDatas);
            // Listen for page changes
            $('#exhibitionListsPagination').on('page', function (event, num) {
                displayPage(exhibiDatas[num - 1]);
            });
        }
    });
}

// Display a page of data
function displayPage(pageData) {
    let html = '';

    pageData = pageData.map(function (d) {
        // Add or modify properties as necessary
        let startDateTime = d.startDateTime.split(' ');
        let endDateTime = d.endDateTime.split(' ');

        d.startDateTime = startDateTime[0].replaceAll('-', '.');
        d.endDateTime = endDateTime[0].replaceAll('-', '.');


        return d;
    });

    pageData.forEach(function (exhibition) {
        html += `<div class="exhiData">
                    <div class="exhiDataLeft">
                        <div class="exhiDataName" data-id="${exhibition.exhibitionId}">${exhibition.exhibitionName}</div>
                        <div class="exhiDataRange">${exhibition.startDateTime} - ${exhibition.endDateTime}</div>
                    </div>
                    <div class="exhiDataRight ${exhibition.isOfflineOn}">오프라인</div>
                </div>`;
    });


    $('#exhibitionListsData').html(html);  
}

// display participated exhibition
async function displayExhibitionBoards(id) {
    let url = `http://210.99.223.38:8081/api/exhibition/participate?exhibitionId=${id}`;
    let container = "exhibitionBoardListsCont";
    let template = "exhibitionBoardListsTemp";
    let list = getData(url).data;
    console.log(list);
    $('#ofSelectConstructorList').val(null);
    const novideo = './assets/img/images/no-video.jpg';

    $('#' + container).empty();
    await $.each(list, function (i, d) {
        let board = d.exhibitionBoard;
        let ytEmbedLink;
        if (board.videoLink) { ytEmbedLink = board.videoLink.replace('/watch?v=', '/embed/'); }
        const data = {
            "constructorId": board.constructorId,
            "exhibitionid": board.exhibitionId,
            "boardid": board.id,
            "constructorname": board.constructorName,
            "aboutus": board.constructorContent,
            "link": ytEmbedLink,
            "boolLink": board.videoLink,
            "hashtag": board.tag,
            "imgsrc": novideo,
        };
        mustacheTemplating(container, template, data);
        fetchBoardComments(board.id);

        let p = $('#profiletotag'+board.id).outerHeight();
        let b = $('#boardinputg'+board.id).outerHeight();
        let c = $('#commentsec'+board.id);
        let ch = 506 - p - b;
        c.css('max-height', ch);
        c.css('min-height', ch);
        // const h = {p, b, ch}
        // console.log(h);
    })
}

// fetch comments
async function fetchBoardComments(boardId) {
    let boardCommentsUrl = 'http://210.99.223.38:8081/api/exhibition/participate/comment?boardId=' + boardId;

    let container = "ofBoardCommentsCont" + boardId;
    let template = "ofBoardCommentsTemplate";
    let list = getData(boardCommentsUrl).data;


    // let commentCount = list.length;
    // displayCommentCount(commentCount, boardId);

    $('#' + container).empty();
    await $.each(list, function (i, d) {
        const data = {
            'boardId': boardId,
            'commentContent': d.comment,
            'commentGroupId': d.commentGroupId,
            'createAt': d.createAt,
            'hasCommentGroup': d.hasCommentGroup,
            'commentId': d.id,
            'commenterName': d.name,
            'sequence': d.sequence,
        }
        mustacheTemplating(container, template, data);
        // displayCommentReply(d.commentGroupId);
    })
}

async function displayCommentReply(cgId){
    let url = 'http://210.99.223.38:8081/api/exhibition/participate/comment/reply?commentGroupId=' + cgId;
    let container = 'ofBoardReplyCont'+cgId;
    let template = 'ofBoardReplyTemplate';
    let list = getData(url).data;
    
    $('#' + container).empty();
    await $.each(list, function (i, d) {
        const data = {
            'commentContent': d.comment,
            'commentGroupId': d.commentGroupId,
            'createAt': d.createAt,
            'hasCommentGroup': d.hasCommentGroup,
            'commentId': d.id,
            'commenterName': d.name,
            'sequence': d.sequence,
        }
        mustacheTemplating(container, template, data);
    });
}

// add comment
function boardAddComment(thisElem) {
    let url = 'http://210.99.223.38:8081/api/exhibition/participate/comment';
    let boardId = thisElem.getAttribute('data-board-id');
    var comment = $('#ofBoardInput'+boardId).val();
    console.log('addcomment');
    if(!comment) return;

    const data = {
        'boardId': boardId,
        'constructorId' : session,
        'comment': comment,
    }
    
    postData(data, url);
    $('#ofBoardInput' + boardId).val('');
    fetchBoardComments(boardId);
}

// make the comment input into reply input
function makeReplyComment(thisElem){
    let cgId = thisElem.getAttribute('data-cg-id');
    let boardId = thisElem.getAttribute('data-board-id');

    const input = $('#ofBoardInput'+boardId);
    const btn = $('#ofBoardBtn'+boardId);

    input.attr('placeholder', '답글달기'); // to translate add a reply
    btn.attr('data-cg-id', cgId);
    btn.attr('onclick', 'boardAddReply(this)');
}

// add reply
function boardAddReply(thisElem) {
    let cgId = thisElem.getAttribute('data-cg-id');
    let boardId = thisElem.getAttribute('data-board-id');
    // console.log('addreply');

    let url = 'http://210.99.223.38:8081/api/exhibition/participate/comment/reply';
    const input = $('#ofBoardInput' + boardId);
    const btn = $('#ofBoardBtn' + boardId);

    let reply = input.val();
    if(!reply) return;

    const data = {
        'boardId': boardId,
        'commentGroupId': cgId,
        'constructorId': session,
        'comment': reply,
    }

    postData(data, url);

    let replyDiv = $('#ofBoardReplyDiv' + cgId).length;
    let replyContainer = $('#ofBoardReplyCont' + cgId);

    if(replyDiv <= 0) {
        // console.log('this replyDiv');
        fetchBoardComments(boardId);
        let replyContainerNew = $('#ofBoardReplyCont' + cgId);
        if (replyContainerNew.hasClass('d-none')) {
            replyContainerNew.addClass('d-block').removeClass('d-none');
            displayCommentReply(cgId);
        }
    }
    else if (replyDiv > 0) {
        if (replyContainer.hasClass('d-none')) {
            replyContainer.addClass('d-block').removeClass('d-none');
            displayCommentReply(cgId);
        }
    }

    input.val(null);
    input.attr('placeholder', '댓글 추가');
    btn.removeAttr('data-cg-id');
    btn.attr('onclick', 'boardAddComment(this)');
}

// 
function displayReplies(thisElem) {
    let cgId = thisElem.getAttribute('data-cg-id');

    let replyContainer = $('#ofBoardReplyCont'+cgId);
    let replyCount = $('#ofBoardReplyCont'+cgId+' .reply').length;
    
    // toggle
    if(replyContainer.hasClass('d-none')) {
        replyContainer.addClass('d-block').removeClass('d-none');
        
        if (replyCount <= 0) {
            displayCommentReply(cgId);
        }
    }
    else if (replyContainer.hasClass('d-block')) {
        replyContainer.addClass('d-none').removeClass('d-block');
    }
}

// onload page
$('#onlinefair_btn').on('click', function () {
    if ($('#exhibitionBoardListSection').hasClass('d-block')) {
        $('#exhibitionBoardListSection').removeClass('d-block').addClass('d-none');
        $('#exhibitionListSection').removeClass('d-none').addClass('d-block');
    }

    let windowHeight = $(window).height();
    parentHeight = windowHeight - 278;
    childHeight = 50;
    const pageSize = Math.floor(parentHeight / childHeight);
    fetchExhibition(pageSize);
});

// search in firstpage
$('#searchExhiBtn').on('click', function () {
    let sValue = $('#searchExhiName').val().toLowerCase();
    const pageSize = Math.floor(parentHeight / childHeight);
    let allExhibiDatas = getData(exhibitionUrl).data;
    
    console.log(allExhibiDatas);

    // search input empty
    if (!sValue) { fetchExhibition(pageSize) }

    else {
        const filteredData = allExhibiDatas.filter((obj) => {
            return obj.exhibitionName?.toLowerCase().includes(sValue);
        });
    
        exhibiDatas = [];
    
        // make new array of exhibiDatas to display
        for (let i = 0; i < filteredData.length; i += pageSize) {
            exhibiDatas.push(filteredData.slice(i, i + pageSize));
        }
    
        // Initialize the pagination plugin
        $('#exhibitionListsPagination').bootpag({
            total: exhibiDatas.length,
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
        displayPage(exhibiDatas[0]);
    
        // Listen for page changes
        $('#exhibitionListsPagination').on('page', function (event, num) {
            displayPage(exhibiDatas[num - 1]);
        });
    }
})

// button to view the exhibition boards
$('#exhibitionListsData ').on('click', '.exhiDataName', function () {
    $('#exhibitionListSection').addClass('d-none').removeClass('d-block');
    $('#exhibitionBoardListSection').addClass('d-block').removeClass('d-none');
    thisExhibitionId = $(this).data('id');
    displayExhibitionBoards(thisExhibitionId);
});

// back button
$('#exhibiBackBtn').on('click', function() {
    $('#exhibitionBoardListSection').addClass('d-none').removeClass('d-block');
    $('#exhibitionListSection').addClass('d-block').removeClass('d-none');
})

// select option filter
$('#ofSelectConstructorList').on('change', function() {
    let cId = $(this).val();

    let targetDiv = $('.exbDiv'+cId);
    let tL = targetDiv.length;
    console.log(tL);
    console.log(cId);

    if (cId === 'all' || cId ==='전체') {
        $('.exbDiv').removeClass('d-none');
    } else {
        if(targetDiv.hasClass('d-none')) {
            targetDiv.removeClass('d-none');
        }
    
        $('.exbDiv').not(targetDiv).addClass('d-none');
    }

})


/** SELECT2 OPTIONS */
// online fair participated select
$('#ofSelectConstructorList').select2({
    theme: 'bootstrap-5',
    width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    placeholder: $(this).data('placeholder'),
});
