import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn import metrics
import sys


class MyXgboost:
    def __init__(self):
        pass

    def train_and_get_metrics(self, path=None, feature_list=None):
        if feature_list is None:
            feature_list = ['Age', 'Breed1', 'Breed2', 'Gender', 'Color1', 'Color2',
                            'Color3', 'MaturitySize', 'FurLength', 'Vaccinated', 'Dewormed',
                            'Sterilized', 'Health', 'Quantity', 'Fee', 'State']
        self.feature_list = feature_list
        if path is None:
            path = '/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/data/train/train.csv'
        df=pd.read_csv(path)
        train, test=df[:14000], df[14000:]
        train_y, test_y=train['AdoptionSpeed'], test['AdoptionSpeed']
        train_x=train[feature_list]
        # print(type(train_x), train_x)
        test_x=test[feature_list]
        dtrain=xgb.DMatrix(train_x, label=train_y)
        dtest=xgb.DMatrix(test_x, label=test_y)
        self.model = xgb.train(params={}, dtrain=dtrain)
        pred_y = self.model.predict(dtest)
        accuracy = metrics.mean_squared_error(test_y,pred_y)
        return accuracy

    def predict(self, path=None):
        # path 是需要预测的文件，其中必须包含train时选择的特征。
        if path is None:
            path = '/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/data/train/train.csv'
            input = pd.read_csv(path)[self.feature_list]
        dinput = xgb.DMatrix(input)
        predict_days = self.model.predict(dinput)
        return predict_days

if __name__=='__main__':
    # print(train_and_get_metrics('train.csv'))
    myXgboost = MyXgboost()
    print('mse:')
    print(myXgboost.train_and_get_metrics())
    print('predict:')
    for p in myXgboost.predict():
        print(p)
        break
    # print(sys.argv)



