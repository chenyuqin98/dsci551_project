import cv2
import numpy as np
import matplotlib.pyplot as plt


# cv2.imread()接口读图像，读进来直接是BGR 格式数据格式在 0~255，通道格式为(W,H,C)
path = '/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/data/train_images/0a0e8c15b-1.jpg'
img = cv2.imread(path)
print(img)
# fig, axes = plt.subplots(1, 4)
# axes[0].imshow(img)
print(plt.imshow(img))

# rgb = cv2.cvtColor(rgb, cv2.COLOR_BGR2RGB) #转成RGB
# rgb = np.transpose(rgb, [2, 0, 1]) # 进行tensor操作时需要将维度放到前面


