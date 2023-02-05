from faker import Faker
import requests
import urllib.request
import random
import json

j = open('api_constants.json')
data = json.load(j)
key = data["maps_sdk_key"]
secret = data["maps_static_secret"]

def randomCoord(i):
    Faker.seed(i)
    fake = Faker()
    coords = fake.location_on_land(True)
    return coords[0] + ", " + coords[1]

def download_image(url, file_path, file_name):
    full_path = file_path + file_name + '.png'
    urllib.request.urlretrieve(url, full_path)

def pullImg(coords, key, signature):
    url = 'https://maps.googleapis.com/maps/api/staticmap?center={coords}&zoom=7&size=640x640&scale=2&format=jpg&maptype=satellite&key={key}&signature={signature}'
    res = requests.get(url, stream = True)
    download_image(url, './training_data/images/', "test")

coord = ["40, 20"]
pullImg(coord[0], key, secret)

#for i in range(50):
#    coord.append(randomCoord(random.randint(0,100)))
#    print(coord[i])
#    pullImg(coord[i])
    