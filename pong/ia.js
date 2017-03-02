var UP = 1, DOWN = 0;

class RandomAgent {
	constructor() {
	}

	decide(world) {
		var state = Math.random() * 2;
		if (state > 1) {
			return UP;
		}
		return DOWN;
	}

	forget() {}

	adapte(reward) {}
}

class LearningAgent {
	constructor(input_size) {
		var layers = [];
		layers.push({type:'input', out_sx:1, out_sy:1, out_depth:input_size});
		layers.push({type:'fc', num_neurons:input_size, activation:'relu'});
		layers.push({type:'regression', num_neurons:1});

		this.net = new convnetjs.Net();
		this.net.makeLayers(layers);

		this.trainer = new convnetjs.SGDTrainer(this.net, {learning_rate:0.001, l2_decay:0.0001, momentum:0.0, batch_size:1});

		this.X_memory = [];
		this.y_memory = [];
	}

	decide(input) {
		this.X_memory.push(input);	
		var X = new convnetjs.Vol(input);
		var pred = this.net.forward(X);
		var res = this.toss(pred.w[0]);
		this.y_memory.push(res);
		return res;
	}

	toss(prob) {
		var t1 = Math.random() < prob ? UP : DOWN;
		var t2 = Math.random() < prob ? UP : DOWN;
		if (t1 == t2) {
			return t1;
		}
		return Math.random() < prob ? UP : DOWN;
	}

	forget() {
		this.X_memory = [];
		this.y_memory = [];
	}

	adapte(reward) {
		for (var i = 0; i < this.X_memory.length; i++) {
			var X = new convnetjs.Vol(this.X_memory[i]);
			var y = reward > 0 ? this.y_memory[i] : Math.abs(this.y_memory[i] - 1);
			this.trainer.train(X, [y]);
		}
		this.forget();
	}
}