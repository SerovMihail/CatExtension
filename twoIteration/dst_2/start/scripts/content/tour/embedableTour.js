const htmlMarkup =
    `<ul class="cd-tour-wrapper">
        <li class="cd-single-step">

            <div class="cd-more-info bottom">

                <div class="arrow"></div>

                <p style="text-align: center; overflow-wrap: break-word;">
                    Click "save changes" for the extension to work correctly.
                </p>

                <button class="btn btn-custom cd-ok">Ok</button>
            </div>
        </li>
    </ul>

    <div class="cd-app-screen"></div>
    <div class="cd-cover-layer"></div>`;

var css = `#tour_container img {
    height: 100%;
    width: auto;
    max-width: 296px;
    max-height: 320px;
}

#tour_container .third img {
    max-height: 210px;
    max-width: 100%;
}

.cd-nugget-info {
    position: absolute;
    width: 60%;
    left: 50%;
    top: 50%;
    bottom: auto;
    right: auto;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    -o-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
    text-align: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.cd-nugget-info h1 {
    color: #fefffb;
    font-size: 2.4rem;
    margin: .6em 0;
}

.cd-nugget-info .cd-btn {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
    border: none;
    border-radius: 50em;
    background: #ff962c;
    padding: 1em 2em;
    color: #fefffb;
    font-weight: bold;
    font-size: 1.4rem;
    cursor: pointer;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.cd-nugget-info .cd-btn:active {
    -webkit-transform: scale(0.9);
    -moz-transform: scale(0.9);
    -ms-transform: scale(0.9);
    -o-transform: scale(0.9);
    transform: scale(0.9);
}

.no-touch .cd-nugget-info .cd-btn:hover,
.cd-nugget-info .cd-btn:focus {
    outline: none;
    background: #ffa346;
}

.cd-nugget-info h1 {
    font-size: 4.2rem;
    font-weight: 300;
}

.cd-nugget-info .cd-btn {
    font-size: 1.6rem;
}

/* --------------------------------  Main Components  -------------------------------- */

.cd-tour-wrapper {
    list-style: none;
    position: fixed;
    z-index: 2;
    height: 90%;
    width: 90%;
    left: 50%;
    top: 50%;
    bottom: auto;
    right: auto;
    -webkit-transform: translateX(-50%) translateY(-50%);
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    -o-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    visibility: hidden;
    opacity: 0;
    -webkit-transition: opacity 0.4s 0s, visibility 0s 0.4s;
    -moz-transition: opacity 0.4s 0s, visibility 0s 0.4s;
    transition: opacity 0.4s 0s, visibility 0s 0.4s;
}

.cd-tour-wrapper::before {
    /* never visible - this is used in jQuery to check the current MQ */
    display: none;
    content: 'mobile';
}

.cd-tour-wrapper.active {
    /* start tour */
    visibility: visible;
    opacity: 1;
    -webkit-transition: opacity 0.4s 0s, visibility 0s 0s;
    -moz-transition: opacity 0.4s 0s, visibility 0s 0s;
    transition: opacity 0.4s 0s, visibility 0s 0s;
    background: #212529c9;
    z-index: 9999999;
}

.cd-tour-wrapper {
    min-width: 100%;
    min-height: 100%;
}

.cd-tour-wrapper {
    /* reset style */
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    max-width: none;
    max-height: none;
    opacity: 1;
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
}

.cd-tour-wrapper::before {
    /* never visible - this is used in jQuery to check the current MQ */
    content: 'desktop';
}

.cd-tour-wrapper.active {
    /* visibility: hidden; */
}

.cd-single-step {
    /* tour single step */
    position: absolute;
    z-index: 1;
    width: 100%;
    left: 0;
    top: 0;
    background-color: #fefffb;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    /* Force Hardware Acceleration */
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
    -webkit-transition: -webkit-transform 0.4s 0s, opacity 0s 0.4s;
    -moz-transition: -moz-transform 0.4s 0s, opacity 0s 0.4s;
    transition: transform 0.4s 0s, opacity 0s 0.4s;
}

.cd-single-step>span {
    /* dot indicator - visible on desktop version only */
    position: relative;
    z-index: 1;
    display: block;
    width: 10px;
    height: 10px;
    border-radius: inherit;
    background: #ff962c;
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
    -ms-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
    -webkit-transition: -webkit-transform 0.4s;
    -moz-transition: -moz-transform 0.4s;
    transition: transform 0.4s;
    /* replace text with background images */
    overflow: hidden;
    text-indent: 100%;
    white-space: nowrap;
    /* hide on mobile */
    display: none;
}

.cd-single-step::after {
    /* this is used to create the pulse animation */
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: inherit;
    /* Force Hardware Acceleration */
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    /* hide on mobile */
    display: none;
}

.active .cd-single-step {
    /* tour started */
    -webkit-transform: scale(1) translateX(100%);
    -moz-transform: scale(1) translateX(100%);
    -ms-transform: scale(1) translateX(100%);
    -o-transform: scale(1) translateX(100%);
    transform: scale(1) translateX(100%);
    -webkit-transition: -webkit-transform 0.4s 0s, opacity 0.4s 0s;
    -moz-transition: -moz-transform 0.4s 0s, opacity 0.4s 0s;
    transition: transform 0.4s 0s, opacity 0.4s 0s;
}

.active .cd-single-step.move-left {
    -webkit-transform: scale(1) translateX(-100%);
    -moz-transform: scale(1) translateX(-100%);
    -ms-transform: scale(1) translateX(-100%);
    -o-transform: scale(1) translateX(-100%);
    transform: scale(1) translateX(-100%);
}

.active .cd-single-step.is-selected {
    /* visible step */
    position: relative;
    opacity: 1;
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
    -webkit-transition: -webkit-transform 0.4s 0s;
    -moz-transition: -moz-transform 0.4s 0s;
    transition: transform 0.4s 0s;
}

.cd-single-step {
    /* reset style */
    height: auto;
    width: auto;
    top: auto;
    left: auto;
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
    border-radius: 50%;
    visibility: hidden;
    opacity: 1;
    background-color: transparent;
    box-shadow: none;
    -webkit-transition: visibility 0s 0.4s;
    -moz-transition: visibility 0s 0.4s;
    transition: visibility 0s 0.4s;
}

/* .cd-single-step.first {
        top: 0;
        right: 0;
    }

    .cd-single-step.second {
        bottom: 50%;
        right: 48%;
    }

    .cd-single-step.third {
        left: 10%;
        top: 43px;
    } */

.cd-single-step>span,
.cd-single-step::after {
    display: none;
}

.active .cd-single-step,
.active .cd-single-step.move-left {
    -webkit-transition: visibility 0s 0.4s;
    -moz-transition: visibility 0s 0.4s;
    transition: visibility 0s 0.4s;
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
}

.cd-single-step.is-selected {
    visibility: visible;
    -webkit-transition: visibility 0s 0s;
    -moz-transition: visibility 0s 0s;
    transition: visibility 0s 0s;
}

.cd-single-step.is-selected>span {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
}

.cd-single-step.is-selected::after {
    -webkit-animation: cd-pulse 2s infinite;
    -moz-animation: cd-pulse 2s infinite;
    animation: cd-pulse 2s infinite;
    -webkit-animation-delay: 0.5s;
    -moz-animation-delay: 0.5s;
    animation-delay: 0.5s;
}

.cd-single-step.is-selected .cd-more-info {
    opacity: 1;
}

@-webkit-keyframes cd-pulse {
    0% {
        box-shadow: 0 0 0 0 #ff962c;
    }
    100% {
        box-shadow: 0 0 0 20px rgba(255, 150, 44, 0);
    }
}

@-moz-keyframes cd-pulse {
    0% {
        box-shadow: 0 0 0 0 #ff962c;
    }
    100% {
        box-shadow: 0 0 0 20px rgba(255, 150, 44, 0);
    }
}

@keyframes cd-pulse {
    0% {
        box-shadow: 0 0 0 0 #ff962c;
    }
    100% {
        box-shadow: 0 0 0 20px rgba(255, 150, 44, 0);
    }
}

.cd-single-step .cd-more-info {
    z-index: 1;
    padding: 1.5em;
    width: 100%;
}

.cd-single-step .cd-more-info::after {
    clear: both;
    content: "";
    display: table;
}

.cd-single-step .cd-more-info::before {
    /* triangle next to the step description - hidden on mobile */
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    border: 6px solid transparent;
    display: none;
}

.cd-single-step .cd-more-info h2 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: .4em;
}

.cd-single-step .cd-more-info p {
    font-size: 1rem;
    margin-bottom: 1.4em;
    color: #7f7f7d;
    text-align: left;
}

.cd-single-step .cd-more-info img {
    margin-bottom: 1.4em;
}

.cd-single-step .cd-more-info .cd-close {
    /* 'X' icon to skip the tour */
    position: absolute;
    top: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    /* replace text with background images */
    overflow: hidden;
    text-indent: 100%;
    white-space: nowrap;
}

.cd-single-step .cd-more-info .cd-close::after,
.cd-single-step .cd-more-info .cd-close:before {
    /* these are the 2 lines of the 'X' icon */
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    height: 2px;
    width: 16px;
    border-radius: 4em;
    background-color: #cbccc8;
    /* Force Hardware Acceleration */
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.cd-single-step .cd-more-info .cd-close::after {
    -webkit-transform: translateX(-50%) translateY(-50%) rotate(45deg);
    -moz-transform: translateX(-50%) translateY(-50%) rotate(45deg);
    -ms-transform: translateX(-50%) translateY(-50%) rotate(45deg);
    -o-transform: translateX(-50%) translateY(-50%) rotate(45deg);
    transform: translateX(-50%) translateY(-50%) rotate(45deg);
}

.cd-single-step .cd-more-info .cd-close::before {
    -webkit-transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    -moz-transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    -ms-transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    -o-transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    transform: translateX(-50%) translateY(-50%) rotate(-45deg);
}

.cd-single-step .cd-more-info span {
    /* step count e.g. 1 of 3*/
    float: left;
    padding-top: .1em;
    font-size: 1rem;
    /* font-family: Georgia, serif; */
}

.cd-single-step .cd-more-info {
    position: absolute;
    width: 340px;
    /* top: 20%; */
    border-radius: 4px;
    box-shadow: 0 3px 20px rgba(0, 0, 0, 0.15);
    opacity: 0;
    background-color: #fefffb;
    border-color: #fefffb;
}

.cd-single-step .cd-more-info p {
    margin-bottom: 15px;
}

.cd-single-step .cd-more-info img {
    /* display: none; */
    /* margin-left: 20px; */
}

.cd-single-step .cd-more-info::before {
    /* triangle next to the step description - hidden on mobile */
    display: none;
}

.cd-single-step .cd-more-info.left {
    right: calc(100% + 15px);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
}

.cd-single-step .cd-more-info.right {
    left: calc(100% + 15px);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
}

.cd-single-step .cd-more-info.left,
.cd-single-step .cd-more-info.right {
    top: 50%;
}

.cd-single-step .cd-more-info.top {
    bottom: calc(100% + 15px);
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
}

.cd-single-step .cd-more-info.bottom {
    top: calc(100% + 145px);
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
}

.cd-single-step .cd-more-info.top,
.cd-single-step .cd-more-info.bottom {
    left: 89%;
    /* top: 0%; */
}

.cd-single-step .cd-more-info.left::before,
.cd-single-step .cd-more-info.right::before {
    top: 50%;
    bottom: auto;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
}

.cd-single-step .cd-more-info.top::before,
.cd-single-step .cd-more-info.bottom::before {
    left: 50%;
    right: auto;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
}

/* .cd-more-info.bottom.first::before {
        left: 93%;
    }

    .cd-single-step .cd-more-info.left::before {
        border-left-color: inherit;
        left: 100%;
    }

    .cd-single-step .cd-more-info.right::before {
        border-right-color: inherit;
        right: 100%;
    }

    .cd-single-step .cd-more-info.top::before {
        border-top-color: inherit;
        top: 100%;
    }

    .cd-single-step .cd-more-info.bottom::before {
        border-bottom-color: inherit;
        bottom: 100%;
    } */

.is-selected .cd-single-step .cd-more-info {
    opacity: 1;
}

.cd-tour-nav {
    float: right;
}

.cd-tour-nav::after {
    clear: both;
    content: "";
    display: table;
}

.cd-tour-nav li {
    display: inline-block;
    float: left;
}

.cd-tour-nav li:first-of-type {
    margin-right: 1.5em;
}

.cd-tour-nav a {
    font-size: 1rem;
    color: #222d33;
}

.cd-tour-nav a.inactive {
    /* item not clickable */
    color: #cbccc8;
    cursor: not-allowed;
}

.cd-cover-layer {
    /* background cover layer - visible when tour is activated */
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    visibility: hidden;
    opacity: 0;
    -webkit-transition: opacity 0.4s 0s, visibility 0s 0.4s;
    -moz-transition: opacity 0.4s 0s, visibility 0s 0.4s;
    transition: opacity 0.4s 0s, visibility 0s 0.4s;
}

.cd-cover-layer.is-visible {
    opacity: 1;
    visibility: visible;
    -webkit-transition: opacity 0.4s 0s, visibility 0s 0s;
    -moz-transition: opacity 0.4s 0s, visibility 0s 0s;
    transition: opacity 0.4s 0s, visibility 0s 0s;
}

.cd-cover-layer.is-visible {
    opacity: 0;
    -webkit-animation: cd-fade-in 2.1s;
    -moz-animation: cd-fade-in 2.1s;
    animation: cd-fade-in 2.1s;
}

@-webkit-keyframes cd-fade-in {
    0%,
    100% {
        opacity: 0;
    }
    14%,
    40% {
        opacity: 1;
    }
}

@-moz-keyframes cd-fade-in {
    0%,
    100% {
        opacity: 0;
    }
    14%,
    40% {
        opacity: 1;
    }
}

@keyframes cd-fade-in {
    0%,
    100% {
        opacity: 0;
    }
    14%,
    40% {
        opacity: 1;
    }
}

/* --------------------------------  xapp prototype - no need to import this in production  -------------------------------- */

.cd-app-screen {
    position: absolute;
    /* left: 50%; */
    /* top: 50%; */
    /* bottom: auto; */
    /* right: auto; */
    /* -webkit-transform: translateX(-50%) translateY(-50%); */
    -moz-transform: translateX(-50%) translateY(-50%);
    -ms-transform: translateX(-50%) translateY(-50%);
    -o-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    width: 90%;
    height: 80%;
    /* background: #222d33; */
    /* border-radius: 4px; */
    /* box-shadow: 0 10px 60px #08151d; */
}

.cd-app-screen::before,
.cd-app-screen::after {
    content: '';
    position: absolute;
}

.cd-app-screen::before {
    top: 0;
    left: 0;
    height: 40px;
    width: 100%;
    background: #fefffb;
    border-radius: 4px 4px 0 0;
}

.cd-app-screen::after {
    top: 14px;
    left: 20px;
    height: 12px;
    width: 60px;
    background: #e4e5e1;
    border-radius: 3px;
}

.cd-single-step.is-selected.first::after,
.cd-single-step.is-selected.first span {
    left: 145px;
}

.cd-single-step.first {
    top: 52px;
}

.cd-single-step .cd-more-info.top,
.cd-single-step .cd-more-info.bottom {
    text-align: center;
}

step.is-selected.first span,
.cd-single-step.is-selected.first::after,
.cd-single-step.is-selected.first span {
    left: 96px;
}

.cd-single-step .cd-more-info {
    padding: 15px;
}

.cd-single-step .cd-more-info p {
    margin-bottom: 15px;
}

.cd-more-info {
    width: 280px !important;
}

.cd-more-info.first {
    left: 87% !important;
}

.cd-single-step .cd-more-info p {
    line-height: 1.3;
    font-size: 15px;
}

.arrow {
    background-image: url(${chrome.extension.getURL("/start/static/icons/main/arrow.png")});
    width: 170px;
    height: 160px;
    background-size: contain;
    background-repeat: no-repeat;
    margin: 0 auto;
    animation: MoveUpDown 1s linear infinite;
    position: relative;
    left: 0;
    bottom: 0;
}

.btn-custom {
    width: 100px;
    height: 30px;
    background: grey;
    border: 0;
    color: white;
    cursor: pointer;
}

@keyframes MoveUpDown {

    0%,
    100% {
        bottom: 0;
    }

    50% {
        bottom: -50px;
    }
}`,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
style.appendChild(document.createTextNode(css));

