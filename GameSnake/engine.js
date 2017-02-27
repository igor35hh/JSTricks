mouse_x = mouse_y = pHead_x = pHead_y = pBodyX_angle = pBodyY_angle = 0;
radius_var = 10;
interval_var = 15;

for (i=0; i<20; i++) {
	newDiv = document.createElement("div");
	newDiv.setAttribute("class", "pBody");
	document.body.appendChild(newDiv);
	newDiv.style.top = pHead.style.top;
	newDiv.style.left = pHead.style.left.split("px")[0]-20;
}

function to_mouse() {
	setTimeout(function() {
		pHead_x = pHead.style.left.split("px")[0];
		pHead_y = pHead.style.top.split("px")[0];
		if (mouse_x > pHead_x) {pHead.style.left = pHead_x - (-1) + "px";}
		if (mouse_x < pHead_x) {pHead.style.left = pHead_x - 1 + "px";}

		if (mouse_y > pHead_y) {pHead.style.top = pHead_y - (-1) + "px";}
		if (mouse_y < pHead_y) {pHead.style.top = pHead_y - 1 + "px";}

		to_mouse();
	}, interval_var)
}

to_mouse();

function movement() {
	setTimeout(function() {
		pBody_obj_i = document.getElementsByClassName("pBody");
		for (i=0; i<pBody_obj_i.length; i++) {
			pBody_obj = pBody_obj_i[i];
			pBody_obj_x = pBody_obj.style.left.split("px")[0];
			pBody_obj_y = pBody_obj.style.top.split("px")[0];

			if (i == pBody_obj_i.length-1) {
				if (pHead_x - radius_var > pBody_obj_x) {pBody_obj.style.left = pBody_obj_x - (-1) + "px";}
				if (pHead_x - (-radius_var) < pBody_obj_x) {pBody_obj.style.left = pBody_obj_x - 1 + "px";}

				if (pHead_y - radius_var > pBody_obj_y) {pBody_obj.style.top = pBody_obj_y - (-1) + "px";}
				if (pHead_y - (-radius_var) < pBody_obj_y) {pBody_obj.style.top = pBody_obj_y - 1 + "px";}
			} else {
				if (pBody_obj_i[i+1]) {
					if (pBody_obj_i[i+1].style.left.split("px")[0] - radius_var > pBody_obj_x) {
						pBody_obj.style.left = pBody_obj_x - (-1) + "px";
					}
					if (pBody_obj_i[i+1].style.left.split("px")[0] - (-radius_var) < pBody_obj_x) {
						pBody_obj.style.left = pBody_obj_x - 1 + "px";
					}
					if (pBody_obj_i[i+1].style.top.split("px")[0] - radius_var > pBody_obj_y) {
						pBody_obj.style.top = pBody_obj_y - (-1) + "px";
					}
					if (pBody_obj_i[i+1].style.top.split("px")[0] - (-radius_var) < pBody_obj_y) {
						pBody_obj.style.top = pBody_obj_y - 1 + "px";
					}
				}
			}
		}

		movement();

	}, interval_var)
}

movement();

ns4 = (document.layers) ? true:false
ie4 = (document.all) ? true:false

function init() {
	if (ns4) {document.captureEvents(Event.MOUSEMOVE);}
	document.onmousemove = mousemove;
}

function mousemove(event) {
	mouse_x = y = 0;
	if (document.attachEvent != null) {
		mouse_x = window.event.clientX;
		mouse_y = window.event.clientY;
	} else if (!document.attachEvent && document.addEventListener) {
		mouse_x = event.clientX;
		mouse_y = event.clientY;
	}
	status = "x = " + mouse_x + ", y = " + mouse_y;
}

init();