var game;
var size;
var type;
var overlay;
var iTimer;

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function createNumericInterface() {
    var table = game;
    while (table.rows.length < size.height) {
        var row = table.insertRow(table.rows.length);
        for (i = 0; i < size.width; i++) {
            var cell = row.insertCell(i);
            var value;
            if (table.rows.length != 1) {
                value = ((table.rows.length - 1) * size.width) + i + 1;
            }
            else {
                value = i + 1;
            }
            //cell.innerHTML = value;
            cell.setAttribute("class", "open");
            cell.setAttribute("id", "open");
            cell.setAttribute("uid", value);
            cell.setAttribute("onclick", "processClick(this)");
        }
    }
}

function open(args) {
    if (args == 'all') {

    }
}

function close(args) {
    if (args == 'all') {
        var elems = game.getElementsByTagName("td");
        for (i = 0; i < elems.length; i++) {
            elems[i].setAttribute("class", "close");
            elems[i].setAttribute("id", "close");
            elems[i].children[0].classList.toggle("hover");
        }
    }
}

function fillTable() {
    var totalElems = size.width * size.height;
    var randomArray = [];
    for (i = 0; i < totalElems / 2; i++) {
        randomArray[i] = i + 1;
        randomArray[i + totalElems / 2] = i + 1;
    }
    var randomArray = shuffle(randomArray);
    var elems = game.getElementsByTagName("td");
    for (i = 0; i < elems.length; i++) {
        elems[i].setAttribute("value", randomArray[i]);
        elems[i].setAttribute("data-val", randomArray[i]);
        var url = "images/" + randomArray[i].toString() + ".png";
        elems[i].innerHTML = "<div class='flip-container'><div class='flipper'><div class='back'></div><div class='front' style='background: url(" + url + ");background-size: 36px;background-repeat: no-repeat;background-position: 2px 3px;color: transparent;'></div></div></div>";
    }
}

function checkGameScore() {
    if (document.getElementById("close") == null) {
        //location.reload();
        var sec = parseInt(document.getElementById("timer").getAttribute("time-val"));
        document.getElementById("timer").setAttribute("time-val", sec);
        var min = parseInt(parseInt(sec) / 60);
        var sec = parseInt(sec) % 60;
        var totalClicks = parseInt(document.getElementById("clicks").innerHTML) + 1;
        overlay.style.display = "table-cell";
        overlay.innerHTML = "<div id='finalMessage'><p>Good Job,&nbsp;" + getCookie("username") + "<br>You finished the game in " + min + " minutes and " + sec + " seconds and with " + totalClicks + " clicks</p></div>";
        clearInterval(iTimer);
        processClick = "";
        storeScore(min, sec, totalClicks);
    }
}

function storeScore(min, sec, totalClicks) {
    var setCookieFlag = 0;
    var currentScore = getCookie("username") + "," + min + "," + sec + "," + totalClicks;
    for (i = 1; i <= 10; i++) {
        var cookieName = "score" + i;
        if (getCookie(cookieName) == "") {
            setCookie(cookieName, currentScore, 1);
            setCookieFlag = 1;
            break;
        }
    }
    if (setCookieFlag != 1) {
        for (i = 1; i <= 10; i++) {
            if (i != 10) {
                var fCookieName = "score" + i;
                var tCookieName = "score" + i + 1;
                setCookie(tCookieName, getCookie(fCookieName));
            }
            else {
                var cookieName = "score" + i;
                setCookie(cookieName, currentScore, 1);
            }
        }
    }
    else {
        setCookieFlag = 0;
    }

}

function restart() {
    location.reload();
}

function viewHistory() {
    var score = [];
    for (i = 1; i <= 10; i++) {
        var cookieName = "score" + i;
        var cookieValue = getCookie(cookieName);
        if (cookieValue == "") {
            break;
        }
        else {
            score[i - 1] = "UserName= " + cookieValue.split(',')[0] + "; Time=" + cookieValue.split(',')[1] + ":" + cookieValue.split(',')[2] + "; Clicks=" + cookieValue.split(',')[3];
        }
    }
}

function processClick(element) {
    if (element.id == "close") {
        if (document.getElementById("open") != null) {
            if (document.getElementById("open").getAttribute("data-val") == element.getAttribute("data-val") && document.getElementById("open").getAttribute("uid") != element.getAttribute("uid")) {
                element.id = "done";
                element.className = "done";
                element.children[0].classList.toggle("hover");
                document.getElementById("open").className = "done";
                document.getElementById("open").id = "done";
                checkGameScore();
            }
            else {
                element.children[0].classList.toggle("hover");
                overlay.style.display = "block";
                setTimeout(function () {
                    element.id = "close";
                    element.className = "close";
                    document.getElementById("open").children[0].classList.toggle("hover");
                    element.children[0].classList.toggle("hover");
                    document.getElementById("open").className = "close";
                    document.getElementById("open").id = "close";
                    overlay.style.display = "none";
                }, 1000);
            }
        }
        else {
            element.id = "open";
            element.className = "open";
            element.children[0].classList.toggle("hover");
        }
    }
    document.getElementById("clicks").innerHTML = parseInt(document.getElementById("clicks").innerHTML) + 1;
}

function initialize() {
    overlay = document.getElementById("overlay");
    game = document.getElementById("game");
    size = { height: "4", width: "4" };
    type = "numeric";
    if (type == "numeric") {
        createNumericInterface();
    }
    if (type == "image") {
        createImageInterface();
    }
    fillTable();
    setTimeout(function () {
        close('all');
    }, 2000);
    iTimer = setInterval(function () {
        var sec = parseInt(document.getElementById("timer").getAttribute("time-val")) + 1;
        document.getElementById("timer").setAttribute("time-val", sec);
        var min = parseInt(parseInt(sec) / 60);
        var sec = parseInt(sec) % 60;
        document.getElementById("timer").innerHTML = min + ":" + sec;
    }, 1000);
}

window.onload = function () {
    document.getElementById("play").disabled = true;
    document.getElementById("container").style.display = "none";
}

function checkButton() {
    if (document.getElementById("username").value != "" && document.getElementById("username").value != undefined) {
        document.getElementById("play").disabled = false;
    }
    else {
        document.getElementById("play").disabled = true;
    }
}

function saveName() {
    document.getElementById("name").style.display = "none";
    setCookie("username", document.getElementById("username").value, 1);
    document.getElementById("container").style.display = "block";
    initialize();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}