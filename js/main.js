/********************
 Globals
 ********************/

var sources,
    cm,
    hud,
    dai,
    localization,
    chrono;


/********************
 IOS detections
 ********************/
var isIPhone = navigator.userAgent.indexOf("iPhone") !== -1,
    isIPod = navigator.userAgent.indexOf("iPod") !== -1,
    isIPad = navigator.userAgent.indexOf("iPad") !== -1,
    isIOS = isIPhone || isIPod || isIPad,
    isFullScreen = window.navigator.standalone;

/********************
 Card management
 ********************/

function CardManager() {
    "use strict";

    CardManager.prototype.options = {
        question: "kana",
        answer: "furansugo",
        questiontype: "choice",
        numberofchoice: 3
    };

    CardManager.prototype.instance = [];

    // The current card selected
    CardManager.prototype.current = null;

    // stack of wrong card
    CardManager.prototype.error = [];

    // stack of correct card
    CardManager.prototype.correct = [];

    if (CardManager.initialized === undefined) {

        /**********
        Init methods
         **********/

        CardManager.prototype.initialize = function (dai_list) {

            var index, tmp, pack, sub, part;

            this.error = [];

            this.correct = [];

            this.instance = [];

            for (index in dai_list) {
                if (typeof dai_list[index] === "string") {

                    part = dai_list[index].split('.');

                    pack = part[0];
                    sub = part[1];

                    if (sources === undefined) {
                        hud.errorMessage(hud.local('exception_filemissing'));
                        return;
                    }

                    tmp = sources[pack][sub];

                    this.instance = this.instance.concat(tmp.clone());
                }
            }

            this.instance.shuffle();

            //chrono.start();

            //setInterval("chrono.autoPrint()", 200);

            this.prepareNext();
        };

        CardManager.prototype.start = function () {

            this.options.question = hud.returnSelectedOption('question_type');
            this.options.answer = hud.returnSelectedOption('answere_type');
            this.options.numberofchoice = hud.getObject('nbofanswere').value;

            var part, sub, pack, daiTemplates;

            //select = hud.getObject('dai_selector');

            //length = select.options.length;

            daiTemplates = hud.returnSelectedOption('dai_selector');

            if (daiTemplates.length > 0) {
                part = daiTemplates.split('.');

                pack = part[0];

                if (part[1] !== undefined && pack !== "all") {
                    sub = part[1];
                    this.initialize(HUD.daiTemplates[pack][sub]);
                } else {
                    this.initialize(HUD.daiTemplates['all']);
                }

                /*for (i = 0; i < length; i++) {
                    if (select.options[i].selected === true) {
                        dai_list.push(select.value);
                    }
                }*/

                /*if (dai_list.length > 0) {
                    this.initialize(dai_list);
                }*/
            }


        };

        CardManager.prototype.restart = function () {

            //remove correct/error class
            hud.removeClass("message", "alert alert-success alert-danger");

            this.instance = [];

            this.instance = this.instance.concat(this.error.clone());

            this.instance.shuffle();

            this.error = [];

            hud.html("message", "");

            this.prepareNext();
        };

        CardManager.prototype.storeStat = function (card, correct) {
            if (Storage !== undefined) {
                var statistic;
                if (localStorage.statistic !== undefined) {
                    statistic = JSON.parse(localStorage.statistic);
                } else {
                    statistic = {};
                }

                if (statistic[card.id] === undefined) {
                    statistic[card.id] = { correct: 0, error: 0 };
                }

                if (correct) {
                    statistic[card.id].correct += 1;
                } else {
                    statistic[card.id].error += 1;
                }

                localStorage.statistic = JSON.stringify(statistic);
            }
        };

        /**********
        Question methods
         **********/

        CardManager.prototype.prepareNext = function () {

            var message, wrongCard;

            hud.hideForm();

            if (this.instance.length > 0) {

                hud.showSection("quiz");

                this.current = this.instance.shift();

                wrongCard = null;

                if (this.options.questiontype === "choice") {
                    wrongCard = this.instance.clone();

                    wrongCard = wrongCard.concat(this.error);
                    wrongCard = wrongCard.concat(this.correct);

                    wrongCard.shuffle();
                }

                this.showCards(wrongCard);
            } else {

                message = '<h1>' + hud.local('done') + '!</h1>';

                if (this.error.length > 0) {
                    message += '<h2>' + hud.local('error') + ': ' + this.error.length + '</h2>';
                    message += '<button class="btn btn-success btn-lg" onclick="cm.restart()">' + hud.local('continue') + '</button>';
                } else {
                    message += hud.local('no_error') + '</h2>';
                }

                message += '<button class="btn btn-danger btn-lg" onclick="hud.start()">' + hud.local('quit') + '</button>';

                hud.html("result", message);

                hud.showSection("result");
            }

        };

        CardManager.prototype.showCards = function (falseCard) {

            hud.html("question", this.cardValue(this.current, this.options.question));

            hud.show("question");

            hud.showCounter(this.instance.length + 1);

            if (falseCard !== "undefined") {

                var choiceCard = [],
                    i,
                    val,
                    len;

                choiceCard.push(this.current);

                for (i = 1; i < this.options.numberofchoice; i++) {
                    choiceCard.push(falseCard.shift());
                }

                choiceCard.shuffle();

                len =  choiceCard.length;

                for (i = 1; i <= len; i++) {
                    val = choiceCard.shift();

                    hud.html("answer" + i, this.cardValue(val, this.options.answer));

                    hud.show("answer" + i);
                }
            } else {
                //todo
            }

        };


        /**********
        Answer methods
         **********/

        CardManager.prototype.answer = function (index) {
            var value = hud.html("answer" + index),
                message;

            hud.html("message", '');

            //remove correct/error class
            hud.removeClass("message", "alert alert-success alert-danger");

            if (this.checkResponse(value, this.current)) {
                this.correct.push(this.current);
                message = '<strong>' + hud.local('good_answer') + '</strong>';
                hud.addClass("message", "alert alert-success");
                this.storeStat(this.current, true);
            } else {
                this.error.push(this.current);
                message = '<strong>' + hud.local('error') + '!</strong> ' + hud.local('bad_answer', {answer: this.cardValue(this.current, this.options.answer)}) + '<br>';
                hud.addClass("message", "alert alert-danger");
                this.storeStat(this.current, false);
            }

            hud.html("message", message);

            this.prepareNext();
        };

        CardManager.prototype.checkResponse = function (response, card) {

            if (response === card.furansugo) {
                return true; // the response is correct
            }

            if (response === card.roumajis) {
                return true; // the response is correct
            }

            if (response === card.kana) {
                return true; // the response is correct
            }

            if (card.kanji !== undefined) {
                if (response === card.kanji) {
                    return true; // the response is correct
                }
            }

            return false;
        };

        /**********
        General methods
         **********/
        CardManager.prototype.cardValue = function (card, type) {
            switch (type) {
            case "kana":
                return card.kana;
            case "roumaji":
                return card.roumaji;
            case "furansugo":
                return card.furansugo;
            case "kanji":
                if (card.kanji === undefined) {
                    return card.kana;
                }

                return card.kanji;

            }

            return card.roumaji;
        };


        CardManager.initialized = true;
    }


}
cm = new CardManager();

 /********************
 HUD Method
 ********************/

