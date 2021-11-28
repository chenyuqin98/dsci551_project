import pandas as pd
from sklearn.impute import SimpleImputer
from pyspark.context import SparkContext
from pyspark.sql.session import SparkSession
import sys


class DataExplore:
    def __init__(self, path=None):
        if path is None:
            path = '/Users/chenyuqin/Desktop/21_fall_codes_and_relative/dsci551/project/data/train/train.csv'
        self.path = path
        self.df = pd.read_csv(path)
        # print('data has',self.df.shape[0],'rows and ',self.df.shape[1],'columns')
        # print('data columns are:', list(self.df.columns))


    def data_clean(self):
        imp = SimpleImputer(missing_values='Nan', strategy='mean')
        data_imputed_np = imp.fit_transform(self.df)
        print('replaced missing data with mean')
        return data_imputed_np


    def count_avg(self, feature=None):
        if feature is None:
            feature = 'Age'
        sc = SparkContext('local')
        spark = SparkSession(sc)
        spark.sparkContext.setLogLevel("WARN")
        file = spark.read.option('header', True).csv(self.path)
        file = file.rdd.repartition(2)
        file = file.map(lambda r: r[feature])
        file = file.filter(lambda r: r is not None)
        cnt1 = file.count()
        file = file.filter(lambda r: str.isdigit(r))
        cnt2 = file.count()
        if cnt2<cnt1:
            print('string has no average')
            return
        sum, cnt = file.aggregate((0, 0), lambda u, v: (u[0] + float(v), u[1] + 1), lambda u1, u2: (u1[0] + u2[0], u1[1] + u2[1]))
        print(round(sum/cnt, 2))


if __name__=='__main__':
    # print(sys.argv[1])
    feature=None
    if len(sys.argv)>1:
        feature = sys.argv[1].split(':')[1].replace('"','').replace('}','')
    dataExplorer = DataExplore()
    dataExplorer.count_avg(feature)
