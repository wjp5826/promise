class Promise {
  callbacks = [];
  state = "pending";
  value = null;

  constructor(fn) {
    fn(this._resolve.bind(this));
  }

  _resolve(value) {

  	if (value && (typeof value === 'object' || typeof value === 'function')) {
  		var then = value.then
  		if (typeof then === 'function') {
  			then.call(value, this._resolve.bind(this))
  			return
  		} 
  	}

    this.state = "fulfilled";
    this.value = value;
    // console.log('len', this.callbacks)
    this.callbacks.forEach((callback) => this._handle(callback));
  }

  then(onFullfilled) {
    // console.log("then1");
    return new Promise((resolve) => {
      this._handle({
        onFullfilled,
        resolve
      });
    });
  }

  _handle(callback) {
    if (this.state === "pending") {
      this.callbacks.push(callback);
      return
    }

    if (!callback.onFullfilled) {
      callback.resolve(this.value);
      return;
    }

    const res = callback.onFullfilled(this.value);
    callback.resolve(res);
  }
}

console.log("start");

const promise2 = new Promise((resolve) => {
	setTimeout(() => {
		resolve('promise2')
	}, 1000)
})

	new Promise((resolve) => {
	  resolve("56");
	})
  .then((res) => {
    console.log("then1", res);
    return promise2;
  })
  .then()
  .then((res) => {
    console.log("then2", res);
  });
console.log('end')