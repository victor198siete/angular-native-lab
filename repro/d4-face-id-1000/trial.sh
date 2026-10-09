#!/bin/zsh
# One Face ID trial on the booted iOS simulator: wait, send a face, take a screenshot.
#   ./trial.sh <delay-seconds> <name> [match|nomatch]
# Start it right after the app shows the Face ID sheet. The screenshot lands next to this script.
# Face ID must be enrolled first (Features > Face ID > Enrolled in Simulator, or:
#   xcrun simctl spawn booted notifyutil -s com.apple.BiometricKit.enrollmentChanged 1
#   xcrun simctl spawn booted notifyutil -p com.apple.BiometricKit.enrollmentChanged)
here=${0:A:h}
sleep $1
xcrun simctl spawn booted notifyutil -p com.apple.BiometricKit_Sim.pearl.${3:-match}
sleep 4
xcrun simctl io booted screenshot $here/$2.png >/dev/null 2>&1
echo "sent ${3:-match} after $1 s -> $2.png"
