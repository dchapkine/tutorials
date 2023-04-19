#!/bin/bash

if [ -z "$OPENAI_API_KEY" ]
then
	echo "\$OPEN_API_KEY is empty, get your api key and set the env var"
	exit 1
fi

if [ -z "$1" ]
then
	echo "usage: ./run.sh \"your question\""
	exit 1
fi

python index_and_search.py $1


