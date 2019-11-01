from datetime import datetime, timedelta
import requests 
import os
from dotenv import load_dotenv

load_dotenv()
WEATHER = os.getenv('WEATHER')

time_left = 0
RAIN=SNOW=COLD=SUN = False


def get_sunset():
    response = requests.get('https://api.sunrise-sunset.org/json?lat=51.551243&lng=-0.226804&formatted=0')
    data = response.json()['results']['sunset']
    sunsetDate = data.split('T')[0]
    sunsetTime = data.split('T')[1][0:5]
    full = f'{sunsetDate} {sunsetTime}'
    formatted = datetime.strptime(full, "%Y-%m-%d %H:%M")
    now = datetime.now()

    tdelta = formatted - now

    print(tdelta)

get_sunset()

def get_weather():
    response = requests.get(f'https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid={WEATHER}')
    data = response.json()
    day = data['list'][0:5]

    for x in day:
        try:
            x['rain']
        except: 
            RAIN = False
        else: 
            RAIN = True
        

    global SNOW
    SNOW = True


get_weather()
print(RAIN)