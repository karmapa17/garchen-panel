import now from './now';

// report something with given duration
export default class Reporter {

  constructor() {
    this.lastReportedTime = now();
  }

  report(func, duration) {
    const currentTime = now();
    if ((currentTime - this.lastReportedTime) < duration) {
      return;
    }
    func();
    this.lastReportedTime = now();
  }
}
