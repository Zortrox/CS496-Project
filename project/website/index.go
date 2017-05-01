<!DOCTYPE html>
<html lang="en">
<head>

    
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>CS496 Project</title>


<link rel="stylesheet" href="/static/css/font-awesome.min.css">

<link href="/static/css/bootstrap.min.css" rel="stylesheet">

<link href="/static/css/main.css" rel="stylesheet">


</head>
<body>

    <div class="container-fluid">
        <div class="menu-container">


            

            <div class="col-md-4 well" id="main-menu">
                <div class="col-row">
                    <h1 class="text-center shake">
                        <i class="fa fa-child" aria-hidden="true"></i> Party Screen <i class="fa fa-child" aria-hidden="true"></i>
                    </h1>
                </div>
                <div class="col-row">
                    <button type="button" id="host-btn"  onclick="show('host-menu'); hide('main-menu')" class="btn menu-btn add-margin-vertical btn-primary center-block"><i class="fa fa-tv" aria-hidden="true"></i> Host Game</button>
                </div>

                <div class="col-row">
                    <button type="button" id="join-btn" onclick="show('join-menu'); hide('main-menu')" class="btn menu-btn add-margin-vertical btn-primary center-block"><i class="fa fa-user-plus" aria-hidden="true"></i> Join Game</button>
                </div>

                <div class="col-row">
                    <button type="button" id="games-btn" class="btn menu-btn add-margin-vertical btn-primary center-block"><i class="fa fa-gamepad" aria-hidden="true"></i><a href="game-list.txt" style="text-decoration: none; color: white" download="Developer Kit.zip">Developer Kit</button>
                </div>

                <div class="col-row">
                    <button type="button" id="info-btn" data-toggle="modal" data-target="#info-modal" class="btn menu-btn add-margin-vertical btn-info center-block"><i class="fa fa-info-circle" aria-hidden="true"></i> Info</button>
                </div>
            </div>

            

            <div class="col-md-8 well" id="host-menu" style="display:none">

                
<div class="col-row" style="width: 100%">
    <div class="col-md-12">
    <button style="margin: 0px;" type="button" class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('host-menu')"><i class=" fa fa-reply" aria-hidden="true"></i></button>
    <h1 style="margin-top: 0px;" class="text-center shake" >Host a Game</h1>




        <div class="col-md-12">

            <div class="col-md-4">

                <div class="col-row">
                    <img src="/static/imgs/pacman.png" class="gamesnapshot center-block">
                </div>
                <div class="col-row">
                    <h3 class="text-center">Invalid Game</h3>
                    <p>
                        This is a invalid game. If you try to request a game the does not exist you will get an error.
                    </p>
                    <button onclick="createGame('game1')" class="btn btn-block btn-primary">Host</button>
                </div>

            </div>
            <div class="col-md-4">

                <div class="col-row">
                    <img src="/static/imgs/pacman.png" class="gamesnapshot center-block">
                </div>
                <div class="col-row">
                    <h3 class="text-center">Bomber Boys</h3>
                    <p>
                        Bomber Boys. Author: Connor Brooks
                    </p>
                    <button onclick="createGame('bomb')" class="btn btn-block btn-primary">Host</button>
                </div>

            </div>
            <div class="col-md-4">

                <div class="col-row">
                    <img src="/static/imgs/pacman.png" class="gamesnapshot center-block">
                </div>
                <div class="col-row">
                    <h3 class="text-center">Chat Game</h3>
                    <p>
                        This is a test application to makes sure the web sockets are working. It's just a chat room.
                    </p>
                    <button onclick="createGame('chat')" class="btn btn-block btn-primary">Host</button>
                </div>

            </div>



        </div>


        <div class="col-md-12">

            <div class="col-md-4">

                <div class="col-row">
                    <img src="/static/imgs/pacman.png" class="gamesnapshot center-block">
                </div>
                <div class="col-row">
                    <h3 class="text-center">Roll N Rock Racing</h3>
                    <p>
                        This is a racing game.
                    </p>
                    <button onclick="createGame('race')" class="btn btn-block btn-primary">Host</button>
                </div>

            </div>
            <div class="col-md-4">

                <div class="col-row">
                    <img src="/static/imgs/pacman.png" class="gamesnapshot center-block">
                </div>
                <div class="col-row">
                    <h3 class="text-center">Not Pong Shooter</h3>
                    <p>
                        This is a simple shooting game that can play up to four players. Author: Mathew Clark
                    </p>
                    <button onclick="createGame('shooter')" class="btn btn-block btn-primary">Host</button>
                </div>

            </div>
            <div class="col-md-4">

                <div class="col-row">
                    <img src="/static/imgs/pacman.png" class="gamesnapshot center-block">
                </div>
                <div class="col-row">
                    <h3 class="text-center">Fake Game</h3>
                    <p>
                        This is a test application to makes sure the web sockets are working. It's just a chat room.
                    </p>
                    <button onclick="createGame('INALIDISISISI')" class="btn btn-block btn-primary">Host</button>
                </div>

            </div>



        </div>






    </div>
