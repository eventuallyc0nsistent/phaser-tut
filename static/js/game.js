var game = new Phaser.Game(800, 500, Phaser.AUTO, 'game',
						  {preload: preload, create: create, update: update});
var platforms;
var cursors;
var score = 0;
var scoreText;
var lives;

function preload() {
	game.load.image('sky', 'static/assets/sky.png');
	game.load.image('ground', 'static/assets/platform.png');
	game.load.image('star', 'static/assets/star.png');
	game.load.spritesheet('dude', 'static/assets/dude.png', 32, 48);
	game.load.spritesheet('enemy', 'static/assets/baddie.png', 32, 32);

}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.add.sprite(0, 0, 'sky');

	// platforms
	platforms = game.add.group();
	platforms.enableBody = true;

	var ground = platforms.create(0, game.world.height - 10, 'ground');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;

	var rledge = platforms.create(400, 400, 'ground');
	rledge.body.immovable = true;

	lledge = platforms.create(-150, 250, 'ground');
	lledge.body.immovable = true;

	// player + enemy
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	enemy = game.add.sprite(0, 210, 'enemy');

	game.physics.arcade.enable([player, enemy]);

	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
	
	enemy.body.bounce.y = 0.2;
	enemy.body.gravity.y = 300;
	enemy.body.collideWorldBounds = true;

	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	enemy.animations.add('left', [0, 1], 10, true);
	enemy.animations.add('right', [2, 3], 10, true);

	// stars
	stars = game.add.group();
	stars.enableBody = true;

	for (i=0; i<12; i++){
		var star = stars.create(i*70, 0, 'star');
		star.body.gravity.y = 6;
		star.body.bounce.y = 0.7 + Math.random() * 0.2; 
	}

	
	// move enemy 
	enemy.body.velocity.x = 150;
	enemy.animations.play('right');


	// score
	scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '16px', fill: '#000'});

	// keyboard input
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {

	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(enemy, platforms);
	game.physics.arcade.collide(stars, platforms);

	game.physics.arcade.overlap(player, stars, collectStar, null, this);
	game.physics.arcade.overlap(player, enemy, killPlayer, null, this);

	player.body.velocity.x = 0;

	if(enemy.body.onWall() == true){
		if (enemy.body.blocked.left ==  true){
			enemy.animations.play('right');
			enemy.body.facing = Phaser.RIGHT;
			enemy.body.velocity.x = 150;
		} else{
			enemy.animations.play('left');
			enemy.body.facing = Phaser.LEFT;
			enemy.body.velocity.x = -150;
		}
	}

	if (cursors.left.isDown){
		
		player.body.velocity.x = -150;
		player.animations.play('left');

	} else if (cursors.right.isDown){

		player.body.velocity.x = 150;
		player.animations.play('right');

	} else {

		player.animations.stop();
		player.frame = 4;

	}

	if (cursors.up.isDown && player.body.touching.down){

		player.body.velocity.y = -350;

	}

}

function collectStar(player, star){
	star.kill();

	score += 10;
	scoreText.text = 'Score: ' + score;
}

function killPlayer(player, enemy){
	player.kill();
}