
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
    day.forEach(el => console.log(el.rain))
}

// getWeather()

let sunlight 

let now = new Date(Date.now())
let minSunLeft


const getSunset = async () =>{
    let res = await fetch('https://api.sunrise-sunset.org/json?lat=51.551243&lng=-0.226804&formatted=0')
    let data = await res.json()
    let sunset  = new Date( data.results.sunset)
    
    minSunLeft = sunset - now
    console.log(((minSunLeft / (1000 * 60)).toFixed(0)))

}
  
const displaySunLeft =  () => {
    while(minSunLeft >= 0){

    }
}
  