function HUD() {
    "use strict";

    if (HUD.initialized === undefined) {

        HUD.prototype.initialize = function () {
            this.translateHtml();

            if (isIOS && !isFullScreen) {
                this.show("nofullscreen");
            }

            this.hide("loading");
            this.show("main");

            this.attachEvents();
            this.printDefaultOptions();
            this.printDaiList();

            this.start();
        };

        HUD.prototype.start = function () {

            this.showSection("configurator");
            //Chrono.htmlZone = "chrono";
        };

        // Hide form for answers
        HUD.prototype.hideForm = function () {
            this.hide("answer1");
            this.hide("answer2");
            this.hide("answer3");
            this.hide("answer4");
            this.hide("answer5");

            this.hide("question");
        };

        HUD.prototype.generateDaiList = function () {

            //this.showSection("configurator");

            var name,
                subname,
                elem,
                listAll = [],
                listDai = {},
                listCat = {};

            if (dai === undefined) {
                hud.errorMessage(hud.local('exception_filemissing'));
                return;
            }

            for (name in dai) {

                if ((dai.hasOwnProperty(name)) && typeof dai[name].dai === "number") {

                    for (subname in dai[name].list) {
                        if (dai[name].list.hasOwnProperty(subname)) {
                            elem = dai[name].list[subname];
                            if ((dai[name].list.hasOwnProperty(subname)) && typeof elem === "string") {

                                if (listDai[dai[name].dai] === undefined) {
                                    listDai[dai[name].dai] = [];
                                }

                                if (listDai[elem] === undefined) {
                                    listCat[elem] = [];
                                }

                                listAll.push('dai' + dai[name].dai + 'ka.' + elem);
                                listDai[dai[name].dai].push('dai' + dai[name].dai + 'ka.' + elem);
                                listCat[elem].push('dai' + dai[name].dai + 'ka.' + elem);

                            }
                        }
                    }
                }
            }

            HUD.daiTemplates.all = listAll;
            HUD.daiTemplates.dai = listDai;
            HUD.daiTemplates.cat = listCat;
        };

        // Generate the select for the list of lessons
        /*HUD.prototype.printDaiList = function () {

            this.showSection("configurator");

            var e = this.getObject('dai_selector'),
                group,
                option,
                name,
                subname,
                elem;

            if (dai === undefined) {
                hud.errorMessage(hud.local('exception_filemissing'));
                return;
            }

            for (name in dai) {

                if ((dai.hasOwnProperty(name)) && typeof dai[name].dai === "number") {

                    group = document.createElement('optgroup');
                    group.label = 'Dai ' + dai[name].dai + ' ka';

                    e.appendChild(group);

                    for (subname in dai[name].list) {
                        if (dai[name].list.hasOwnProperty(subname)) {
                            elem = dai[name].list[subname];
                            if ((dai[name].list.hasOwnProperty(subname)) && typeof elem === "string") {
                                option = document.createElement("option");
                                option.innerHTML = elem.charAt(0).toUpperCase() + elem.substr(1);
                                option.value = 'dai' + dai[name].dai + 'ka.' + elem;
                                group.appendChild(option);
                            }
                        }
                    }
                }
            }
        };*/

        // Generate the select for the list of lessons
        HUD.prototype.printDaiList = function () {

            this.generateDaiList();

            var e = this.getObject('dai_selector'),
                group,
                option,
                name;

            // All
            option = document.createElement("option");
            option.innerHTML = this.local("all");
            option.value = 'all';
            e.appendChild(option);

            group = document.createElement('optgroup');
            group.label = 'Dai';
            e.appendChild(group);

            for (name in HUD.daiTemplates.dai) {
                if (HUD.daiTemplates.dai.hasOwnProperty(name)) {
                    option = document.createElement("option");
                    option.innerHTML = 'Dai ' + name + ' ka';
                    option.value = 'dai.' + name;
                    group.appendChild(option);
                }
            }

            group = document.createElement('optgroup');
            group.label = this.local("category");
            e.appendChild(group);

            for (name in HUD.daiTemplates.cat) {
                if (HUD.daiTemplates.cat.hasOwnProperty(name)) {
                    option = document.createElement("option");
                    option.innerHTML = name.charAt(0).toUpperCase() + name.substr(1);
                    option.value = 'cat.' + name;
                    group.appendChild(option);
                }
            }
        };

        HUD.prototype.printDefaultOptions = function () {

            this.setSelectOption("question_type", cm.options.question);
            this.setSelectOption("answere_type", cm.options.answer);

            //this.setSelectOption("", cm.options.questiontype); 
            // Not yet implemented

            this.getObject("nbofanswere").value = cm.options.numberofchoice;
            this.showValue();

        };

        // Show a specific section, hide the others
        HUD.prototype.showSection = function (section) {
            this.hide("quiz");
            this.hide("result");
            this.hide("configurator");

            this.show(section);
        };

        // Print the counter for question left
        HUD.prototype.showCounter = function (nb) {
            var message;

            if (nb > 1) {
                message = hud.local('answere_counter', {nb: nb}) + '<br>'; //'Encore ' + nb + ' questions<br>';
            } else {
                message = hud.local('answere_last') + '<br>';
            }
            this.html("counter", message);
        };

        // Bind events on DOM elements
        HUD.prototype.attachEvents = function () {

            this.getObject("send_input").onclick = function () { cm.answer_input(); };

            this.getObject("answer1").onclick = function () { cm.answer(1); };
            this.getObject("answer2").onclick = function () { cm.answer(2); };
            this.getObject("answer3").onclick = function () { cm.answer(3); };
            this.getObject("answer4").onclick = function () { cm.answer(4); };
            this.getObject("answer5").onclick = function () { cm.answer(5); };

            this.attachEvent("nbofanswere", "change", function () { hud.showValue(); });

            this.getObject("start").onclick = function () { cm.start(); };

        };

        HUD.prototype.attachEvent = function (object, event, callback) {
            this.getObject(object).addEventListener(event, callback, false);
        };

        // Show the value of the slider
        HUD.prototype.showValue = function () {
            this.html("showvalue", this.getObject("nbofanswere").value);
        };

        HUD.prototype.translateHtml = function () {
            var elem, elems = this.getClass("translate");

            for (var elem = 0; elem <= elems.length; elem++) {
                if (elems.hasOwnProperty(elem)) {
                    if (elems[elem].classList.contains("translated") === false) {
                        elems[elem].innerHTML = this.local(elems[elem].innerHTML);
                        elems[elem].classList.add("translated");
                    }
                }
            }
        };

        /********
        Generics functions
         ********/

        // Get the specified object
        HUD.prototype.getObject = function (id) {
            if (typeof id === "string") {
                return document.getElementById(id);
            }
            return id;
        };

        HUD.prototype.getClass = function (id) {
            if (typeof id === "string") {
                return document.getElementsByClassName(id);
            }
            return id;
        };

        HUD.prototype.html = function (id, value) {
            var obj = this.getObject(id);

            if (value !== undefined) {
                obj.innerHTML = value;
            }

            return obj.innerHTML;
        };

        // Hide or show a DOM element (depend of the presence of .hidden class)
        HUD.prototype.toggle = function (id) {
            var obj = this.getObject(id);
            if (obj.className.length > 0) {
                if (obj.classList.contains("hidden") === false) {
                    this.show(obj);
                } else {
                    this.hide(obj);
                }
            } else {
                this.hide(obj);
            }
        };

        // Hide a DOM element. Don't change anything if the element already have .hidden class
        HUD.prototype.hide = function (id) {
            this.addClass(id, "hidden");
        };

        // Show a DOM element by removing .hidden class
        HUD.prototype.show = function (id) {
            this.removeClass(id, "hidden");
        };

        HUD.prototype.addClass = function (objet, classes) {
            var obj = this.getObject(objet),
                classeList = classes.trim().split(' '),
                classe;

            for (classe in classeList) {
                if (classeList.hasOwnProperty(classe)) {
                    if (obj.classList.contains(classeList[classe]) === false) {
                        obj.classList.add(classeList[classe]);
                    }
                }
            }

        };

        HUD.prototype.removeClass = function (objet, classes) {
            var obj = this.getObject(objet),
                classeList = classes.trim().split(' '),
                classe;

            for (classe in classeList) {
                if (classeList.hasOwnProperty(classe)) {
                    if (obj.classList.contains(classeList[classe]) === true) {
                        obj.classList.remove(classeList[classe]);
                    }
                }
            }
        };

        // Get the selected value for a input select
        HUD.prototype.returnSelectedOption = function (SelectId) {

            var select = this.getObject(SelectId),
                i;

            for (i = 0; i < select.options.length; i++) {
                if (select.options[i].selected === true) {
                    return select.options[i].value;
                }
            }
        };

        HUD.prototype.setSelectOption = function (SelectId, value) {
            var select = this.getObject(SelectId),
                current,
                i;

            for (i = 0; i < select.options.length; i++) {

                current = select.options[i];

                if (current.value === value || current.innerHTML === value) {
                    current.selected = true;
                }
            }
        };

        HUD.prototype.getRomaji2Latin = function (text) {
            text = text.replace(/aa/gi, 'ā');

            text = text.replace(/ii/gi, 'ī');

            text = text.replace(/uu/gi, 'ū');

            text = text.replace(/oo/gi, 'ō');
            text = text.replace(/ou/gi, 'ō');

            return text.toLowerCase();
        };

        // Get translation and parse message
        HUD.prototype.local = function (index, params) {

            var message = "localization: " + index,
                key;
            if (localization !== undefined) {
                if (typeof localization[index] === "string") {
                    message = localization[index];

                    if (typeof params === "object") {

                        for (key in params) {
                            if (params.hasOwnProperty(key)) {
                                message = message.replace('%' + key + '%', params[key]);
                            }
                        }
                    }

                }
            }

            return message;
        };

        HUD.prototype.errorMessage = function (message) {
            document.body.innerHTML = message;
        };

        HUD.initialized = true;
        HUD.daiTemplates = {};
    }
}
hud = new HUD();

