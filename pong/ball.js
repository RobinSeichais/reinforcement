var GAMEOVER = 0, BOUNCE = 1, NONE = 2;

class Ball {
	constructor() {
		this.x = -1;
		this.y = -1;

		this.dx = 0;
		this.dy = 0;
	}

	setPos(x, y) {
		this.x = x;
		this.y = y;
	}

	setSpeed(dx, dy) {
		this.dx = dx;
		this.dy = dy;
	}

	initGame(world) {
		world.set(this.x, this.y, SOLID);
	}

	update(world) {

		if (this.x == 0 || this.x == world.width - 1) {
			return GAMEOVER;
		}

		var res = NONE;
		
		if (this.y == 0 || this.y == world.height - 1) {
			this.dy = -this.dy;
		}
		if (world.at(this.x + this.dx, this.y + this.dy) == SOLID) {
			this.dx = -this.dx;
			res = BOUNCE;
		}

		// erase old ball position
		world.set(this.x, this.y, EMPTY);
		// update ball position
		this.x += this.dx, this.y += this.dy;
		// draw new ball position
		world.set(this.x, this.y, SOLID);

		return res;
	}
}