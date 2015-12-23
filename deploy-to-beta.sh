#!/bin/bash

middleman build
rsync -trv build/ beta.mp.se:/var/www/html
