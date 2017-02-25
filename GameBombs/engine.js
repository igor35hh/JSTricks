var bombs_var = 1;
var bombs_spawn = true;

function spawn_bombs() {
	if (bombs_spawn == true) {
		for (i=0; i<bombs_var; i++) {
			newBomb = document.createElement("div");
			newBomb.textContent = "*";
			newBomb.style.top = "-150px";
			newBomb.style.left = Math.round(Math.random(screen.width, 0)*screen.width) + "px";
			newBomb.setAttribute("class", "bombs");
			newBomb.setAttribute("onclick", "this.remove(); score.textContent=parseInt(score.textContent)+1;");
			document.body.appendChild(newBomb);
		}
	}
}

spawn_bombs();

function bombs_remove() {
	for (i=0; i<document.getElementsByClassName("bombs").length; i++) {
		bombs[i].remove();
		bombs_remove();
	}
}

function show_die_message() {
	newMessage = document.createElement("div");
	newMessage.id = "die_message";
	newMessage.innerHTML = "<center>You Die<br>Score: "+score.textContent+"</center>";
	newMessage.setAttribute("onclick", "location.reload();");
	document.body.appendChild(newMessage);
}

function movement() {
	setTimeout(function() {
		bombs = document.getElementsByClassName("bombs");
		for (i=0; i<bombs.length; i++) {
			bomb_y = bombs[i].style.top.split("px")[0];
			bomb_y -=-1;
			bombs[i].style.top = bomb_y + "px";
			if (bomb_y > screen.height) {
				bombs[i].remove();
				health.textContent -=1;
			}
		}
		if (bomb_y > screen.height) {
			bombs_var += 1; 
			spawn_bombs();
		}
		if (!document.getElementsByClassName("bombs")[0]) {
			bombs_var += 1;
			spawn_bombs();
		}
		if (document.getElementsByClassName("health")) {
			if (health.textContent <= 0) {
				document.body.style.backgroundColor = "red";
				bombs_spawn = false;
				bombs_remove();
				show_die_message();
				if (document.getElementsById("health")) {
					health.remove();
				}
				if (document.getElementsById("score")) {
					score.remove();
				}
			}
		}
		movement();
	}, 0);
}

movement();