head.appendChild(style);

$('body').prepend('<div id="tour_container"></div>');
$("#tour_container").append(htmlMarkup);
initTour();

function initTour() {
    var tourWrapper = $('.cd-tour-wrapper'),
        tourSteps = tourWrapper.children('li'),
        stepsNumber = tourSteps.length,
        coverLayer = $('.cd-cover-layer'),
        tourStepInfo = $('.cd-more-info');
    $('body').addClass('disable-scroll')
    //create the navigation for each step of the tour
    createNavigation(tourSteps, stepsNumber);

    //start tour
    if (!tourWrapper.hasClass('active')) {
        //in that case, the tour has not been started yet
        tourWrapper.addClass('active');
        showStep(tourSteps.eq(0), coverLayer);
    }

    // change visible step
    tourStepInfo.on('click', '.cd-prev', function (event) {
        //go to prev step - if available
        (!$(event.target).hasClass('inactive')) && changeStep(tourSteps, coverLayer, 'prev');
    });
    tourStepInfo.on('click', '.cd-next', function (event) {
        //go to next step - if available
        (!$(event.target).hasClass('inactive')) && changeStep(tourSteps, coverLayer, 'next');
    });

    //close tour
    tourStepInfo.on('click', '.cd-close', function (event) {
        closeTour(tourSteps, tourWrapper, coverLayer);
        localStorage.setItem('tour_shown', false);
    });

    tourStepInfo.on('click', '.cd-ok', function (event) {
        closeTour(tourSteps, tourWrapper, coverLayer);
        localStorage.setItem('tour_shown', false);
    });

    // // //detect swipe event on mobile - change visible step
    // tourStepInfo.on('swiperight', function (event) {
    //     //go to prev step - if available
    //     if (!$(this).find('.cd-prev').hasClass('inactive') && viewportSize() == 'mobile') changeStep(tourSteps, coverLayer, 'prev');
    // });
    // tourStepInfo.on('swipeleft', function (event) {
    //     //go to next step - if available
    //     if (!$(this).find('.cd-next').hasClass('inactive') && viewportSize() == 'mobile') changeStep(tourSteps, coverLayer, 'next');
    // });

    //keyboard navigation
    $(document).keyup(function (event) {
        // if (event.which == '37' && !tourSteps.filter('.is-selected').find('.cd-prev').hasClass('inactive')) {
        //     changeStep(tourSteps, coverLayer, 'prev');
        // } else if (event.which == '39' && !tourSteps.filter('.is-selected').find('.cd-next').hasClass('inactive')) {
        //     changeStep(tourSteps, coverLayer, 'next');
        // } else 
        if (event.which == '27') {
            closeTour(tourSteps, tourWrapper, coverLayer);
        }
    });

    $(document).on('click', '.cd-tour-wrapper.active', function (e) {
        if ($(e.target).hasClass('cd-tour-wrapper')) {
            closeTour(tourSteps, tourWrapper, coverLayer);
            localStorage.setItem('tour_shown', false);
        }
    });
}

