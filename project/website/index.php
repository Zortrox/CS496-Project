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


            <!--             Main Menu      -->

            <div class="col-md-4 well" id="main-menu">
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
                    <button type="button" id="games-btn" class="btn menu-btn add-margin-vertical btn-primary center-block"><i class="fa fa-gamepad" aria-hidden="true"></i> Game List</button>
                </div>
                
                <div class="col-row">
                    <button type="button" id="info-btn" data-toggle="modal" data-target="#info-modal" class="btn menu-btn add-margin-vertical btn-info center-block"><i class="fa fa-info-circle" aria-hidden="true"></i> Info</button>
                </div>
            </div>

            <!--                Host Game        -->

            <div class="col-md-4 well" id="host-menu" style="display:none">
                <div class="col-row" style="width: 100%">
                    <button style="margin-bottom: 5vh;" type="button" class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('host-menu')"><i class=" fa fa-reply" aria-hidden="true"></i></button>
                    <h1 style="margin-top: 0px;" class="text-center shake" >Host a Game</h1>

                    <div class="row">
                        <div class="col-sm-4"><button type="button" class="btn center-block menu-btn main-menu-btn btn-primary">Game 1</button></div>
                    </div>                    
                </div>
            </div>





            <!--                Join Game        -->

            <div class="col-md-4 well" id="join-menu" style="display:none">
                <div class="col-row" style="width: 100%">
                    <button style="margin: 0px;" type="button" class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('join-menu')"><i class="fa fa-reply" aria-hidden="true"></i></button>
                    <h1 style="margin-bottom: 5vh;" class="text-center shake">Join a Game</h1>
                    
                    <form>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="glyphicon glyphicon-circle-arrow-right"></i></span>
                            <input id="game-code" type="text" class="form-control" name="code" placeholder="Enter Code">
                        </div>
                    </form>
                    
                    <button style='margin-top: 2vh' type="button" class="btn center-block menu-btn main-menu-btn btn-primary" onclick="hide('join-menu'); show('loading-menu')"><i class="glyphicon glyphicon-globe" aria-hidden="true"></i> Find Game</button>
                    
                </div>
            </div>
            
            
            
            <!--          Game Menu            -->
        
            <div id="game-menu" class="carousel slide col-md-12" data-interval="0" style="display:none">
                
                <button style="margin: 0px;" type="button" class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('game-menu')"><i class="fa fa-reply" aria-hidden="true"></i></button>
                
                <ol class="carousel-indicators">
                    <?php
                        $class = "class='active'";
                        $gameList = fopen("game-list.txt", "r");
                        $gameString = file_get_contents("game-info.json");
                        $game_json = (array) json_decode($gameString, true);
                    
                        for($i = 0; $i < sizeof($game_json); $i++){
                            echo "<li data-target='#game-menu' data-slide-to='$i' $class></li>";
                            $class = "";
                        }
                    ?>
                </ol>

                <div class="carousel-inner" role="listbox">
                    
                    <?php
                        $class = "active";
                    
                        foreach($game_json as $game){
                            echo "
                            <div class='carousel-game well item $class'>
                                <h2 class='title' style='margin-left: 5vh; margin-bottom: 3vh'>".$game['name']."</h2>                           
                                
                                <div class='game-page gallery col-md-6'>";
                                
                                foreach($game['gallery'] as $source){
                                    echo "<img class='gallery-image' src='$source'>";
                                }
                                    
                            echo "
                                </div>
                                
                                <div class='col-md-6'>
                                    <div class='game-page description col-md-12'>
                                        <h4>Description</h4>
                                        <p>".$game['description']."</p>
                                    </div>

                                    <div class='game-page controls col-md-12'>
                                        <h4>Controls</h4>
                                        <p>".$game['controls']."</p>
                                    </div>
                                </div>
                            </div>
                            ";
                            
                            $class = "";
                        }
                    ?>
                </div>                
            </div>
            
            
            <!--                Loading Screen        -->

            <div class="col-md-4 well" id="loading-menu" style="display:none">
                <div class="loader center-block"></div>
            </div>

        </div>
    </div>

    <?php require_once("elements/info-modal.php"); ?>

    <script src="js/jquery-3.1.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/menu.js"></script>
</body>
</html>