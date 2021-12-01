import pandas as pd
import requests

url = "https://cyq-dsci551-default-rtdb.firebaseio.com/"
file = pd.read_csv('/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/data/train/color_labels.csv', sep=',', header=0)
requests.put(url + 'color_labels.json', json=file.to_dict())

print('success')