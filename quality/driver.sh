#!/bin/bash

logdir="quality"
logfile="$logdir/quality.log"

echo "Timestamp: $(date)" > $logfile

node src/scripts/clustering/datapoint.test.mjs >> $logfile 2>&1
node src/scripts/clustering/cluster.test.mjs >> $logfile 2>&1
node src/scripts/clustering/knn/knn.test.mjs >> $logfile 2>&1

node src/scripts/canvas/extends/datapoint.test.mjs >> $logfile 2>&1
