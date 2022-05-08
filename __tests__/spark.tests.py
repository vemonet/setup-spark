import sys

# os.environ["SPARK_HOME"] = '/opt/cloudera/parcels/CDH/lib/spark'
# os.environ['PYSPARK_PYTHON'] = '/usr/bin/python3'
# sys.path.append('/opt/cloudera/parcels/CDH/lib/spark/python')
# sys.path.append('/opt/cloudera/parcels/CDH/lib/spark/python/lib/py4j-0.9-src.zip') 
import pyspark
from pyspark import SparkConf, SparkContext

## Example of test that could be done with python

conf = SparkConf()
conf.setMaster('yarn-client')
conf.setAppName('test')
sc = SparkContext(conf = conf)
#sc = SparkContext.getOrCreate()
rdd = sc.textFile("http://myfile.csv")
rdd.take(10)