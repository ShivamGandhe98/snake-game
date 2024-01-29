import React, { useRef, useState, useEffect } from 'react';

const GamePieces = ({score, setScore, onGameOver}) => {

    const canvasRef = useRef();
    const SNAKE_SPEED = 10;
    const [apple, setApple] = useState({x: 180, y:100});
    const [poisonFruit, setPoisonFruit] = useState({x: 360, y: 200});
    const [snake, setSnake] = useState([{x: 100, y:50}, {x:95, y:50}]);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const drawSnake = () => {
            snake.forEach((snakePark) => {
                ctx.beginPath();
                ctx.roundRect(snakePark.x, snakePark.y, 20, 20, 5);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.closePath();
            })
        }

        const drawApple = () => {
            ctx.beginPath();
                ctx.roundRect(apple.x, apple.y, 20, 20, 10);
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.closePath();
        }

        const drawPoisonFruit = () => {
            ctx.beginPath();
                ctx.roundRect(poisonFruit.x, poisonFruit.y, 20, 20, 10);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.closePath();
        }

        const moveSnake = () => {
            if(direction){
                setSnake((prevSnake) => {
                    const newSnake = [...prevSnake];
                    const snakeHead = {x: newSnake[0].x, y: newSnake[0].y};

                    for(let i = newSnake.length - 1; i>0; i--){
                        newSnake[i].x = newSnake[i-1].x;
                        newSnake[i].y = newSnake[i-1].y;
                    }

                    switch(direction) {
                        case "right":
                            snakeHead.x += SNAKE_SPEED;
                            break;
                        case "left":
                            snakeHead.x -= SNAKE_SPEED;
                            break;
                        case "up":
                            snakeHead.y -= SNAKE_SPEED;
                            break;
                        case "down":
                            snakeHead.y += SNAKE_SPEED;
                            break;
                        default:
                            break;
                    }

                    newSnake[0] = snakeHead;
                    handleAppleCollision(newSnake);
                    handleWallCollision(snakeHead);
                    handleBodyCollision(newSnake);
                    handlePoisonFruitCollision(newSnake);
                    return newSnake;
                });
            }
        };

        const handleWallCollision = (snakeHead) => {
            if(snakeHead.x + SNAKE_SPEED > canvas.width || snakeHead.x + SNAKE_SPEED < 0){
                onGameOver("wall");
            }
            if(snakeHead.y + SNAKE_SPEED > canvas.height || snakeHead.y + SNAKE_SPEED < 0){
                onGameOver("wall");
            }
        }

        const handleBodyCollision = (newSnake) => {
            const snakeHead = newSnake[0];
            for(let i = 1; i< newSnake.length; i++){
                if(snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y){
                    onGameOver("self");
                }
            }
        }

        const handleAppleCollision = (newSnake) => {

            const snakeHead = newSnake[0];

            if(snakeHead.x === apple.x && snakeHead.y === apple.y) {
                setScore(score++);
                setApple({
                    x: 
                    Math.floor((Math.random() * canvas.width) / SNAKE_SPEED) * SNAKE_SPEED,
                    y: 
                    Math.floor((Math.random() * canvas.height) / SNAKE_SPEED) * SNAKE_SPEED,
                })
                newSnake.push({
                    x: newSnake[newSnake.length - 1].x,
                    y: newSnake[newSnake.length - 1].y
                })
                setPoisonFruit({
                    x: 
                    Math.floor((Math.random() * canvas.width) / SNAKE_SPEED) * SNAKE_SPEED,
                    y: 
                    Math.floor((Math.random() * canvas.height) / SNAKE_SPEED) * SNAKE_SPEED,
                })
            }
        }

        const handlePoisonFruitCollision = (newSnake) => {
            const snakeHead = newSnake[0];
            if(snakeHead.x === poisonFruit.x && snakeHead.y === poisonFruit.y){
                onGameOver("poison");
            }
        }

        const handleKeyPress = (e) => {
            switch(e.key) {
                case "ArrowRight":
                    setDirection("right");
                    break;
                case "ArrowLeft":
                    setDirection("left");
                    break;
                case "ArrowUp":
                    setDirection("up");
                    break;
                case "ArrowDown":
                    setDirection("down");
                    break;
                default:
                    break;
            }
        }
        
        window.addEventListener("keydown", handleKeyPress);

        const interval = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawSnake();
            drawApple();
            drawPoisonFruit();
            moveSnake();
        }, 100)
        
        return () => {
            clearInterval(interval);
        };
    }, [snake, direction])
    
    return (
        <div>
            <canvas className="gameCanvas" ref={canvasRef} width={750} height={420} />
        </div>
    )
}

export default GamePieces;
