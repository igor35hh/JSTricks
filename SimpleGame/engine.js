(
	function () {
		var ball = document.getElementById('ball');
		var positions = {
			37:['left', '0'],
			38:['top', '0'],
			39:['left', '100%'],
			40:['top', '100%']
		};
		var colors = {
			37:'255,0,0',
			38:'255,255,0',
			39:'0,0,255',
			40:'0,255,255'
		};

		document.addEventListener('keydown', function(event, data) {
			if (data = positions[event.keyCode]) {
				ball.style[data[0]] = data[1];
				ball.style.backgroundColor = 'rgb('+colors[event.keyCode]+')';
				event.preventDefault();
			}
		}, false);

		var targets = [
			{"color": [220,180,40], "coords": [5,5,12,35]},
			{"color": [210,80,80], "coords": [45,2.5,10,40]},
			{"color": [160,90,60], "coords": [65,5,20,20]},
			{"color": [100,100,150], "coords": [2.5,75,35,15]},
			{"color": [150,70,100], "coords": [55,65,10,20]},
			{"color": [70,230,150], "coords": [87.5,60,10,20]}
		];

		for (var len = targets.length, i=0; i < len; i++) {
			var target = document.createElement('div');
			target.className = 'target';

			target.style.left = targets[i].coords[0]+'%';
			target.style.top = targets[i].coords[1]+'%';
			target.style.width = targets[i].coords[2]+'%';
			target.style.height = targets[i].coords[3]+'%';
			target.style.backgroundColor = 'rgb('+targets[i].color.join(',')+')';
			targets[i].target = ball.parentNode.insertBefore(target, ball);
		}

		var tracking = window.setInterval(function() {
			var ballcolor = window.getComputedStyle(ball).backgroundColor.replace(/[^0-9,]/g, '').split(',');
			for (var n = 0; n<3; n++) {
				ballcolor[n] = parseInt(ballcolor[n], 10);
			}

			for (var i = 0; i < targets.length; i++) {
				if (
					ball.offsetLeft > targets[i].target.offsetLeft &&
					ball.offsetLeft + ball.offsetWidth < targets[i].target.offsetLeft + targets[i].target.offsetWidth &&
					ball.offsetTop > targets[i].target.offsetTop &&
					ball.offsetTop + ball.offsetHeight < targets[i].target.offsetTop + targets[i].target.offsetHeight
				) {
					var match = 0;
					for (var n = 0; n < 3; n++) {
						if (Math.abs(ballcolor[n] - targets[i].color[n]) < 40) {
							match ++;
						}
					}

					if (match === 3) {
						targets[i].target.parentNode.removeChild(targets[i].target);
						targets.splice(i, 1);
						if (targets.length === 0) {
							window.clearInterval(tracking);
							window.setTimeout(function() {
								alert('You won!');
							}, 250);
						}
					}
				}
			}
		}, 62.5);
	}
)();