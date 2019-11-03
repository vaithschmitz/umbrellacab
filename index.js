const Gpio = require("pigpio").Gpio;
const fetch = require("node-fetch");
require("dotenv").config();

// data vars
let sunset;
let rain, snow, cold = false;

// pin setup
const rainLed = new Gpio(17, { mode: Gpio.OUTPUT });
const snowLed = new Gpio(27, { mode: Gpio.OUTPUT });
const coldLed = new Gpio(22, { mode: Gpio.OUTPUT });
const d1 = new Gpio(10, { mode: Gpio.OUTPUT });
const d2 = new Gpio(9, { mode: Gpio.OUTPUT });
const d3 = new Gpio(11, { mode: Gpio.OUTPUT });
const d4 = new Gpio(8, { mode: Gpio.OUTPUT });
let s1 = new Gpio(19, { mode: Gpio.OUTPUT });
let s2 = new Gpio(26, { mode: Gpio.OUTPUT });
let s3 = new Gpio(20, { mode: Gpio.OUTPUT });
let s4 = new Gpio(21, { mode: Gpio.OUTPUT });
let s5 = new Gpio(16, { mode: Gpio.OUTPUT });
let s6 = new Gpio(13, { mode: Gpio.OUTPUT });
let s7 = new Gpio(6, { mode: Gpio.OUTPUT });

// iterable segments to turn on/off
const segments = [s1, s2, s3, s4, s5, s6, s7];

// digits as segment arrays
let zero = [1, 1, 1, 1, 1, 1, 0];
let one = [0, 0, 0, 0, 1, 1, 0];
let two = [1, 1, 0, 1, 1, 0, 1];
let three = [1, 0, 0, 1, 1, 1, 1];
let four = [0, 0, 1, 0, 1, 1, 1];
let five = [1, 0, 1, 1, 0, 1, 1];
let six = [1, 1, 1, 1, 0, 1, 1];
let seven = [0, 0, 1, 1, 1, 1, 0];
let eight = [1, 1, 1, 1, 1, 1, 1];
let nine = [1, 0, 1, 1, 1, 1, 1];
let none = [0, 0, 0, 0, 0, 0, 0];

// array to hold state of daytime written to Gpio
let toWrite = [];

const getWeather = async () => {
  let res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=68d94d5bb085aaebdda7654eb41e9176`
  );
  let data = await res.json();
  let day = data.list.slice(0, 5);
  day.forEach(el => {
    if (el.rain != undefined) {
      rain = true;
    }
    if (el.snow != undefined) {
      snow = true;
    }
  });
  // weather display function
};

getWeather() 
setInterval(getWeather, 3600000) //every hour 

// get sunset time in min, if > 0 call conversion to segments, else write array of 0s to d1-d4
const getSunset = async () => {
  let res = await fetch(
    "https://api.sunrise-sunset.org/json?lat=51.551243&lng=-0.226804&formatted=0"
  );
  let data = await res.json();
  if (sunset == undefined) {
    sunset = new Date(data.results.sunset);
  }
  let now = new Date(Date.now());

  let minSunLeft = ((sunset - now) / (1000 * 60)).toFixed(0);

  if (minSunLeft > 0) {
    conversionLoop();
  } else {
    d2.digitalWrite(0);
    d3.digitalWrite(0);
    d4.digitalWrite(0);
    d1.digitalWrite(0);
    for (let i = 0; i < segments.length; i++) {
      segments[i].digitalWrite(none[i]);
    }
  }
};
// call on run
getSunset()
// every 3 hours
setInterval(getSunset, 10000000);

// subtract EOD from now, for each digit choose corresponding segment array, send to Gpio funcs
const convertToDisplay = () => {
  let now = new Date(Date.now());
  let sunsetString = ((sunset - now) / (1000 * 60)).toFixed(0);
  let d1Write = sunsetString.split("")[sunsetString.length - 4];
  let d2Write = sunsetString.split("")[sunsetString.length - 3];
  let d3Write = sunsetString.split("")[sunsetString.length - 2];
  let d4Write = sunsetString.split("")[sunsetString.length - 1];
  let y = [d1Write, d2Write, d3Write, d4Write];
  let writeDigit;
  let writeDigits = [];
  y.forEach(el => {
    switch (el) {
      case "1":
        writeDigit = one;
        break;
      case "2":
        writeDigit = two;
        break;
      case "3":
        writeDigit = three;
        break;
      case "4":
        writeDigit = four;
        break;
      case "5":
        writeDigit = five;
        break;
      case "6":
        writeDigit = six;
        break;
      case "7":
        writeDigit = seven;
        break;
      case "8":
        writeDigit = eight;
        break;
      case "9":
        writeDigit = nine;
        break;
      case "0":
        writeDigit = zero;
        break;
      default:
        writeDigit = none;
    }
    writeDigits.push(writeDigit);
  });

  toWrite = writeDigits;
  digitWriteLoop();
};

// check time 30 seconds
const conversionLoop = () => setInterval(convertToDisplay, 30000);

const showD1 = () => {
  d2.digitalWrite(1);
  d3.digitalWrite(1);
  d4.digitalWrite(1);
  d1.digitalWrite(0);
  for (let i = 0; i < segments.length; i++) {
    segments[i].digitalWrite(toWrite[0][i]);
  }
};
const showD2 = () => {
  d1.digitalWrite(1);
  d3.digitalWrite(1);
  d4.digitalWrite(1);
  d2.digitalWrite(0);
  for (let i = 0; i < segments.length; i++) {
    segments[i].digitalWrite(toWrite[1][i]);
  }
};

const showD3 = () => {
  d1.digitalWrite(1);
  d2.digitalWrite(1);
  d4.digitalWrite(1);
  d3.digitalWrite(0);
  for (let i = 0; i < segments.length; i++) {
    segments[i].digitalWrite(toWrite[2][i]);
  }
};

const showD4 = x => {
  d1.digitalWrite(1);
  d2.digitalWrite(1);
  d3.digitalWrite(1);
  d4.digitalWrite(0);
  for (let i = 0; i < segments.length; i++) {
    segments[i].digitalWrite(toWrite[3][i]);
  }
};
const cycleSegments = () => {
  showD1();
  setTimeout(showD2, 4);
  setTimeout(showD3, 8);
  setTimeout(showD4, 12);
};

// 12 ms for full refresh of 4 digits
const digitWriteLoop = () => setInterval(cycleSegments, 16);

const showLed = () => {
  if (rain) {
    rainLed.pwmWrite(255);
  } else {
    rainLed.pwmWrite(0);
  }

  if (snow) {
    snowLed.pwmWrite(255);
  } else {
    snowLed.pwmWrite(0);
  }

  if (cold) {
    coldLed.pwmWrite(255);
  } else {
    coldLed.pwmWrite(0);
  }
};
