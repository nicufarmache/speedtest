class DownloadTest {
  constructor(updater, count = 5, sampleCount = 80) {
    this.count = count;
    this.updater = updater;
    this.sampleCount = sampleCount;
    this.xhrList = [];
    for (let i = 0; i < count; i++) {
      this.makeXHR();
    }
  }

  makeXHR() {
    const index = this.xhrList.length;
    const xhr  = new XMLHttpRequest();
    const eventHandler = (e) => {this.handleEvent(index, e)}

    xhr.addEventListener('progress', eventHandler);
    xhr.addEventListener('loadstart', eventHandler);
    xhr.addEventListener('load', eventHandler);
    xhr.addEventListener('error', eventHandler);
    xhr.addEventListener('abort', eventHandler);
    xhr.addEventListener('loadend', eventHandler);

    this.xhrList.push(xhr);
  }

  init() {
    const length = this.xhrList.length;
    this.times = {
      start: 0,
      last: 0,
      duration: 0,
      delta: 0,
      deltaSamples: Array(this.sampleCount).fill(0),
      deltaSamplesInterval: 0,
      timeout: 15 * 1000,
    };
    this.bytes = {
      delta: 0,
      deltaSamples: Array(this.sampleCount).fill(0),
      deltaSamplesSum: 0,
      last: Array(length).fill(0),
      lastAll: 0,
      total: 400 * 1024 * 1024,
    }
    this.result = {
      averageSpeed: 0,
      averageSpeedScaled: 0,
      averageSpeedUnit: '',
      averageSpeedExponent: 0,
      currentSpeed: 0,
      currentSpeedScaled: 0,
      currentSpeedUnit: '',
      currentSpeedExponent: 0,
      percentDone:0,
      startedSendingData: false,
      loadedAllData: false,
      error: false,
      canceled: false,
      done: false,
    };
  }

  handleEvent(index, e) {
    const timestamp = performance.now();
    const type = e.type;
    const loaded = e.loaded;

    //(type === 'progress') || console.log( `Index: ${index}, Type: ${type}, Loaded: ${loaded}`);

    if (type == 'loadstart') {
      this.result.startedSendingData = true;
      this.times.start = this.times.start || timestamp;
      this.times.last = this.times.last || timestamp;
    } else if (type == 'progress'){
      //progressing
      this.times.delta = timestamp - this.times.last;
      this.times.duration = timestamp - this.times.start;
      this.times.last = timestamp;
      this.bytes.delta = loaded - this.bytes.last[index];
      this.bytes.last[index] = loaded;
      this.bytes.lastAll += this.bytes.delta;

      this.updateSamples();
      this.updateResult();
      this.decideIfEnough();
    } else if (type == 'load'){
      this.result.loadedAllData = true;
      this.abort();
    } else if (type == 'error'){
      this.result.error = true;
      this.abort();
    }
  }

  updateSamples() {
    this.bytes.deltaSamples.push(this.bytes.delta);
    this.bytes.deltaSamples.shift();
    this.bytes.deltaSamplesSum = 0;
    for (const delta of this.bytes.deltaSamples)
      this.bytes.deltaSamplesSum += delta;

    this.times.deltaSamples.push(this.times.delta);
    this.times.deltaSamples.shift();
    this.times.deltaSamplesSum = 0;
    for (const delta of this.times.deltaSamples)
      this.times.deltaSamplesSum += delta;
  }

  updateResult() {
    this.result.averageSpeed = 8000 * this.bytes.lastAll / this.times.duration;
    this.result.currentSpeed = 8000 * this.bytes.deltaSamplesSum / this.times.deltaSamplesSum;

    [this.result.averageSpeedScaled, this.result.averageSpeedUnit, this.result.averageSpeedExponent] = scaleUnits(this.result.averageSpeed);
    [this.result.currentSpeedScaled, this.result.currentSpeedUnit, this.result.currentSpeedExponent] = scaleUnits(this.result.currentSpeed);

    const percentDoneBytes = Math.ceil(100 * this.bytes.lastAll / this.bytes.total);
    const percentDoneTime = Math.ceil(100 * this.times.duration / this.times.timeout);
    this.result.percentDone = (percentDoneBytes > percentDoneTime) ? percentDoneBytes : percentDoneTime;

    this.updater && this.updater(this.result);
  }

  decideIfEnough() {
    if (this.times.duration > this.times.timeout){
      setTimeout(this.abort.bind(this), 1000);
    }
    if (this.bytes.lastAll > this.bytes.total){
      this.abort();
    }
  }

  abort() {
    this.xhrList.forEach((xhr) => {
      xhr.abort();
    })
    this.finish();
  }

  cancel() {
    this.result.canceled = true;
    this.abort();
  }

  finish() {
    this.result.done = true;
    this.updater && this.updater(this.result);
  }

  startTest() {
    this.init();
    this.xhrList.forEach((xhr, index) => {
      const url = `files/99?${performance.now()}.${index}`;
      xhr.open('GET', url);
      xhr.send();
    })
  }
}
