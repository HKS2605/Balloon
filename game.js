let score = 0; // score varaible
let scoreText;

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 800,
    scale: {
        mode: Phaser.Scale.FIT, // Automatically scale the game
        autoCenter: Phaser.Scale.CENTER_BOTH // Center it within the canvas
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    parent: 'gameCanvas',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/bg2.jpg'); // Loading assets here
    this.load.image('blue', 'assets/blue.png');
    this.load.image('blue', 'assets/green.png');
    this.load.image('yellow', 'assets/yellow.png');
    this.load.image('pink', 'assets/pink.png');
    this.load.image('red', 'assets/red.png');
    this.load.audio('popSound', 'assets/pop.mp3');
    this.load.audio('bgm', 'assets/bgm.mp3');
}

function create() {
    this.add.image(0,0, 'sky').setOrigin(0,0); // Display assets
    this.balloons = this.physics.add.group(); // Group for balloons

    // Play background music
    const music = this.sound.add('bgm', {
        loop: true,
        volume: 0.5
    });

    music.play();

    scoreText = this.add.text(16, 16, 'Score: 0', {    // adding the score card on the screen
        fontFamily: '"Roboto", sans-serif', 
        fontSize: '32px',
        fill: '#fff'
    });

    this.time.addEvent({   // spawning the balloon
        delay: 500, 
        callback: spawnBalloon,
        callbackScope: this,
        loop: true
    });
}
    
function update() {
    //further game logic 
}

function spawnBalloon() {
    const x = Phaser.Math.Between(10, 390); // Random x-position
    const ballonColors = ['red','pink','blue','yellow','red'];
    const randomColor = Phaser.Utils.Array.GetRandom(ballonColors);
    const balloon = this.balloons.create(x, 840, randomColor); // Spawn at bottom
    balloon.setVelocityY(-100); // Move up

    // Makeing the balloon interactive and adding a click event
    balloon.setInteractive();
    balloon.on('pointerdown', () => {
        balloonPop.call(this, balloon); // Call a function to handle the pop
    });
}

function balloonPop(balloon) {
    score += 1;
    scoreText.setText('Score: ' + score); // Update score display

    balloon.destroy(); // Destroy the balloon
    this.sound.play('popSound');
}
