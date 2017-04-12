var SeaFight = {

	init: function(width, height) {
		var canvas = $("<canvas width='"+width+"' height='"+height+"'></canvas>");
		canvas.appendTo("body");

		SeaFight.ctx = canvas.get(0).getContext("2d");
		SeaFight.ctx.font = "30px Arial";
		SeaFight.ctx.textAlign = "center";

		var seed = 5*height/6;
		SeaFight.hillTops = new Array();
		for (var i = 0; i < width; i++) {
			SeaFight.hillTops.push(seed);
			var x = SeaFight.rnd(seed);
			if(x < seed/4) {
				if(--seed < 2*height/3) {
					seed = 2*height/3;
				}
			} else if(x > 3*seed/4) {
				if(++seed > height-1) {
					seed = height-1;
				}
			}
		}

		SeaFight.width = width;
		SeaFight.height = height;
		SeaFight.dc = new Array(SeaFight.MAX_DC);
		SeaFight.torp = new Array(SeaFight.MAX_TORP);
		SeaFight.explosion = null;
		SeaFight.msg = "";
		SeaFight.score = 0;
		SeaFight.hiScore = 0;

		if(SeaFight.supports_html5_storage()) {
			var temp = localStorage.getItem("hiScore");
			if(temp != undefined) {
				SeaFight.hiScore = temp;
			}
		}

		SeaFight.lives = 4;
		window.keydown = {};

		function keyName(event) {
			return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
		}

		$(document).bind("keydown", function(event) {
			keydown[keyName(event)] = true;
		});

		$(document).bind("keyup", function(event) {
			keydown[keyName(event)] = false;
		});

		SeaFight.imgTitle = new Image();
		SeaFight.imgTitle.src = "images/title.png";

		SeaFight.imgSky = new Image();
		SeaFight.imgSky.src = "images/sky.png";

		SeaFight.imgMoon = new Image();
		SeaFight.imgMoon.src = "images/moon.png";

		SeaFight.imgShipLeft = new Image();
		SeaFight.imgShipLeft.src = "images/shipLeft.png";

		SeaFight.imgShipRight = new Image();
		SeaFight.imgShipRight.src = "images/shipRight.png";

		SeaFight.imgSubLeft = new Image();
		SeaFight.imgSubLeft.src = "images/subLeft.png";

		SeaFight.imgSubRight = new Image();
		SeaFight.imgSubRight.src = "images/subRight.png";

		SeaFight.imgExplosion = new Array();
		for (var i = 0; i < 17; i++) {
			var image = new Image();
			image.src = "images/ex"+i+".png";
			SeaFight.imgExplosion.push(image);
		}

		SeaFight.imgTorpedo = new Image();
		SeaFight.imgTorpedo.src = "images/torpedo.png";

		SeaFight.imgDC = new Image();
		SeaFight.imgDC.src = "images/dc.png";

		SeaFight.audBombLoaded = false;
		SeaFight.audBomb = document.createElement("audio");
		SeaFight.audBomb.onloadeddata = new function() { 
			SeaFight.audBombLoaded = true 
		};

		SeaFight.audBomb.src = (navigator.userAgent.indexOf("MSIE") == -1) ? "audio/TorpedoExplosion.wav" : "audio/TorpedoExplosion.mp3";
		SeaFight.state = SeaFight.STATE_INIT;

	},

	update: function() {
		if (SeaFight.state == SeaFight.STATE_INIT) {
			return;
		}

		if((SeaFight.state == SeaFight.STATE_TITLE || SeaFight.state == SeaFight.STATE_WINLOSE || 
			SeaFight.state == SeaFight.STATE_RESTART) && keydown.return) {
			if(SeaFight.state == SeaFight.STATE_RESTART) {
				SeaFight.score = 0;
				SeaFight.lives = 4;
			}
			SeaFight.ship = new SeaFight.makeShip(SeaFight.width/2, SeaFight.height/3, 0, SeaFight.width-1);
			SeaFight.sub = new SeaFight.makeSub(
				SeaFight.rnd(2) == 0 ? -50+SeaFight.rnd(30) : SeaFight.width+SeaFight.rnd(100),
				2*SeaFight.height/3-SeaFight.rnd(SeaFight.hight/6),
				-100,
				SeaFight.width+100
			);
			SeaFight.state = SeaFight.STATE_PLAY;

		}

		if(SeaFight.state != SeaFight.STATE_PLAY) {
			return;
		}

			if(SeaFight.explosion != null) {
				if(SeaFight.explosion.isShip) {
					SeaFight.sub.move();
				}

				for (var i = 0; i < SeaFight.MAX_DC; i++) {
					if(SeaFight.dc[i] != null) {
						if(!SeaFight.dc[i].move()) {
							SeaFight.dc[i] = null;
						}
					}
				}

				for (var i = 0; i < SeaFight.MAX_TORP; i++) {
					if(SeaFight.torp[i] != null) {
						if(!SeaFight.torp[i].move()) {
							SeaFight.torp[i] = null;
						}
					}
				}

				if(!SeaFight.explosion.advance()) {
					SeaFight.ship = null;
					SeaFight.sub = null;
					for (var i = 0; i < SeaFight.MAX_DC; i++) {
						SeaFight.dc[i] = null;
					}
					for (var i = 0; i < SeaFight.MAX_TORP; i++) {
						SeaFight.torp[i] = null;
					}
					SeaFight.state = SeaFight.STATE_WINLOSE;
					if(SeaFight.explosion.isShip) {
						SeaFight.lives--;
						if(SeaFight.lives == 0) {
							SeaFight.state = SeaFight.STATE_RESTART;
							SeaFight.msg = "Game over! Press ENTER to play again";
						}
					} else {
						SeaFight.score += 100;
						if(SeaFight.score > SeaFight.hiScore) {
							SeaFight.hiScore = SeaFight.score;
							if(SeaFight.supports_html5_storage()) {
								localStorage.setItem("hiScore", SeaFight.hiScore);
							}
						}	
					}
					SeaFight.explosion = null;
				}

				return;
			}

		if(keydown.left) {
			SeaFight.ship.moveLeft();
		}

		if(keydown.right) {
			SeaFight.ship.moveRight();
		}

		if(keydown.space) {
			for (var i = 0; i < SeaFight.MAX_DC; i++) {
				if(SeaFight.dc[i] == null) {
					var bound = SeaFight.hillTops[SeaFight.ship.x];
					SeaFight.dc[i] = new SeaFight.makeDepthCharge(bound);
					SeaFight.dc[i].setLocation(SeaFight.ship.x, SeaFight.ship.y);
					break;
				}
				keydown.space = false;
			}
		}

		SeaFight.sub.move();

		if(SeaFight.sub.x > 0 && SeaFight.sub.x < SeaFight.width && SeaFight.rnd(15) == 1) {
			for (var i = 0; i < SeaFight.MAX_TORP; i++) {
				if(SeaFight.torp[i] == null) {
					SeaFight.torp[i] = new SeaFight.makeTorpedo(SeaFight.height/3);
					SeaFight.torp[i].setLocation(SeaFight.sub.x, SeaFight.sub.y - SeaFight.imgTorpedo.height);
					break;
				}
			}
		}

		for (var i = 0; i < SeaFight.MAX_DC; i++) {
			if(SeaFight.dc[i] != null) {
				if(!SeaFight.dc[i].move()) {
					SeaFight.dc[i] = null;
				} else {
					if(SeaFight.intersects(SeaFight.dc[i].getBBox(), SeaFight.sub.getBBox())) {
						SeaFight.explosion = new SeaFight.makeExplosion(false);
						SeaFight.explosion.setLocation(SeaFight.dc[i].x, SeaFight.dc[i].y);
						SeaFight.msg = "You win! Press ENTER to keep plaining";
						SeaFight.dc[i] = null;
						return;
					}
				}
			}
		}

		for (var i = 0; i < SeaFight.MAX_TORP; i++) {
			if(SeaFight.torp[i] != null) {
				if(!SeaFight.torp[i].move()) {
					SeaFight.torp[i] = null;
				} else {
					if(SeaFight.intersects(SeaFight.torp[i].getBBox(), SeaFight.ship.getBBox())) {
						SeaFight.explosion = new SeaFight.makeExplosion(true);
						SeaFight.explosion.setLocation(SeaFight.torp[i].x, SeaFight.torp[i].y);
						SeaFight.msg = "You lose! Press ENTER to keep plaining";
						SeaFight.torp[i] = null;
						return;
					}
				}
			}
		}
		
	},

	draw: function() {
		if(SeaFight.state == SeaFight.STATE_INIT) {
			if(!SeaFight.allResourcesLoaded()) {
				SeaFight.ctx.fillStyle = "#000";
				SeaFight.ctx.fillRect(0, 0, SeaFight.width, SeaFight.height);
				SeaFight.ctx.fillStyle = "#fff";
				SeaFight.ctx.fillText("Initializing", SeaFight.width/2, SeaFight.height/2);
				return;
			} else {
				SeaFight.state = SeaFight.STATE_TITLE;
			}
		}

		if(SeaFight.state == SeaFight.STATE_TITLE) {
			SeaFight.ctx.drawImage(SeaFight.imgTitle, 0, 0);
			return;
		}

		SeaFight.ctx.drawImage(SeaFight.imgSky, 0, 0);

		SeaFight.ctx.fillStyle = "#404040";
		SeaFight.ctx.fillRect(0, SeaFight.height/3, SeaFight.width, 2*SeaFight.height/3);

		SeaFight.ctx.drawImage(SeaFight.imgMoon, SeaFight.width-65, 25);

		SeaFight.ctx.strokeStyle = "rgb(255, 102, 0)";

		for (var i = 0; i < SeaFight.width; i++) {
			SeaFight.ctx.beginPath();
			SeaFight.ctx.moveTo(i, SeaFight.hillTops[i]);
			SeaFight.ctx.lineTo(i, SeaFight.height);
			SeaFight.ctx.stroke();
		}

		for (var i = 0; i < SeaFight.MAX_DC; i++) {
			if(SeaFight.dc[i] != null) {
				SeaFight.dc[i].draw();
			}
		}

		for (var i = 0; i < SeaFight.MAX_TORP; i++) {
			if(SeaFight.torp[i] != null) {
				SeaFight.torp[i].draw();
			}
		}

		if((SeaFight.ship != null && SeaFight.explosion == null) || 
			(SeaFight.explosion != null && !SeaFight.ship.exploded)) {
			SeaFight.ship.draw();
		}

		if((SeaFight.sub != null && SeaFight.explosion == null) || 
			(SeaFight.explosion != null && !SeaFight.sub.exploded)) {
			SeaFight.sub.draw();
		}

		if(SeaFight.explosion != null) {
			SeaFight.explosion.draw();
		}

		SeaFight.ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
		SeaFight.ctx.fillRect(0, SeaFight.height/3, SeaFight.width, SeaFight.height);

		SeaFight.ctx.fillStyle = "#fff";
		var align = SeaFight.ctx.textAlign;
		SeaFight.ctx.textAlign = "left";
		SeaFight.ctx.fillText("Score: "+SeaFight.score+"("+SeaFight.hiScore+")", 10, 45);
		SeaFight.ctx.textAlign = align;

		for (var i = 0; i < SeaFight.lives-1; i++) {
			var x = SeaFight.width-(i+1)*(SeaFight.imgShipLeft.width+10);
			var y = SeaFight.height-SeaFight.imgShipLeft.height;
			SeaFight.ctx.drawImage(SeaFight.imgShipLeft, x, y);
		}

		if(SeaFight.state == SeaFight.STATE_WINLOSE || SeaFight.state == SeaFight.STATE_RESTART) {
			SeaFight.ctx.fillStyle = "#fff";
			SeaFight.ctx.fillText(SeaFight.msg, SeaFight.width/2, SeaFight.height/2);
		}

	},

	MAX_DC: 2, MAX_TORP: 15, STATE_INIT: 0, STATE_TITLE: 1, STATE_PLAY: 2, STATE_WINLOSE: 3, STATE_RESTART: 4,

	allResourcesLoaded: function() {
		var status = SeaFight.imgTitle.complete && SeaFight.imgSky.complete && SeaFight.imgMoon.complete &&
			SeaFight.imgShipLeft.complete && SeaFight.imgSubRight.complete && SeaFight.imgSubLeft.complete &&
			SeaFight.imgSubRight.complete;
			for (var i = 0; i < SeaFight.imgExplosion.length; i++) {
				status = status && SeaFight.imgExplosion[i].complete;
			}
			status = status && SeaFight.audBombLoaded;
			return status;
	},

	intersects: function(r1, r2) {
		return !(
			r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top
		);
	},

	makeDepthCharge: function(bound) {
		this.bound =  bound;
		this.bbox = {left: 0, top: 0, right: 0, bottom: 0};
		this.height = SeaFight.imgDC.width;
		this.width = SeaFight.imgDC.height;

		this.draw = function() {
			SeaFight.ctx.drawImage(SeaFight.imgDC, this.x-this.width/2, this.y-this.height/2);
		}

		this.getBBox = function() {
			this.bbox.left = this.x - this.width/2;
			this.bbox.top = this.y - this.height/2;
			this.bbox.right = this.x + this.width/2;
			this.bbox.bottom = this.y + this.height/2;
			return this.bbox;
		}

		this.move = function move() {
			this.y ++;
			if(this.y + this.height/2 > this.bound) {
				return false;
			}
			return true;
		}

		this.setLocation = function(x, y) {
			this.x = x;
			this.y = y;
		}
	},

	makeExplosion: function(isShip) {
		this.isShip = isShip;
		this.counter = 0;
		this.height = SeaFight.imgExplosion[0].height;
		this.imageIndex = 0;
		this.width = SeaFight.imgExplosion[0].width;

		this.advance = function() {
			if(++this.counter < 4) {
				return true;
			}
			this.counter = 0;

			if(++this.imageIndex == 8) {
				if(this.isShip) {
					SeaFight.ship.exploded = true;
				} else {
					SeaFight.sub.exploded = true;
				}
			} else {
				if(this.imageIndex > 16) {
					this.imageIndex = 0;
					return false;
				}
				return true;
			}
		}

		this.draw = function() {
			SeaFight.ctx.drawImage(SeaFight.imgExplosion[this.imageIndex], 
				this.x - this.width/2, this.y - this.height/2);
		}

		this.setLocation = function(x, y) {
			this.x = x;
			this.y = y;
			try {
				SeaFight.audBomb.play();
			} catch (e) {

			}
		}
	},

	makeShip: function(x, y, bound1, bound2) {
		this.x = x;
		this.y = y;
		this.bound1 = bound1;
		this.bound2 = bound2;

		this.bbox = {left: 0, top: 0, right: 0, bottom: 0};
		this.LEFT = 0;
		this.RIGHT = 1;
		this.dir = this.LEFT;
		this.exploded = false;
		this.height = SeaFight.imgShipLeft.height;
		this.vx = 2;
		this.width = SeaFight.imgShipLeft.width;

		this.draw = function() {
			SeaFight.ctx.drawImage((this.dir == this.LEFT) ? SeaFight.imgShipLeft : SeaFight.imgShipRight, 
				this.x - this.width/2, this.y - this.height/2);
			return;
		}

		this.getBBox = function() {
			this.bbox.left = this.x - this.width/2;
			this.bbox.top = this.y - this.height/2;
			this.bbox.right = this.x + this.width/2;
			this.bbox.bottom = this.y + 2;
			return this.bbox;
		}

		this.moveLeft = function() {
			this.dir = this.LEFT;
			this.x -= this.vx;
			if(this.x - this.width/2 < this.bound1) {
				this.x += this.vx;
				this.vx = SeaFight.rnd(4)+1;
			}
		}

		this.moveRight = function() {
			this.dir = this.RIGHT;
			this.x += this.vx;
			if(this.x + this.width/2 > this.bound2) {
				this.x -= this.vx;
				this.vx = SeaFight.rnd(4)+1;
			}
		}

	},

	makeSub: function(x, y, bound1, bound2) {
		this.x = x;
		this.y = y;
		this.bound1 = bound1;
		this.bound2 = bound2;

		this.bbox = {left: 0, top: 0, right: 0, bottom: 0};
		this.LEFT = 0;
		this.RIGHT = 1;
		this.dir = (x >= SeaFight.width) ? this.LEFT : this.RIGHT;
		this.exploded = false;
		this.height = SeaFight.imgSubLeft.height;
		this.vx = SeaFight.rnd(5)+2;
		this.width = SeaFight.imgSubLeft.width;

		this.draw = function() {
			SeaFight.ctx.drawImage((this.dir == this.LEFT) ? SeaFight.imgSubLeft : SeaFight.imgSubRight, 
				this.x - this.width/2, this.y - this.height/2);
		}

		this.getBBox = function() {
			this.bbox.left = this.x - this.width/2;
			this.bbox.top = this.y - this.height/2;
			this.bbox.right = this.x + this.width/2;
			this.bbox.bottom = this.y + this.height/2;
			return this.bbox;
		}

		this.move = function() {
			if(this.dir == this.LEFT) {
				this.x -= this.vx;
				if(this.x - this.width/2 < this.bound1) {
					this.x += this.vx;
					this.vx = SeaFight.rnd(3)+1;
					this.dir = this.RIGHT;
				}
			} else {
				this.x += this.vx;
				if(this.x + this.width/2 > this.bound2) {
					this.x -= this.vx;
					this.vx = SeaFight.rnd(3)+1;
					this.dir = this.LEFT;
				}
			}
		}
	},

	makeTorpedo: function(bound) {
		this.bound = bound;
		this.bbox = { left: 0, top: 0, right: 0, bottom: 0 };
		this.height = SeaFight.imgTorpedo.height;
		this.width = SeaFight.imgTorpedo.width;

		this.draw = function() {
			SeaFight.ctx.drawImage(SeaFight.imgTorpedo, this.x-this.width/2, this.y);
		}

		this.getBBox = function() {
			this.bbox.left = this.x - this.width/2;
			this.bbox.top = this.y;
			this.bbox.right = this.x + this.width/2;
			this.bbox.bottom = this.y + this.height;
			return this.bbox;
		}

		this.move = function() {
			this.y --;
			if(this.y < this.bound) {
				return false;
			}
			return true;
		}

		this.setLocation = function(x, y) {
			this.x = x;
			this.y = y;
		}
	},

	rnd: function(limit) {
		return (Math.random()*limit) | 0;
	},

	supports_html5_storage: function() {
		try {
			return 'localStorage' in window && window['localStorage'] != null && window['localStorage'] !== undefined;
		} catch (e) {
			return false;
		}
	}
}