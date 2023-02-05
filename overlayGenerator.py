# Wind, solar and vwind
# Solar is best when there is low wind and sunny days (wind power output < solar power output)
# Wind is best when there is high wind and cloudy days (wind power output > solar power output)
# Vwind is best when there is low wind and cloudy days (wind power output > solar power output)

Background=[255, 255, 255]
# ignore
Building=[255, 0, 0]
# always solar
Road=[255, 255, 0]
# ignore
Water=[0, 0, 255]
# ignore
Barren=[159, 129, 183]
# wind > solar
Forest=[0, 255, 0]
# wind > solar
Agricultural=[255, 195, 128]
# wind > solar

import cv2
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from enum import Enum

class MaskColorMap(Enum):
    Background=(255, 255, 255)
    Building=(255, 0, 0)
    Road=(255, 255, 0)
    Water=(0, 0, 255)
    Barren=(159, 129, 183)
    Forest=(0, 255, 0)
    Agricultural=(255, 195, 128)

class energyTypes(Enum):
    Solar = (255, 255, 0)
    Wind = (52, 143, 235)
    VWind = (52, 235, 143)

def processMask(image, energyType):
    if(energyType == energyTypes.Solar):
        image[np.all(image==Background, axis = -1)] = (0,0,0)
        image[np.all(image==Building, axis = -1)] = (255, 255, 0)
        image[np.all(image==Road, axis = -1)] = (0, 0, 0)
        image[np.all(image==Water, axis = -1)] = (0, 0, 0)
        image[np.all(image==Barren, axis = -1)] = (255, 255, 0)
        image[np.all(image==Forest, axis = -1)] = (255, 255, 0)
        image[np.all(image==Agricultural, axis = -1)] = (255, 255, 0)
    elif(energyType == energyTypes.Wind):
        image[np.all(image==Background, axis = -1)] = (0,0,0)
        image[np.all(image==Building, axis = -1)] = (255, 255, 0)
        image[np.all(image==Road, axis = -1)] = (0, 0, 0)
        image[np.all(image==Water, axis = -1)] = (0, 0, 0)
        image[np.all(image==Barren, axis = -1)] = (52, 143, 235)
        image[np.all(image==Forest, axis = -1)] = (52, 143, 235)
        image[np.all(image==Agricultural, axis = -1)] = (52, 143, 235)
    elif(energyType == energyTypes.VWind):
        image[np.all(image==Background, axis = -1)] = (0,0,0)
        image[np.all(image==Building, axis = -1)] = (255, 255, 0)
        image[np.all(image==Road, axis = -1)] = (0, 0, 0)
        image[np.all(image==Water, axis = -1)] = (0, 0, 0)
        image[np.all(image==Barren, axis = -1)] = (52, 235, 143)
        image[np.all(image==Forest, axis = -1)] = (52, 235, 143)
        image[np.all(image==Agricultural, axis = -1)] = (52, 235, 143)

    # Convert image to image gray
    tmp = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Applying thresholding technique
    _, alpha = cv2.threshold(tmp, 0, 255, cv2.THRESH_BINARY)

    # Using cv2.split() to split channels
    # of coloured image
    b, g, r = cv2.split(image)

    # Making list of Red, Green, Blue
    # Channels and alpha
    rgba = [b, g, r, alpha]

    # Using cv2.merge() to merge rgba
    # into a coloured/multi-channeled image
    # dst has no background, road, water
    dst = cv2.merge(rgba, 4)

    b, g, r = cv2.split(dst)

    # Writing and saving to a new image
    cv2.imwrite("gfg_white.png", dst)

