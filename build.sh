#! /bin/bash

VERSION=1.3.2

zip -r9 ./exchange-collector-$VERSION.zip ./*.js ./node_modules

echo "compress. exchange-collector-$VERSION.zip"
