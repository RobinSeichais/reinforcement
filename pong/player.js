class Player {
	constructor(pid, size) {
		this.pid = pid;
		this.x = -1;
		this.y = -1;
		this.agent = null;
		this.size = size;
	}

	setPos(x, y) {
		this.x = x;
		this.y = y;
	}

	setIA(agent) {
		this.agent = agent;
	}

	initGame(world) {
		for (var i = 0; i < this.size; i++) {
			world.set(this.x, this.y + i, SOLID);
		}
	}

	update(world) {

		var move = this.agent.decide(world.getVec());
		
		if (move == DOWN) {
		
			if (this.y + this.size == world.height) {
				return;
			}
		
			world.set(this.x, this.y, EMPTY);
			this.y += 1;
			world.set(this.x, this.y + this.size - 1, SOLID);
		
		} else {
			
			if (this.y == 0) {
				return;
			}
			
			world.set(this.x, this.y + this.size - 1, EMPTY);
			this.y -= 1;
			world.set(this.x, this.y, SOLID);
		}
	}

	adapte(reward) {
		this.agent.adapte(reward);
	}

	forget() {
		this.agent.forget();
	}
}