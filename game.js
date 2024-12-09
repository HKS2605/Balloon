let score = 0; // score varaible
let scoreText;

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 780,
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

// creating a random and well spaced value for spawning balloons
let lastX = null; 
const minDistance = 50;

function getRandomX() {
    let x;
    do {
        x = Phaser.Math.Between(10, 390); 
    } while (lastX !== null && Math.abs(x - lastX) < minDistance); 

    lastX = x; 
    return x;
}


function preload() {
    this.load.image('bg2', 'assets/bg2.jpg'); // Loading assets here
    this.load.image('bg3', 'assets/bg3.jpg'); 
    this.load.image('bg4', 'assets/bg4.jpg'); 
    this.load.image('blue', 'assets/blue.png');
    this.load.image('green', 'assets/green.png');
    this.load.image('yellow', 'assets/yellow.png');
    this.load.image('pink', 'assets/pink.png');
    this.load.image('red', 'assets/red.png');
    this.load.image('orange', 'assets/orange.png');
    this.load.image('purple', 'assets/purple.png');
    this.load.audio('popSound', 'assets/pop.mp3');
    this.load.audio('bgm', 'assets/bgm.mp3');
}


function create() {
    this.currentBackground = this.add.image(0,0, 'bg2').setOrigin(0,0).setDepth(0); // Display assets
    this.balloons = this.physics.add.group(); // Group for balloons

    this.backgrounds = ['bg1','bg2','bg3','bg4'];
    this.currentIndex = 0;

    // Play background music
    const music = this.sound.add('bgm', {
        loop: true,
        volume: 1
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

    this.time.addEvent({  //changing the background
        delay: 180000, 
        callback: changeBackground,
        callbackScope: this,
        loop: true
    });
}

    
function update() {
    //further game logic 
}


function spawnBalloon() {
    const x = getRandomX(); // Random x-position
    const ballonColors = ['red','pink','blue','yellow','green','orange','purple'];
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


function changeBackground() {
    // Determine the next background index
    this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;
    const nextBackgroundKey = this.backgrounds[this.currentIndex];

    const nextBackground = this.add.image(0,0, nextBackgroundKey).setOrigin(0,0).setAlpha(0).setDepth(-1);
    
    console.log('Switching to:', nextBackgroundKey);

    // Fade out the current background
    this.tweens.add({
        targets: this.currentBackground,
        alpha: 0,
        duration: 1000, // 1 second fade-out
        onComplete: () => {
            //this.currentBackground.destroy(); // Remove the old background
            this.currentBackground = nextBackground; // Set the new background as current
        }
    });

    // Fade in the new background
    this.tweens.add({
        targets: nextBackground,
        alpha: 1,
        duration: 1000 // 1 second fade-in
    });
}