/********************
  Chrono
  Usefull to mesure time, with pause system
 ********************/

function Chrono() {
    "use strict";

    if (Chrono.initialized === undefined) {
        Chrono.prototype.start = function () {
            // start a new timer

            if (this.paused || this.stoped) {
                this.startDate = new Date().getTime();
                this.stopDate = false;
                this.paused = false;
                this.stoped = false;
                this.cumulativeTime = 0;
            }
        };

        Chrono.prototype.togglePause = function () {
            // enable or disable pause

            if (!this.stoped) {
                if (!this.paused) {
                    this.paused = true;

                    this.stopDate = new Date().getTime();

                } else {
                    this.paused = false;

                    this.cumulativeTime += (this.stopDate - this.startDate);
                    this.startDate = new Date().getTime();
                    this.stopDate = false;
                }
            }
        };

        Chrono.prototype.stop = function () {
            // Stop the timer, compile the time
            // suspend action of togglePause
            // the start method reset the timer
            if (!this.stoped) {
                this.stopDate = new Date().getTime();

                this.paused = false;
                this.stoped = true;
            }
        };

        Chrono.prototype.print = function () {
            // Print the current time

            var chronotime;

            if (this.startDate !== false) {

                if (this.stopDate === false) {
                    chronotime = this.cumulativeTime + (new Date().getTime() - this.startDate);
                } else {
                    chronotime = this.cumulativeTime + (this.stopDate - this.startDate);
                }
            }

            return chronotime;

        };

        Chrono.prototype.autoPrint = function () {
            if (Chrono.htmlZone !== null) {
                hud.getObject(Chrono.htmlZone).innerHTML = this.print();
            }
        };

        this.startDate = false;
        this.stopDate = false;

        this.cumulativeTime = 0;

        this.paused = false;
        this.stoped = true;

        Chrono.initialized = true;
        Chrono.htmlZone = null;
    }
}
//chrono = new Chrono();

 /********************
 Tools & Enhancements
 ********************/

