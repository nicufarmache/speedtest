class UI {
  constructor() {
    this.addEvents();
    this.downloadTest = new DownloadTest(this.update.bind(this));
  }

  getElements(selectors) {
    return Object.keys(selectors).reduce((acc, key) => {
      acc[key] = document.querySelector(selectors[key]);
      return acc;
    }, {})
  }

  addEvents() {
    this.el = this.getElements({
      container: '#container',
      startTest: '#startTest',
      speed: '#speed',
      aSpeed: '#aSpeed',
    })

    this.el.startTest.addEventListener('click', () => {
      this.el.startTest.setAttribute('disabled', '');
      this.downloadTest.startTest();
    })
  }

  update({averageSpeed, averageSpeedScaled, averageSpeedUnit,
          currentSpeed, currentSpeedScaled, currentSpeedUnit,
          percentDone, error, done}) {
    if(done) {
      this.el.startTest.removeAttribute('disabled');
      this.el.container.style.setProperty('--percentage', `100%`);
    } else {
      this.el.speed.innerText = `${Math.floor(currentSpeedScaled)} ${currentSpeedUnit}b/s`;
      this.el.aSpeed.innerText = `${Math.floor(averageSpeedScaled)} ${averageSpeedUnit}b/s`;
      this.el.container.style.setProperty('--percentage', `${percentDone}%`);
    }
  }
}

const ui = new UI();
