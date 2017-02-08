<?php
/**
 * Created by PhpStorm.
 * User: Chris
 * Date: 2/1/2017
 * Time: 9:32 AM
 */     ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>CS496 Project</title>

    <!-- Font Awesome-->
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <!-- Bootstrap Stylesheets   -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- Main Style -->
    <link href="css/main.css" rel="stylesheet">

</head>
<body>

<div class="container">


    <!--    SS REQUEST-->
    <div class="col-md-12 ">
        <h1>Communication Demo</h1>

        <div class="well col-lg-6 col-md-offset-3">
            <h3 class="text-center">Parameters for SS</h3>

            <form id="ss-host-form">

                <div class="radio">
                    <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
                        Game 1
                    </label>
                </div>
                <div class="radio">
                    <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
                        Game 2 - The return of the JARED
                    </label>
                </div>
                <div class="radio disabled">
                    <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" disabled>
                        GAME 3 - Revenge of CONMAN (COMING SOON)
                    </label>


                <button type="submit" style="width: 100%;margin-top: 20px" class="btn btn-success">Submit</button>
            </form>

        </div>

    </div>


    <!--    Controller REQUEST-->
    <div class="col-md-12 ">


        <div class="well col-lg-6 col-md-offset-3">
            <h3 class="text-center">Parameters for Controller</h3>

            <form>

                <div class="form-group">
                    <label for="name">Display Name</label>
                    <input class="form-control" id="name" placeholder="Display Name">
                </div>

                <div class="form-group">
                    <label for="name">Room Join Code</label>
                    <input class="form-control" id="name" placeholder="Room Join Code">
                </div>

                <button type="submit" style="width: 100%" class="btn btn-success">Submit</button>
            </form>

        </div>

    </div>


</div>








<script src="js/jquery-3.1.1.min.js"></script>
<script src="js/bootstrap.min.js"></script>



<script>

    $( "#ss-host-form" ).submit(function( event ) {
        console.log("Event Captured");
        $.ajax(
            {
                url: "handlers/ss-host-handler.php",
                type: "POST",
                data: $("#ss-host-form").serializeArray(),
                success: function (data, textStatus, jqXHR) {
                    //data: return data from server
                    console.log(data);


                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                    }


                    if (data.success) {
                        //window.location = "home.php";
                        console.log("Successful Request to server");
                        console.log(data);

                    } else {
                        //$("#login-errors").html(`<div id="login-error" class="alert alert-danger"><strong>Failed Login!</strong> Email and Password combination do not match our records.</div>`);

                    }

                    window.setTimeout(function () {
                        $("#login-error").fadeOut();
                    }, 3000);


                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //if fails
                    console.log("ERROR: Cannot Post")
                }



            })

        event.preventDefault();
        return false;

    });


</script>



</body>
</html>
