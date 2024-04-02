document.addEventListener('DOMContentLoaded', function() {
    // Background scrolling speed
    let move_speed = 3;

    // Gravity constant value
    let gravity = 0.5;

    // Getting reference to the bird element
    let bird = document.querySelector('.bird');

    // Getting reference to the score element
    let scoreVal = document.querySelector('.score_val');
    let message = document.querySelector('.message');
    let scoreTitle = document.querySelector('.score_title');

    // Setting initial game state to start
    let gameState = 'Start';

    // Add an eventlistener for key presses
    document.addEventListener('keydown', function(e) {
        // Start the game if Enter key is pressed
        if (e.key === 'Enter' && gameState !== 'Play') {
            resetGame();
            play();
        }
    });

    function resetGame() {
        document.querySelectorAll('.pipe_sprite').forEach(function(element) {
            element.remove();
        });
        bird.style.top = '40vh';
        gameState = 'Play';
        message.innerHTML = '';
        scoreTitle.innerHTML = 'Score : ';
        scoreVal.innerHTML = '0';
    }

    function play() {
        function move() {
            // Detect if game has ended
            if (gameState !== 'Play') return;

            // Getting reference to all the pipe elements
            let pipeSprites = document.querySelectorAll('.pipe_sprite');

            pipeSprites.forEach(function(element) {
                let pipeSpriteProps = element.getBoundingClientRect();
                let birdProps = bird.getBoundingClientRect();

                // Delete the pipes if they have moved out of the screen hence saving memory
                if (pipeSpriteProps.right <= 0) {
                    element.remove();
                } else {
                    // Collision detection with bird and pipes
                    if (birdProps.left < pipeSpriteProps.left + pipeSpriteProps.width &&
                        birdProps.left + birdProps.width > pipeSpriteProps.left &&
                        birdProps.top < pipeSpriteProps.top + pipeSpriteProps.height &&
                        birdProps.top + birdProps.height > pipeSpriteProps.top) {
                        endGame();
                        return;
                    } else {
                        // Increase the score if player has successfully dodged the pipes
                        if (pipeSpriteProps.right < birdProps.left && element.increaseScore === '1') {
                            scoreVal.innerHTML = +scoreVal.innerHTML + 1;
                        }
                        element.style.left = pipeSpriteProps.left - move_speed + 'px';
                    }
                }
            });

            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);

        let birdDY = 0;

        function applyGravity() {
            if (gameState !== 'Play') return;
            birdDY = birdDY + gravity;

            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowUp' || e.key === ' ') {
                    birdDY = -7.6;
                }
            });

            // Collision detection with bird and window top and bottom
            let birdProps = bird.getBoundingClientRect();
            if (birdProps.top <= 0 || birdProps.bottom >= window.innerHeight) {
                endGame();
                return;
            }

            bird.style.top = birdProps.top + birdDY + 'px';
            requestAnimationFrame(applyGravity);
        }
        requestAnimationFrame(applyGravity);

        let pipeSeparation = 0;
        let pipeGap = 35; // Constant value for the gap between two pipes

        function createPipe() {
            if (gameState !== 'Play') return;

            // Create another set of pipes if distance between two pipe has exceeded a predefined value
            if (pipeSeparation > 115) {
                pipeSeparation = 0;

                // Calculate random position of pipes on y axis
                let pipePos = Math.floor(Math.random() * 43) + 8;
                let pipeSpriteInv = createPipeSprite(pipePos - 70);
                let pipeSprite = createPipeSprite(pipePos + pipeGap);

                document.body.appendChild(pipeSpriteInv);
                document.body.appendChild(pipeSprite);
            }
            pipeSeparation++;
            requestAnimationFrame(createPipe);
        }
        requestAnimationFrame(createPipe);
    }

    function createPipeSprite(topPosition) {
        let pipeSprite = document.createElement('div');
        pipeSprite.className = 'pipe_sprite';
        pipeSprite.style.top = topPosition + 'vh';
        pipeSprite.style.left = '100vw';
        pipeSprite.increaseScore = '1';
        return pipeSprite;
    }

    function endGame() {
        gameState = 'End';
        message.innerHTML = 'Press Enter To Restart';
        message.style.left = '28vw';
    }
});
