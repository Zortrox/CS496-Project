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

    <style>
        button{
            outline: none;
        }
        
        .row{
            margin-top: 20px;
        }
        
        .loader {
            border: 16px solid #f3f3f3;
            border-top: 16px solid #428BCA;
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>

</head>
<body>

    <div class="container-fluid">
        <div class="menu-container">


            <!--             Main Menu      -->

            <div class="col-md-4 well" id="main-menu">
                <div class="col-row">
                    <h1 class="text-center shake">
                        <i class="fa fa-child" aria-hidden="true"></i> Party Screen <i class="fa fa-child" aria-hidden="true"></i>
                    </h1>
                </div>
                <div class="col-row">
                    <button type="button" id="host-button" class="btn menu-btn add-margin-vertical btn-primary center-block" onclick="show('host-menu'); hide('main-menu')"><i class="fa fa-tv" aria-hidden="true"></i> Host Game</button>
                </div>

                <div class="col-row">
                    <button type="button" id="join-button" class="btn menu-btn add-margin-vertical btn-primary center-block" onclick="show('join-menu'); hide('main-menu')"><i class="fa fa-user-plus" aria-hidden="true"></i> Join Game</button>
                </div>
                <div class="col-row">
                    <button type="button" id="info-btn" data-toggle="modal" data-target="#info-modal" class="btn menu-btn add-margin-vertical btn-info center-block"><i class="fa fa-info-circle" aria-hidden="true"></i> Info</button>
                </div>
            </div>

            <!--                Host Game        -->

            <div class="col-md-4 well" id="host-menu" style="display:none">
                <div class="col-row" style="width: 100%">
                    <button style="margin: 0px;" type="button" class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('host-menu')"><i class=" fa fa-reply" aria-hidden="true"></i></button>
                    <h1 style="margin-top: 0px;" class="text-center shake" >Host a Game</h1>

                    <div class="row">
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 1</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 2</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 3</button></div>
                    </div>
                    
                    <div class="row">
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 4</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 5</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 6</button></div>
                    </div>
                    
                </div>
            </div>





            <!--                Join Game        -->

            <div class="col-md-4 well" id="join-menu" style="display:none">
                <div class="col-row" style="width: 100%">
                    <button style="margin: 0px;" type="button"  class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('join-menu')"><i class="fa fa-reply" aria-hidden="true"></i></button>
                    <h1 style="margin-top: 0px;" class="text-center shake" >Join a Game</h1>
                    
                    <form>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-circle-arrow-right"></i></span>
                            <input id="game-code" type="text" class="form-control" name="code" placeholder="Enter Code">
                        </div>
                    </form>
                    
                    <div class="row">
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 1</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 2</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 3</button></div>
                    </div>
                    
                    <div class="row">
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 4</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 5</button></div>
                        <div class="col-sm-4"><button type="button" class="btn menu-btn main-menu-btn btn-primary">Game 6</button></div>
                    </div>
                    
                    <button style="margin-top: 20px" type="button" class="btn center-block menu-btn main-menu-btn btn-primary" onclick="hide('join-menu'); show('loading-menu')"><i class="glyphicon glyphicon-globe" aria-hidden="true"> Find Game</i></button>
                    
                </div>
            </div>
            
            
            
            
            <!--                Loading Screen        -->

            <div class="col-md-4 well" id="loading-menu" style="display:none">
                <div class="loader center-block"></div>
            </div>

        </div>
    </div>


    <?php require_once("elements/info-modal.php"); ?>

    <script>
    
        function hide(name){
            var menu = document.getElementById(name);
            menu.style.display = "none";
        }
        
        function show(name){
            var menu = document.getElementById(name);
            menu.style.display = "block";
        }
    
    </script>
    
    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/menu.js"></script>
</body>
</html>