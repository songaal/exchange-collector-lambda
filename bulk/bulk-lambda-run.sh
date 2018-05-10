#!/bin/bash
trap '' 1
node bulk-lambda-scheduler.js >> system-lambda.log 2>&1 &
