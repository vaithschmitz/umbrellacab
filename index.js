const GPIO = require('pigpio').GPIO
const fetch = require('node-fetch')
require('dotenv').config()

let rain, snow

const getWeather = async () =>{
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=${process.env.WEATHER}`)
    let data = await res.json()
    let day = data.list.slice(0,5)
    day.forEach(el => {
        if(el.rain != undefined){rain = true}
        if(el.snow != undefined){snow = true}
    }
    )
    console.log(rain)
}

getWeather()

const led = new Gpio(17, {mode: Gpio.OUTPUT});

let dutyCycle = 0;

setInterval(() => {
  led.pwmWrite(dutyCycle);

  dutyCycle += 5;
  if (dutyCycle > 255) {
    dutyCycle = 0;
  }
}, 20);