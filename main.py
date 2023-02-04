import tensorflow as tf
from tensorflow import keras
import numpy as np
from enum import Enum
import cv2
import matplotlib.pyplot as plt
from PIL import Image
from keras import backend as K
from keras.callbacks import ModelCheckpoint, CSVLogger, EarlyStopping
from keras.models import Model, load_model
from keras.utils import to_categorical
from patchify import patchify
from sklearn.model_selection import train_test_split
from keras.layers import Input, Conv2D, MaxPooling2D, concatenate, Conv2DTranspose, Dropout
from keras.layers import Rescaling
from tqdm import tqdm
from NNs.satelite_processing.aerial_unet_segmentation import load_images_and_patchify, iou_coefficient, jaccard_index, MaskColorMap, rgb_encode_mask, display_images

path = './NNs/satelite_processing/models/segmentation.hdf5'
custom_objects={'iou_coefficient': iou_coefficient, 'jaccard_index': jaccard_index}

model = tf.keras.models.load_model(path, custom_objects)
model.summary()

predictPath = ''

def load_single_image_and_patchify(img_path):

    # initialize empty list for patches
    instances = []

    # Reads image as BGR
    image = cv2.imread(img_path)

    # convert image to RBG
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    size_x = (image.shape[1] // 160) * 160  # width to the nearest size divisible by patch size
    size_y = (image.shape[0] // 160) * 160  # height to the nearest size divisible by patch size

    image = Image.fromarray(image)

    # Crop original image to size divisible by patch size from top left corner
    image = np.array(image.crop((0, 0, size_x, size_y)))

    # Extract patches from each image, step=patch_size means no overlap
    patch_img = patchify(image, (160, 160, 3), step=160)

    # iterate over vertical patch axis
    for j in range(patch_img.shape[0]):
        # iterate over horizontal patch axis
        for k in range(patch_img.shape[1]):
            # patches are located like a grid. use (j, k) indices to extract single patched image
            single_patch_img = patch_img[j, k]

            # Drop extra dimension from patchify
            instances.append(np.squeeze(single_patch_img))

    return instances

def predict(img_path):
    instances = np.array(load_single_image_and_patchify(img_path));
    for i in range(len(instances)):

        #extract test input image
        test_img = instances[i]

        # expand first dimension as U-Net requires (m, h, w, nc) input shape
        test_img_input = np.expand_dims(test_img, 0)

        # make prediction with model and remove extra dimension
        prediction = np.squeeze(model.predict(test_img_input))

        # convert softmax probabilities to integer values
        predicted_img = np.argmax(prediction, axis=-1)

        # convert integer encoding to rgb values
        rgb_image = rgb_encode_mask(predicted_img)

        # visualize model predictions
        display_images(
            [test_img, rgb_image, rgb_image],
            rows=1, titles=['Aerial', 'Prediction again lmao', 'Prediction']
        )

predict("./testimg/image_part_005.jpg")