function createNavigation(steps, n) {
    // var tourNavigationHtml = '<div class="cd-nav"><span><b class="cd-actual-step">1</b> of ' + n + '</span><ul class="cd-tour-nav"><li><a href="#0" class="cd-prev">&#171; Previous</a></li><li><a href="#0" class="cd-next"></a></li></ul></div><a href="#0" class="cd-close">Close</a>';
    var tourNavigationHtml = '<a href="#0" class="cd-close">Close</a>';

    steps.each(function (index) {
        var step = $(this),
            stepNumber = index + 1,
            next_text = (stepNumber < n) ? 'Next' : 'Finish',
            prevClass = (stepNumber == 1) ? 'inactive' : '';
        var nav = $(tourNavigationHtml).find('.cd-next').html(next_text + ' &#187;').end().find('.cd-prev').addClass(prevClass).end().find('.cd-actual-step').html(stepNumber).end().appendTo(step.children('.cd-more-info'));
    });
}

function showStep(step, layer) {
    step.addClass('is-selected').removeClass('move-left');
    smoothScroll(step.children('.cd-more-info'));
    showLayer(layer);
}

function smoothScroll(element) {
    (element.offset().top < $(window).scrollTop()) && $('body,html').animate({ 'scrollTop': element.offset().top }, 100);
    (element.offset().top + element.height() > $(window).scrollTop() + $(window).height()) && $('body,html').animate({ 'scrollTop': element.offset().top + element.height() - $(window).height() }, 100);
}

