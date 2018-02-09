#!/bin/bash

MyPath="/home/appzone/LastMileWeb1/"

cd $MyPath

pwd

#Execute Command 
pkill -9 -f appzone_web_nodejs1
bower install
npm install
nohup nodejs server2.js -Dname=appzone_web_nodejs1 &
