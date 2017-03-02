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

		this.Xs = [];
		this.ys = [];

		this.X_memory = [];
		this.y_memory = [];
		this.n_toss = 11;
		this.toss_th = 6;
	}

	decide(input) {

		if (this.Xs.length > 0) {
			var X = this.Xs.shift();
			var y = this.ys.shift();
			this.trainer.train(X, y);
		}

		this.X_memory.push(input);	
		var vec = new convnetjs.Vol(input);
		var pred = this.net.forward(vec);
		var res = this.toss(pred.w[0]);
		this.y_memory.push(res);
		return res;
	}

	toss(prob) {
		var n = 0;
		for (var i = 0; i < this.n_toss; i++) {
			if (Math.random() < prob) n++;
		}
		if (n >= this.toss_th) {
			return UP;
		}
		return DOWN;
	}

	forget() {
		this.X_memory = [];
		this.y_memory = [];
	}

	adapte(reward) {
		for (var i = 0; i < this.X_memory.length; i++) {
			var X = new convnetjs.Vol(this.X_memory[i]);
			var y = reward > 0 ? this.y_memory[i] : Math.abs(this.y_memory[i] - 1);
			this.Xs.push(X);
			this.ys.push([y]);
		}
		this.forget();
	}
}