</div>


            </div>





            
            <div class="col-md-4 well" id="join-menu" style="display:none">
                
<div class="col-row" style="width: 100%">
    <button style="margin: 0px;" type="button"  class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('join-menu')"><i class="fa fa-reply" aria-hidden="true"></i></button>
    <h1 style="margin-top: 0px;" class="text-center shake" >Join a Game</h1>

    <form id="join-form">
        <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
            <input id="user-name" type="text" class="form-control" name="name" placeholder="Enter Name">
        </div>
        <br>
        <div class="input-group">
            <span class="input-group-addon"><i class="glyphicon glyphicon-circle-arrow-right"></i></span>
            <input id="room-code" type="text" class="form-control" name="room" placeholder="Enter Code">
        </div>

        <button style="margin-top: 20px" type="submit" class="btn center-block btn-primary"><i class="glyphicon glyphicon-globe" aria-hidden="true"></i> Join Game</button>

    </form>
</div>

            </div>



            
            <div id="game-menu" class="carousel slide" data-interval="0" style="display:none; width: 80%">
                
<button style="margin: 0px;" type="button" class="btn menu-btn main-menu-btn btn-primary" onclick="show('main-menu'); hide('game-menu')"><i class="fa fa-reply" aria-hidden="true"></i></button>

<ol class="carousel-indicators">


</ol>

<div class="carousel-inner" role="listbox">



</div>

            </div>


            

            <div class="col-md-4 well" id="loading-menu" style="display:none">
                <div class="loader center-block"></div>
            </div>

        </div>
    </div>

    
<div class="modal fade" id="info-modal" tabindex="-1" role="dialog" aria-labelledby="info-modalLabel">
    <div class="modal-dialog" role="document" style="width:60%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="info-modalLabel">Information</h4>
            </div>
            <div class="modal-body">
                <h2>What is Party Screen?</h2>
                <p>
                    Party Screen allows you to play online multiplayer games, using you smartphone as a controller, while still viewing the game on a separate screen. You can play with your friends or join a random game.
                </p>

                <h2>How to Play</h2>
                <p>
                    In order to host a game, visit this site with the device on which you want to display the game. Choose the host game button and then choose from our selection of games. If you wish to resrict the game to your friends, select the private option. You will be given a code to allow others to join. Select start to begin the game. To join a game, visit the site on your smartphone and select the join button. If you wish to join a specific game, enter the host's code in the space provided. To join a random game, select the game you wish to play and click search. When you are connected to a game, your phone will display the controller for that game. Click on the games button from the main menu to see a desciption of each of the games and learn how to play. Have fun!
                </p>

                <h2>Credits</h2>
                <ul>
                    <li>Christopher Goulet</li>
                    <li>Connor Brooks</li>
                    <li>Matthew Clark</li>
                    <li>Jared Prince</li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>



    <script src="/static/js/jquery-3.1.1.min.js"></script>
    <script src="/static/js/bootstrap.min.js"></script>
    <script src="/static/js/menu.js"></script>
</body>
</html>