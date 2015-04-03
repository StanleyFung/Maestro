# Maestro

![](https://raw.github.com/StanleyFung/Maestro/master/MaestroConduct/screenshot.jpg)

Video Demo: https://www.youtube.com/watch?v=3bbYb_uMQH0&feature=youtu.be

Maestro utilizes the Myo and Leap Motion to simulate and control music using the motions
a traditional conductor in an orchestral band would.
The Leap Motion detects the position of the right hand and tracks the time intervals between the various conducting motions
to find the beats per minute.
The raw data from the Myo (yaw, pitch, roll) is used to track the position of the left hand, which can raise 
specific frequencies of the song.
All of this is done in parallel and the music is processed and modified in real time.

This project was done for HackWestern 2015 and was done completely in Javascript 
using jQuery,Three.js, and the Myo and Leap Motion SDK.

How to Run:

1. Clone Repo
2. Follow https://github.com/mrdoob/three.js/wiki/How-to-run-things-locally
 and run your local server from the root of this project. (/Maestro).
<br>
Eg.
<br>
cd ~/GitHub/Maestro
<br>
'python -m SimpleHTTPServer'
<br>
3. Go to http://localhost:8000/MaestroConduct/Maestro.html in Chrome 
