import tensorflow as tf
from tensorflow import keras
import numpy as np
from enum import Enum
import cv2
from PIL import Image
from patchify import patchify
from keras import backend as K
import matplotlib.pyplot as plt
import requests
from io import BytesIO

# =======================================================
# training metrics

# Mean Intersection-Over-Union: iou = true_positives / (true_positives + false_positives + false_negatives)
def iou_coefficient(y_true, y_pred, smooth=1):
    intersection = K.sum(K.abs(y_true * y_pred), axis=[1, 2, 3])
    union = K.sum(y_true, [1, 2, 3]) + K.sum(y_pred, [1, 2, 3]) - intersection
    iou = K.mean((intersection + smooth) / (union + smooth), axis=0)
    return iou

# mask color codes
class MaskColorMap(Enum):
    Background=(255, 255, 255)
    Building=(255, 0, 0)
    Road=(255, 255, 0)
    Water=(0, 0, 255)
    Barren=(159, 129, 183)
    Forest=(0, 255, 0)
    Agricultural=(255, 195, 128)

# jaccard similarity: the size of the intersection divided by the size of the union of two sets
def jaccard_index(y_true, y_pred):
    y_true_f = K.flatten(y_true)
    y_pred_f = K.flatten(y_pred)
    intersection = K.sum(y_true_f * y_pred_f)
    return (intersection + 1.0) / (K.sum(y_true_f) + K.sum(y_pred_f) - intersection + 1.0)

def rgb_encode_mask(mask):
    # initialize rgb image with equal spatial resolution
    rgb_encode_image = np.zeros((mask.shape[0], mask.shape[1], 3))

    # iterate over MaskColorMap
    for j, cls in enumerate(MaskColorMap):
        # convert single integer channel to RGB channels
        rgb_encode_image[(mask == j)] = np.array(cls.value) / 255.
    return rgb_encode_image

def display_images(instances, rows=2, titles=None):
    """
    :param instances:  list of images
    :param rows: number of rows in subplot
    :param titles: subplot titles
    :return:
    """
    n = len(instances)
    cols = n // rows if (n / rows) % rows == 0 else (n // rows) + 1

    # iterate through images and display subplots
    for j, image in enumerate(instances):
        plt.subplot(rows, cols, j + 1)
        plt.title('') if titles is None else plt.title(titles[j])
        plt.axis("off")
        plt.imshow(image)

    # show the figure
    plt.show()

path = './NNs/satelite_processing/models/final.hdf5'
custom_objects={'iou_coefficient': iou_coefficient, 'jaccard_index': jaccard_index}

model = tf.keras.models.load_model(path, custom_objects)
model.summary()

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

def predict(img_url):
    response = requests.get(img_url)
    img = Image.open(BytesIO(response.content))

    instances = np.array(load_single_image_and_patchify(img));
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
        
        return rgb_image