// Add a clone method into the Array Object
Array.prototype.clone = function () {
    "use strict";
    return this.slice(0);
};

 // Add a clone method into the Array Object
Array.prototype.shuffle = function () {
    "use strict";
    var len = this.length, i, p, t;
    i = len;

    while (i--) {
        p = parseInt(Math.random() * len, 10);
        t = this[i];
        this[i] = this[p];
        this[p] = t;
    }
};

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        "use strict";
        return this.replace(/^\s+|\s+$/g, '');
    };
}

// slider for IOS
(function () {
    "use strict";
    var item,
        i,
        sliders = document.querySelectorAll('input[type="range"]'),
        callbackSlider = function (item) {
            if (item.hasOwnProperty("currentTarget")) {
                item = item.currentTarget;
            }
            var value = (item.value - item.min) / (item.max - item.min);
            item.style.backgroundImage = [
                '-webkit-gradient(',
                'linear, ',
                'left top, ',
                'right top, ',
                'color-stop(' + value + ', #007aff), ',
                'color-stop(' + value + ', #b8b7b8)',
                ')'
            ].join('');
        };

    for (i = 0; i < sliders.length; i++) {
        item = sliders[i];
        item.addEventListener('change', callbackSlider, false);
        callbackSlider(item);
    }
}());

