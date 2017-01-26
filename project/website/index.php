<?php

?>


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

    <div class="container-fluid">
        <div class="menu-container">
            <div class="col-md-4 well">
                <div class="col-row">
                    <h1 class="text-center shake">
                        <i class="fa fa-child" aria-hidden="true"></i> Party Screen <i class="fa fa-child" aria-hidden="true"></i>
                    </h1>
                </div>
                <div class="col-row">
                    <button type="button" id="host-btn" class="btn menu-btn add-margin-vertical btn-primary center-block"><i class="fa fa-tv" aria-hidden="true"></i> Host Game</button>
                </div>

                <div class="col-row">
                    <button type="button" id="join-btn" class="btn menu-btn add-margin-vertical btn-primary center-block"><i class="fa fa-user-plus" aria-hidden="true"></i> Join Game</button>
                </div>
                <div class="col-row">
                    <button type="button" id="info-btn" data-toggle="modal" data-target="#info-modal" class="btn menu-btn add-margin-vertical btn-info center-block"><i class="fa fa-info-circle" aria-hidden="true"></i> Info</button>
                </div>
            </div>
        </div>
    </div>


    <?php require_once("elements/info-modal.php"); ?>

    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/menu.js"></script>
</body>
</html>