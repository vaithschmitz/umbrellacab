const Gpio = require('pigpio').Gpio
const fetch = require('node-fetch')
require('dotenv').config()

let sunset
let rain, snow, cold = false

console.log('hello from cron')

const getWeather = async () =>{
    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=68d94d5bb085aaebdda7654eb41e9176`)
    let data = await res.json()
    let day = data.list.slice(0,5)
    day.forEach(el => {
        if(el.rain != undefined){rain = true}
        if(el.snow != undefined){snow = true}
    }
    )
    // weather display function
}

let now = new Date(Date.now())
let minSunLeft


const getSunset = async () =>{
    let res = await fetch('https://api.sunrise-sunset.org/json?lat=51.551243&lng=-0.226804&formatted=0')
    let data = await res.json()
    let sunset  = new Date( data.results.sunset)
    
    minSunLeft = sunset - now
    if((minSunLeft / (1000 * 60)).toFixed(0) > 0){
        // time display function
    }
}

getSunset()



const rainLed = new Gpio(17, {mode: Gpio.OUTPUT});
const snowLed = new Gpio(27, {mode: Gpio.OUTPUT});
const coldLed = new Gpio(22, {mode: Gpio.OUTPUT});
const d1 = new Gpio(10, {mode: Gpio.OUTPUT})
const d2 = new Gpio(9, {mode: Gpio.OUTPUT})
const d3 = new Gpio(11, {mode: Gpio.OUTPUT})
const d4 = new Gpio(8, {mode: Gpio.OUTPUT})
let s1 = new Gpio(19, {mode: Gpio.OUTPUT})
let s2 = new Gpio(26, {mode: Gpio.OUTPUT})
let s3 = new Gpio(20, {mode: Gpio.OUTPUT})
let s4 = new Gpio(21, {mode: Gpio.OUTPUT})
let s5 = new Gpio(16, {mode: Gpio.OUTPUT})
let s6 = new Gpio(13, {mode: Gpio.OUTPUT})
let s7 = new Gpio(6, {mode: Gpio.OUTPUT})



function switchAtRandom(){
 let onoff = [255, 0]
 const segments = [s1, s2, s3, s4,s5,s6,s7]
 segments.forEach(el => el.pwmWrite(onoff[Math.floor((Math.random()*2))]))
 d1.pwmWrite(onoff[Math.floor((Math.random() * 2))])
 d2.pwmWrite(onoff[Math.floor((Math.random() * 2))])
 d3.pwmWrite(onoff[Math.floor((Math.random() * 2))])
 d4.pwmWrite(onoff[Math.floor((Math.random() * 2))])

}

setInterval(switchAtRandom, 20)


const showLed = () => {
  if(rain){
    rainLed.pwmWrite(255)}
  else{
    rainLed.pwmWrite(0)
  }

  if(snow){
    snowLed.pwmWrite(255)}
  else{
    snowLed.pwmWrite(0)
  }

  if(cold){
    coldLed.pwmWrite(255)}
  else{
    coldLed.pwmWrite(0)
  }

}