/*var nonbounce = function (elems) {
    var cont;
    var startY;
    var idOfContent = "";
    nonbounce_touchmoveBound = false;

    var isContent = function(elem) {
        var id = elem.getAttribute("id");
        
        while (id !== idOfContent && elem.nodeName.toLowerCase() !== "body") {
            elem = elem.parentNode;
            id = elem.getAttribute("id");
        }
        
        return (id === idOfContent);
    };
    
    var touchstart = function(evt) {
        // Prevents scrolling of all but the nonbounce element
        if (!isContent(evt.target)) {
            evt.preventDefault();
            return false;
        }

        startY = (evt.touches) ? evt.touches[0].screenY : evt.screenY;
    };
    
    var touchmove = function(evt) {
        var elem = evt.target;

        var y = (evt.touches) ? evt.touches[0].screenY : evt.screenY;
        
        // Prevents scrolling of content to top
        if (cont.scrollTop === 0 && startY <= y) {
            evt.preventDefault();
        }
        
        // Prevents scrolling of content to bottom
        if (cont.scrollHeight-cont.offsetHeight === cont.scrollTop && startY >= y) {
            evt.preventDefault();
        }
    }
    
    if (typeof elems === "string") {
        cont = document.getElementById(elems);
        
        if (cont) {
            idOfContent = cont.getAttribute("id");
            window.addEventListener("touchstart", touchstart, false);
        }
    }
    
    if (!nonbounce_touchmoveBound) {
        window.addEventListener("touchmove", touchmove ,false);
    }
};*/
//nonbounce("wrapper");

document.addEventListener('touchmove', function (e) {
    "use strict";
    e.preventDefault();
}, false);

// Set the width & height


window.onresize = function () {
    "use strict";
    //$(document.body).width(window.innerWidth).height(window.innerHeight);
    document.body.style.width = window.innerWidth;
    document.body.style.height = window.innerHeight;
};

// Initialize function
/*window.addEventListener('load', function () {
    "use strict";

    // Remove rubberband scroll
    window.onresize();

    window.applicationCache.addEventListener('updateready', function () {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            // Swap it in and reload the page to get the new hotness.
            window.applicationCache.swapCache();
            window.location.reload();

        }

        hud.initialize();
    }, false);

    window.applicationCache.addEventListener('noupdate', function () {
        hud.initialize();


    }, false);

    

}, false);*/



hud.initialize();