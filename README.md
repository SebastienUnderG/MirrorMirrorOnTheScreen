# MirrorMirrorOnTheScreen

Implémentation du Photobooth en version NodeJS avec une interface Disney

Je me suis inspiré de https://github.com/SebastienUnderG/photobooth
pour la gestion de la photo via gPhoto2 et de cups

j'ai utilisé cette font : 
https://www.dafont.com/fr/black-chancery.font?



Pour l'installation :

Installer GPHOTO2
sudo apt-get install gphoto2 libav-tools
puis
sudo rm /usr/share/gvfs/mounts/gphoto2.mount
sudo rm /usr/share/gvfs/remote-volume-monitors/gphoto2.monitor
sudo rm /usr/lib/gvfs/gvfs-gphoto2-volume-monitor

Installer CUPS
sudo apt-get install cups

lpadmin -p Canon_SELPHY_CP1200 -u allow:www-data,pi,root


installer les dépendances classique 
sudo npm install

puis les autres dépendances
sudo npm install --unsafe-perm --verbose epoll
sudo npm install --unsafe-perm --verbose onoff
sudo npm install --unsafe-perm --verbose pigpio


Pour le lancer 

Initialiser : 

sudo node app.js -s

puis 

sudo node app.js

lancer un navigateur via ./window.sh


