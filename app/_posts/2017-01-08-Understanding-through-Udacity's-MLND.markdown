---
layout: post
title:  "Understanding through Udacity's MLND"
date:   2014-04-20 09:11:03
categories: Machine Learning Nanodegree
author: "Utkarsh Bhimte"
description: Daily Log about my progress in my Machine Learning Nanodegree
---
Below is the code I wrote for [this](https://classroom.udacity.com/nanodegrees/nd009/parts/3d764b58-dc1f-4f7b-b0e1-6b60359e0af4/modules/f8617d67-d59a-4aec-a8fd-050d60c2b7eb/lessons/7967566162/concepts/79650560452589030923#) exercise ie Evaluate the accuracy in *EVALUATION AND VALIDATION[P1]*
`#
# In this and the following exercises, you'll be adding train test splits to the data
# to see how it changes the performance of each classifier
#
# The code provided will load the Titanic dataset like you did in project 0, then train
# a decision tree (the method you used in your project) and a Bayesian classifier (as
# discussed in the introduction videos). You don't need to worry about how these work for
# now.
#
# What you do need to do is import a train/test split, train the classifiers on the
# training data, and store the resulting accuracy scores in the dictionary provided.

import numpy as np
import pandas as pd

# Load the dataset
X = pd.read_csv('titanic_data.csv')
# Limit to numeric data
X = X._get_numeric_data()
# Separate the labels
y = X['Survived']
# Remove labels from the inputs, and age due to missing data
del X['Age'], X['Survived']

from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import GaussianNB
from sklearn.cross_validation import train_test_split

# TODO: split the data into training and testing sets,
# using the standard settings for train_test_split.
# Then, train and test the classifiers with your newly split data instead of X and y.
x_train, x_test, y_train, y_test = train_test_split(X, y, test_size = 0.4, random_state = 0)

# The decision tree classifier
clf1 = DecisionTreeClassifier()
clf1.fit(x_train, y_train)
decision_tree = accuracy_score(y_test, clf1.predict(x_test))
print "Decision Tree has accuracy: ", decision_tree

# The naive Bayes classifier
clf2 = GaussianNB()
clf2.fit(x_train, y_train)
naive_bayes = accuracy_score(y_test, clf2.predict(x_test))
print "GaussianNB has accuracy: ", naive_bayes

answer = {
 "Naive Bayes Score": naive_bayes,
 "Decision Tree Score": decision_tree
}`

First I am going to log what I I have learned from this exercise and also what i have remembered till now:

To test a Machine Learning Alghorithm, we distribute it into two parts, Train and Test, Its is usually a 80:20 division of the whole datatset. The training dataset need to be 80% of that whole, as it is better to have have as much as data to train your alghorithm to improve its accuracy.
After that we try testing our alghorithm with our testing dataset ie the 20% of our data and evaluate the accuracy.

In this exercise, we took the dataset and ran them through 2 scikit learn alghorithms ie Decision Tree and GaussianNB,
<!-- TODO: Write another post on Difference between all the major scikit learn alghorithms, Pros and cons. -->

This is the steps I think one need to remember if I have to do Evaluating Accuracy again,

 add
 ` from sklearn.cross_validation import train_test_split `

 divide them into train and test
 ` x_train, x_test, y_train, y_test = train_test_split(X, y, test_size = 0.4, random_state = 0) `

 Evaluate for accuracy
 `clf1 = DecisionTreeClassifier()
 clf1.fit(x_train, y_train)
 decision_tree = accuracy_score(y_test, clf1.predict(x_test))`

and this code returned
`Decision Tree has accuracy:  0.655462184874
GaussianNB has accuracy:  0.672268907563`
which seems to show that GaussianNB is showing more accuracy in our current dataset.

###Understanding classifiers line by line,

Assign the classifier to a simpler variable
`clf2 = GaussianNB()`

.fit() actually inputs the training data to the classifier
`clf2.fit(x_train, y_train)`

Now `accuracy_score()` will go through every value in y_test and try to predict its value and then will compare that with its original x_test value.
`naive_bayes = accuracy_score(y_test, clf2.predict(x_test))`
