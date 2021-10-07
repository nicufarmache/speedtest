class UI {
  constructor() {
    this.colors = {
      off: '#008000',
      on: '#88FF88',
    };
    this.timeout = Array(8).fill(0);
    this.cacheElements()
    this.addEvents();
    this.downloadTest = new DownloadTest(this.update.bind(this));
    this.setProgress('Push button to start');
  }

  getElements(selectors) {
    return Object.keys(selectors).reduce((acc, key) => {
      acc[key] = document.querySelector(selectors[key]);
      return acc;
    }, {})
  }

  cacheElements() {
    this.el = this.getElements({
      progressBack: '.progressBarBack',
      progress: '.progressBar',
      startTest: '.startTest',
      speed: '.speed',
    })

    this.el.leds = this.getElements({
      0: '#path4092-9-6-9-1',
      1: '#path4092-9-6-9-1-6',
      2: '#path4092-9-6-9-1-9',
      3: '#path4092-9-6-9-1-1',
      4: '#path4092-9-6-9-1-5',
      5: '#path4092-9-6-9-1-6-9',
      6: '#path4092-9-6-9-1-9-8',
      7: '#path4092-9-6-9-1-1-8',
    })

    this.el.scaleLeds = this.getElements({
      0: '#path-bps',
      10: '#path-kbps',
      20: '#path-mbps',
      30: '#path-gbps',
      40: '#path-tbps',
    })
  }

  addEvents() {
    this.el.startTest.addEventListener('click', () => {
      if (this.isOn) {
        this.downloadTest.cancel();
      } else {
        this.isOn = true;
        this.el.startTest.classList.add('on');
        this.downloadTest.startTest();
      }
    })
  }

  blinkLed(index) {
    const time = 300;

    if (this.timeout[index] != 0) return;

    this.timeout[index] = setTimeout(() => {
      this.el.leds[index].style.fill = this.colors.on;
      this.timeout[index] = setTimeout(() => {
        this.el.leds[index].style.fill = this.colors.off;
        this.timeout[index] = 0;
      }, time)
    }, time)

  }

  setProgress(value) {
    const el = this.el.progress;
    const size = this.el.progressBack.textContent.length;

    if (typeof value == 'string') {
      const text = value.substr(0,size);
      const result = `${text}${' '.repeat(size - text.length)}`
      el.textContent = result.replaceAll(' ', '!');
    } else if (typeof value == 'number') {
      let number = Math.ceil(size * value/100);
      if (number < 0) number = 0;
      if (number > size) number = size;
      const result = `${'*'.repeat(number)}${' '.repeat(size - number)}`
      el.textContent = result.replaceAll(' ', '!');
    }
  }

  setScale(currentExponent) {
    if (this.previousExponent !== currentExponent) {
      for(const exponent in this.el.scaleLeds) {
        this.el.scaleLeds[exponent].style.fill = this.colors.off;
      }
      if (this.el.scaleLeds[currentExponent]) {
        this.el.scaleLeds[currentExponent].style.fill = this.colors.on;
      }
      this.previousExponent = currentExponent
    }
  }

  update({currentSpeedScaled, currentSpeedExponent, percentDone, done, canceled}) {
    if(done) {
      this.isOn = false;
      this.el.startTest.classList.remove('on');
      if (canceled) {
        this.setProgress('TEST STOPPED');
      } else {
        this.setProgress('TEST FINISHED');
      }
    } else {
      const roundedSpeed = `${currentSpeedScaled.toFixed(1)}`
      this.el.speed.innerText = roundedSpeed.substr(0, 4);
      this.setProgress(percentDone);
      this.setScale(currentSpeedExponent);
      this.blinkLed(Math.floor(Math.random()*8));
    }
  }
}

const ui = new UI();
