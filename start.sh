#!/bin/bash
#Start the markdown server
redis-server redis.conf
mongod -f mongod.conf
exit 0
