export class Helper {
  static toMMSS(time) {
    const secNum = parseInt(time, 10); // don't forget the second param
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - (hours * 3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60);

    let sSeconds = seconds.toString();
    if (seconds < 10) { sSeconds = '0' + seconds; }

    return minutes + ':' + sSeconds;
  }
}