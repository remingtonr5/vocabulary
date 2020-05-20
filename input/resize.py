from PIL import Image
import numpy as np
import glob
import shutil
import os

path = "C:/Users/remin/Googledrive/vocabulary/crop"
try:
    shutil.rmtree(path)
except FileNotFoundError:
    print("crop doesn't seem existing")
os.mkdir(path)

files = glob.glob("C:/Users/remin/Googledrive/vocabulary/*.jpg")

for file in files:
    im = np.array(Image.open(file).resize((768,1024)).convert('L'))
    min_ = 1000000000
    min_index = 0
    for x in np.arange(256,512):
        s = 0
        pixels = np.zeros(1024, dtype = int)
        for y in np.arange(1024):
            if im[y,x] >= 128:
                pixels[y] = 1

        arr = np.abs(np.fft.fft(pixels))
        for i in np.arange(1024):
            s += i*arr[i] 
            # if x == 499:
            #     print(f'{} {pixel}')

        if s < min_:
            # print(f'更新しました s:{s} index:{x}')
            min_ = s
            min_index = x

    # print(min_index) 
    Image.fromarray(im).crop((0,0,min_index,1000)).save(file.replace('vocabulary','vocabulary/crop'))
    print(file)