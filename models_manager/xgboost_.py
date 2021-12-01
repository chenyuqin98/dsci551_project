import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn import metrics
import sys


class MyXgboost:
    def __init__(self):
        pass

    def train_and_get_metrics(self, path=None, feature_list=None):
        if feature_list is None or feature_list==[]:
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

    def predict_by_file(self, path=None):
        # path 是需要预测的文件，其中必须包含train时选择的特征。
        if path is None:
            path = '/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/data/train/train.csv'
            input = pd.read_csv(path)[self.feature_list]
        dinput = xgb.DMatrix(input)
        predict_days = self.model.predict(dinput)
        return predict_days

    def predict(self, input):
        # print(1)
        if len(input)==0:
            return 'input is empty'
            # l = len(self.feature_list) if len(self.feature_list)>0 else 1
            # input = np.random.randint(size=l)
        input = np.array(input).astype(float)
        # print(input)
        input = pd.DataFrame([input], columns=self.feature_list)
        # print(input)
        dinput = xgb.DMatrix(input)
        predict_days = self.model.predict(dinput)
        return predict_days

if __name__=='__main__':
    feature_list, value_list = [], []
    # feature_list, value_list = ['Type','Age'], ['1','1']
    # feature_list, value_list = ['Type'], ['1']

    argv_num = len(sys.argv)
    if argv_num>1:
        is_features, is_values = False, False
        for i in range(1, argv_num):
            if sys.argv[i]=='features':
                is_features=True
                continue
            if sys.argv[i]=='values':
                is_values=True
                is_features=False
                continue
            if is_features:
                feature_list.append(sys.argv[i])
            if is_values:
                value_list.append(float(sys.argv[i]))
    # print(feature_list, value_list)

    myXgboost = MyXgboost()
    print('mse (mean average error) of xgboost is:', myXgboost.train_and_get_metrics(feature_list=feature_list))
    # print(myXgboost.train_and_get_metrics(feature_list=feature_list))
    print('This pet will be adopted in', myXgboost.predict(input=value_list)[0], 'days')
    # print(myXgboost.predict_by_file())
    # print(myXgboost.predict(input=value_list)[0])