function showLayer(layer) {
    layer.addClass('is-visible').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
        layer.removeClass('is-visible');
    });
}

function changeStep(steps, layer, bool) {
    var visibleStep = steps.filter('.is-selected'),
        delay = (viewportSize() == 'desktop') ? 300 : 0;
    visibleStep.removeClass('is-selected');

    (bool == 'next') && visibleStep.addClass('move-left');

    setTimeout(function () {
        if (bool == 'next') {
            if (visibleStep.next().length == 0) {
                closeTour(tourSteps, tourWrapper, coverLayer);
            } else {
                /* if(visibleStep.next().index() == 2) $('.cd-panel').addClass('is-visible'); */
                showStep(visibleStep.next(), layer);
            }
        } else {
			/* if($('.cd-panel').hasClass('is-visible')){
				$('.cd-panel').removeClass('is-visible');
			} */
            showStep(visibleStep.prev(), layer);
        }
    }, delay);
}

function closeTour(steps, wrapper, layer) {
    if ($('.cd-panel').hasClass('is-visible')) {
        $('.cd-panel').removeClass('is-visible');
    }
    $('body').removeClass('disable-scroll');
    $('#tour_container').remove();
    localStorage.setItem('tour_shown', false);
    return false;
}

function viewportSize() {
    /* retrieve the content value of .cd-main::before to check the actua mq */
    return window.getComputedStyle(document.querySelector('.cd-tour-wrapper'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
}

