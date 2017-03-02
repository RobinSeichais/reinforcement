var EMPTY = 0;
var SOLID = 1;

class World {
	constructor(width, height, canvas_id, cell_size) {
		this.width = width;
		this.height = height;
		this.cell_size = cell_size;

		var canvas = document.getElementById(canvas_id);
		this.ctx = canvas.getContext("2d");

		this.data = new Array(height * width);
		this.prev_data = new Array(height * width);
	}

	initGame() {
		this.prev_data.fill(EMPTY);
		this.data.fill(EMPTY);
	}

	getVec() {
		return Array.from(this.data, (v, i) => v - this.prev_data[i]);
	}

	at(x, y) {
		return this.data[y + this.width * x];
	}

	set(x, y, v) {
		this.data[y + this.width * x] = v;
	}

	render() {
		for (var i = 0; i < this.width; i++) {
			for (var j = 0; j < this.height; j++) {
				if (this.data[j + i * this.width] == SOLID) {
					this.ctx.fillStyle = "#FFF";
				} else {
					this.ctx.fillStyle = "#000";
				}
				this.ctx.fillRect(this.cell_size*i, this.cell_size*j, this.cell_size, this.cell_size);
			};
		};
	}
}