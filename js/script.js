$(document).ready(function () {
    //$(".photo").delay(500).fadeOut(1000);
    //zoomplus();
    //------

    var socket = io.connect('http://localhost:8080');

    socket.on('serveur', function (message) {

        console.log(message);
        //$("#info").append("<b>"+message+"</b>");
    });

    socket.on('distance', function (message) {

        console.log(message);
        //$("#info").append("<b>"+message+"</b>");
        if (message === 1) {
            zoommoins();
        } else {
            zoomplus();
        }

    });

    socket.on('message', function (message) {
        if (message == 1) {
            $("#message").html("Veuillez patienter !</br> Impression en cours </br><div id='timer'></div>");

            var min = 0, sec = 50, ds = 0;

            var chrono = setInterval(function () {
                if (min == 0 && sec == 0 && ds == 0) { // On stop tout si minute=0
                    clearInterval(chrono);
                }
                if (sec == 0) { // si les seconde = 0
                    min--;   // on enlève 1 minute
                    sec = 59; // on remet les seconde a 59
                }
                if (ds == 0) { // si les dixièmes de seconde=0
                    sec--; // on enlève 1 seconde
                    ds = 10; // on remet les dixième a 10
                } else {
                    ds--;  // sinon on enlève 1 dixième
                }

                $('#timer').text(min + ':' + sec + ':' + ds); // Affiche le décompte

            }, 100); // mise a jour toute les 100 milliseconde (1s=1000 milliseconde)


        } else {
            $("#message").html(message);
            console.log(message);
        }


    });

    socket.on('photo', function (message) {
        if (message == "") {
            $(".photo").delay(500).fadeOut(1000);
        } else {
            $(".photo").html(message);
            $(".photo").delay(500).fadeIn(1000);
        }
    });


    socket.on('cheese', function (message) {


        console.log(message);
        if (message === 1) {
            toggleOverlay();
            classie.add(overlay, 'open');
            console.log("ouverture des rideaux");
            setTimeout(compte, 1000)
        } else {
            toggleOverlay();
            classie.add(overlay, 'close');
            console.log("Fermeture des rideaux");
        }
    });

    $("#info").fadeOut(1);
    var reduction = 4;

    var taille = $(document).width();
    var tailleMask = $("#mask").width();
    var marginMask = (taille / 2) - (tailleMask / (2 * reduction));

    function zoomplus() {
        $("#mask").animate({
            width: divToPercentage(reduction),
            opacity: 0.2,
            margin: marginMask
        }, 1500);
        $("#info").delay(500).fadeOut(400);

    }

    function zoommoins() {
        $("#mask").animate({
            width: "100%",
            opacity: 1,
            margin: 0
        }, 1500);
        $("#info").delay(2500).fadeIn(1000);
    }


    function percentage(num, per) {
        return (num / 100) * per + "%";
    }

    function divToPercentage(num) {
        return (100 / num) + "%";
    }

    function compte() {
        $(".rebour").html("3");
        $(".rebour").fadeIn(1000);
        window.setTimeout(function () {
            $(".rebour").html("2");
            $(".rebour").fadeIn(1000);
            window.setTimeout(function () {
                $(".rebour").html("1");
                $(".rebour").fadeIn(1000);
                window.setTimeout(function () {
                    $(".rebour").html("Souriez !");
                    socket.emit('retourCheese', 1);
                }, 1000);
            }, 1000);
        }, 1000);


    }


});


// ---------------------------
