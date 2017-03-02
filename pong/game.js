class Game {
	constructor(canvas_id, text_div_id, side) {
		
		this.height = 20, this.width = 40, this.cell_size = 10;
		this.n_try = 1;
		this.side = side;
		this.max_score = 0;

		this.text_div = document.getElementById(text_div_id);

		this.world = new World(this.width, this.height, canvas_id, this.cell_size);

		if (side == 'left') {
			this.p1 = new Player(1, 4);
			this.p1.setIA(new LearningAgent(this.world.width * this.world.height));
			
			this.p2 = new Player(2, this.height);
			this.p2.setIA(new RandomAgent());
		} else if (side == 'right') {
			this.p1 = new Player(1, this.height);
			this.p1.setIA(new RandomAgent());
			
			this.p2 = new Player(2, 4);
			this.p2.setIA(new LearningAgent(this.world.width * this.world.height));
		}
		
		this.b = new Ball();
		
		this.initGame();
	}

	initGame() {

		this.score = 0;

		this.world.initGame();

		if (this.side == 'left') {
			this.p1.setPos(0, this.world.height/2);
			this.p2.setPos(this.world.width-1, 0);
		} else if (this.side == 'right') {
			this.p1.setPos(0, 0);
			this.p2.setPos(this.world.width-1, this.world.height/2);
		}
		// this.p2.setPos(this.world.width-1, this.world.height/2);

		this.b.setPos(this.world.width/2, this.world.height/2);
		this.b.setSpeed(
			this.n_try % 2 == 0 ? 1 : -1,
			this.n_try % 4 < 2 ? 1 : -1);

		// draw initial player and ball position
		this.p1.initGame(this.world);
		this.p2.initGame(this.world);
		this.b.initGame(this.world);
	}

	play() {
		var that = this;
		var gameIntervalId = window.setInterval(function () {

			var status = that.b.update(that.world);
			if (status != NONE) {

				if (status == GAMEOVER) {
					if (that.b.x == that.p1.x) {
						that.p1.adapte(-1);
						that.p2.forget();
					} else {
						that.p2.adapte(-1);
						that.p1.forget();
					}
				} else {
					if (that.b.x < that.world.width/2) {
						that.p1.adapte(1);
						that.p2.forget();
						if (that.side == 'left') that.score++;
					} else {
						that.p2.adapte(1);
						that.p1.forget();
						if (that.side == 'right') that.score++;
					}
				}
			}

			if (status == GAMEOVER) {
				that.n_try++;
				that.max_score = Math.max(that.score, that.max_score);
				that.initGame();
			} else {
				that.p1.update(that.world);
				that.p2.update(that.world);
			}
			
			that.world.render();
			that.text_div.innerHTML = "Age: " + this.n_try + " / " + that.score + " [max: " + that.max_score + "]"

		}, 50);
	}
}