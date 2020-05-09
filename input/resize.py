from PIL import Image
import math
import glob

files = glob.glob("C:/Users/remin/Googledrive/vocabulary/*.jpg")

for file in files:
    im = Image.open(file).resize((750,1000)).convert('L')
    min_variance = 10000000000
    min_index = 0
    for x in range(250,500):
        s = 0
        sq = 0
        for y in range(1000):
            pixel = im.getpixel((x,y))
            s += pixel
            sq += pixel ** 2
        variance = sq/1000 - s**2/1000000
        if variance < min_variance:
            min_variance = variance
            min_index = x
    im.crop((0,0,min_index,1000)).save(file.replace('vocabulary','vocabulary/crop'))