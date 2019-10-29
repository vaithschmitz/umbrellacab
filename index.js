const Gpio = require('onoff').Gpio
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

const Gpio = require('../onoff').Gpio; // Gpio class
const led = new Gpio(17, 'out');       // Export GPIO17 as an output

// Toggle the state of the LED connected to GPIO17 every 200ms
const iv = setInterval(_ => led.writeSync(led.readSync() ^ 1), 200);

// Stop blinking the LED after 5 seconds
setTimeout(_ => {
  clearInterval(iv); // Stop blinking
  led.unexport();    // Unexport GPIO and free resources
}, 5000);