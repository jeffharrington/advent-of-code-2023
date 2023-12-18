#!/bin/bash

# Initialize directory for Day
# Usage: ./scripts/init.sh 14
mkdir "day$1"
cp "scripts/template.ts" "day$1/part1.ts"
cp "scripts/template.ts" "day$1/part2.ts"
touch "day$1/input.test.txt"
touch "day$1/input.txt"