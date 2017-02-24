<!DOCTYPE html>
<html lang="en">

    <head>
        <title>Pong</title>
    </head>
    
    <body>

    <canvas id="myCanvas" width="600px" height="600px" style="border: 1px solid black"></canvas>

    <script>
        
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        
        var ballRadius = 6;
        var paddleWidth = 15;
        var paddleHeight = 100;
        var paddleSpeed = 3;

        var balls = [
            [canvas.width / 2, canvas.height / 2, -1, "#000000", [0, 0], 0]
        ];
        
        var players = 4;
        
        var corners = [
            [[0, 0], [0, 0], [canvas.width, canvas.height], [canvas.width, 0]],
            [[0, 0], [0, 0], [0, canvas.height], [0, 0]]
        ];
        var maxSpeed = 5;
        
        //color, score, angle, x, y, upButtonPressed, downButtonPressed, upKeyCode, downKeyCode, [xs and ys]
        var paddles;
        
        if (players == 2) {
            paddles = [
                ["#FF0000", 0, 0, 0, 250, false, false, 87, 83, [paddleHeight, paddleWidth]],
                ["#0000FF", 0, 180, 585, 250, false, false, 38, 40, [paddleHeight, paddleWidth]]
            ];
        } else if (players == 4) {
            paddles = [
                ["#FF0000", 0, 0, 0, 250, false, false, 87, 83, [paddleHeight, paddleWidth]],
                ["#0000FF", 0, 180, 585, 250, false, false, 38, 40, [paddleHeight, paddleWidth]],
                ["#00FF00", 0, 90, 250, 0, false, false, 49, 50, [paddleWidth, paddleHeight]],
                ["#FFFF00", 0, 270, 250, 585, false, false, 51, 52, [paddleWidth, paddleHeight]]
            ];
        }
        
        function keyDown(e) {
            for (var i = 0; i < paddles.length; i++) {
                if(e.keyCode == paddles[i][7]){
                    paddles[i][5] = true;
                }
                
                else if(e.keyCode == paddles[i][8]){
                    paddles[i][6] = true;
                }
            }
        }
        
        function keyUp(e) {
            for(var i = 0; i < paddles.length; i++){
                if(e.keyCode == paddles[i][7]){
                    paddles[i][5] = false;
                }
                
                else if(e.keyCode == paddles[i][8]){
                    paddles[i][6] = false;
                }
            }
        }        
        
        function draw(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for(var i = 0; i < balls.length; i++){
                var scored = false;

                if(balls[i][0] > canvas.width - ballRadius) {
                    paddles[1][1]--;
                    scored = true;
                } else if(balls[i][0] < ballRadius) {
                    paddles[0][1]--;
                    scored = true;
                }

                if(balls[i][1] > canvas.height - ballRadius) {
                    paddles[3][1]--;    
                    scored = true;
                } else if(balls[i][1] < ballRadius) {
                    paddles[2][1]--;
                    scored = true;
                }

                if(scored){
                    if(balls[i][2] != -1){
                        paddles[balls[i][2]][1]++;
                    }

                    newBall(i);
                }

                var ballUpdate = computeStepToTarget(i, maxSpeed);
                balls[i][0] = ballUpdate[0];
                balls[i][1] = ballUpdate[1];
            }
            
            drawPaddles();
            drawBalls();
            drawScores();
            
            collisionDetection();
        }
        
        function newBall(i){
            balls[i][2] = -1;
            balls[i][3] = "#000000";
            
            balls[i][0] = canvas.width / 2; 
            balls[i][1] = canvas.height / 2;
            
            var paddle = Math.floor(Math.random() * (players));
           
            if(paddle == 0){
                balls[i][4] = [0, canvas.height / 2];
            } else if(paddle == 1) {
                balls[i][4] = [canvas.width, canvas.height / 2];
            } else if(paddle == 2) {
                balls[i][4] = [canvas.width / 2, 0];
            } else if(paddle == 3) {
                balls[i][4] = [canvas.width / 2, canvas.height];
            }
        }
        
        function deleteBall(i){
            balls.splice(i, 1);
        }
        
        function drawScores(){
            ctx.fillStyle = "#000000";
            ctx.font = "20px Arial";
            ctx.fillText("Score: " + paddles[0][1] + " : " + paddles[1][1] + " : " + paddles[2][1] + " : " + paddles[3][1],10,50);
        }
        
        function drawPaddles(){
            for(var i = 0; i < paddles.length; i++){
                
                if(paddles[i][5]){
                    
                    if(i <= 1){
                        paddles[i][4] -= paddleSpeed;
                    } else{
                        paddles[i][3] -= paddleSpeed;
                    }
                } 
                else if(paddles[i][6]){
                    if(i <= 1){
                        paddles[i][4] += paddleSpeed;
                    } else{
                        paddles[i][3] += paddleSpeed;
                    }
                }
                
                if(paddles[i][4] < 0){
                    paddles[i][4] = 0;
                }
                
                else if(paddles[i][4] + paddles[i][9][0] > canvas.height){
                    paddles[i][4] = canvas.height - paddles[i][9][0];
                }
                
                if(paddles[i][3] < 0){
                    paddles[i][3] = 0;
                }
                
                else if(paddles[i][3] + paddles[i][9][1] > canvas.width){
                    paddles[i][3] = canvas.width - paddles[i][9][1];
                }
                
                //top left
                if(paddles[0][4] < paddleWidth && paddles[2][3] < paddleWidth){
                    if(paddles[0][4] < paddles[2][3]){
                        paddles[2][3] = paddleWidth;
                    } else {
                        paddles[0][4] = paddleWidth;
                    }
                } 
                
                //bottom left
                if(paddles[0][4] + paddleHeight > canvas.height - paddleWidth && paddles[3][3] < paddleWidth){
                    if(canvas.height - (paddles[0][4] + paddleHeight) < paddles[3][3]){
                        paddles[3][3] = paddleWidth;
                    } else {
                        paddles[0][4] = canvas.height - paddleWidth - paddleHeight;
                    }
                }

                //top right
                if(paddles[1][4] < paddleWidth && canvas.width - (paddles[2][3] + paddleHeight) < paddleWidth){
                    if(paddles[1][4] < canvas.width - (paddles[2][3] + paddleHeight)){
                        paddles[2][3] = canvas.width - paddleHeight - paddleWidth;
                    } else {
                        paddles[1][4] = paddleWidth;
                    }
                } 
                
                //bittom right
                if(canvas.height - (paddles[1][4] + paddleHeight) < paddleWidth && canvas.width - (paddles[3][3] + paddleHeight) < paddleWidth){
                    if(canvas.height - (paddles[1][4] + paddleHeight) < canvas.width - (paddles[3][3] + paddleHeight)){
                        paddles[3][3] = canvas.width - paddleHeight - paddleWidth;
                    } else {
                        paddles[1][4] = canvas.height - paddleWidth - paddleHeight;
                    }
                }
                
                ctx.beginPath();
                ctx.rect(paddles[i][3], paddles[i][4], paddles[i][9][1], paddles[i][9][0]);
                ctx.fillStyle = paddles[i][0];
                ctx.fill();
                ctx.closePath();
            }
        }
        
        function drawBalls(){
            for(var i = 0; i < balls.length; i++){
                ctx.beginPath();
                ctx.arc(balls[i][0], balls[i][1], ballRadius, 0, Math.PI*2, false);
                ctx.fillStyle = balls[i][3];
                ctx.fill();
                ctx.strokeStyle = "#000000";
                ctx.stroke();
                ctx.closePath();
            }
        }
        
        function computeStepToTarget(i, length){
            var ratio = length / distance(balls[i][0], balls[i][1], balls[i][4][0], balls[i][4][1]);
            var deltaX = ratio * (balls[i][4][0] - balls[i][0]);
            var deltaY = ratio * (balls[i][4][1] - balls[i][1]);
            
            balls[i][4] = [balls[i][4][0] + deltaX, balls[i][4][1] + deltaY];
            
            return([deltaX + balls[i][0], deltaY + balls[i][1]]);
        }
        
        function collisionDetection() {
            for(var j = 0; j < balls.length; j++){

                var first = -1;

                for(var i = 0; i < paddles.length; i++){
                    if((balls[j][0] - ballRadius > paddles[i][3] && balls[j][0] - ballRadius < paddles[i][3] + paddles[i][9][1] && balls[j][1] > paddles[i][4] && balls[j][1] < paddles[i][4] + paddles[i][9][0]) ||
                       (balls[j][0] + ballRadius > paddles[i][3] && balls[j][0] + ballRadius < paddles[i][3] + paddles[i][9][1] && balls[j][1] > paddles[i][4] && balls[j][1] < paddles[i][4] + paddles[i][9][0]) ||
                       (balls[j][0] > paddles[i][3] && balls[j][0] < paddles[i][3] + paddles[i][9][1] && balls[j][1] + ballRadius > paddles[i][4] && balls[j][1] + ballRadius < paddles[i][4] + paddles[i][9][0]) ||
                       (balls[j][0] > paddles[i][3] && balls[j][0] < paddles[i][3] + paddles[i][9][1] && balls[j][1] - ballRadius > paddles[i][4] && balls[j][1] - ballRadius < paddles[i][4] + paddles[i][9][0])
                      ){

                        if(first != -1){
                            target = corners[first][i];
                        } else if(i == 0){
                            var offset = balls[j][1] - paddles[i][4];
                            var percentage = offset / paddleHeight;
                            
                            if(percentage < 0){
                                percentage = 0;
                            } else if (percentage > 1){
                                percentage = 1;
                            }
                            
                            var angle = percentage * 180;
                            
                            if(angle == 90){
                                balls[j][4] = [balls[j][0] + 50, balls[j][1]];
                            }
                            
                            else if(angle < 90){
                                balls[j][4] = [balls[j][0] + (Math.tan(angle) * offset), balls[j][1] - offset];
                            } else {
                                balls[j][4] = [balls[j][0] + (Math.tan(angle) * offset) , balls[j][1] + offset];
                            }
                            
                        } else if(i == 1) {
                            var offset = balls[j][1] - paddles[i][4];
                            var percentage = offset / paddleHeight;
                            
                            if(percentage < 0){
                                percentage = 0;
                            } else if (percentage > 1){
                                percentage = 1;
                            }
                            
                            var angle = percentage * 180;
                            
                            if(angle == 90){
                                balls[j][4] = [balls[j][0] - 50, balls[j][1]];
                            }
                            
                            else if(angle < 90){
                                balls[j][4] = [balls[j][0] - (Math.tan(angle) * offset), balls[j][1] - offset];
                            } else {
                                balls[j][4] = [balls[j][0] - (Math.tan(angle) * offset) , balls[j][1] + offset];
                            }
                            
                        } else if(i == 2) {
                            var offset = balls[j][0] - paddles[i][3];
                            var percentage = offset / paddleHeight;
                            
                            if(percentage < 0){
                                percentage = 0;
                            } else if (percentage > 1){
                                percentage = 1;
                            }
                            
                            var angle = percentage * 180;
                            
                            if(angle == 90){
                                balls[j][4] = [balls[j][0], balls[j][1] + 50];
                            }
                            
                            else if(angle < 90){
                                balls[j][4] = [balls[j][0] - offset, balls[j][1] + (Math.tan(angle) * offset)];
                            } else {
                                balls[j][4] = [balls[j][0] + offset, balls[j][1] + (Math.tan(angle) * offset)];
                            }

                        } else if(i == 3) {
                            var offset = balls[j][0] - paddles[i][3];
                            var percentage = offset / paddleHeight;
                            
                            if(percentage < 0){
                                percentage = 0;
                            } else if (percentage > 1){
                                percentage = 1;
                            }
                            
                            var angle = percentage * 180;
                            
                            if(angle == 90){
                                balls[j][4] = [balls[j][0], balls[j][1] -   q 50];
                            }
                            
                            else if(angle < 90){
                                balls[j][4] = [balls[j][0] - offset, balls[j][1] - (Math.tan(angle) * offset)];
                            } else {
                                balls[j][4] = [balls[j][0] + offset, balls[j][1] - (Math.tan(angle) * offset)];
                            }
                        }

                        balls[j][3] = paddles[i][0];
                        balls[j][2] = i;
                        balls[j][5]++;
                    }
                }
            }
        }
        
        function distance(x1, y1, x2, y2){
            return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
        }
        
        setInterval(draw, 10);
        document.addEventListener("keydown", keyDown, false);
        document.addEventListener("keyup", keyUp, false);
        
    </script>

    </body>
    
</html>