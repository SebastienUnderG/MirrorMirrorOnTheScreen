
# MirrorMirrorOnTheScreen

Implémentation du Photobooth en version NodeJS avec une interface Disney

librement Inspiré de 2 projets :

Inspiration pour certaines options et réglage :

http://www.instructables.com/id/Raspberry-Pi-photo-booth-controller/

Et d'une morceau de code fonctionnel :

https://github.com/andreknieriem/photobooth
> Voiçi mon fork :
https://github.com/SebastienUnderG/photobooth


L'idée est de créé une activité durant le mariage; un photomaton autonome, simple et qui fonctionne sur Raspberry Pi 3

![Finalement cela donne ça ](https://github.com/SebastienUnderG/MirrorMirrorOnTheScreen/blob/master/Illustrations/IMG_3645_no_exif.jpg "Finalement cela donne ça ")

![alt text](https://raw.githubusercontent.com/SebastienUnderG/MirrorMirrorOnTheScreen/Illustrations/IMG_3645_no_exif.jpg)


## Installation

L'enssemble du code fonctionne sur differentes librairie très simple :

### Gphoto2

Une librairie de controle d'appareil photo numérique

    sudo apt-get install gphoto2 libav-tools

Puis puisque cela ne peut pas etre parfait, il faut supprimer 2-3 fichiers pour éviter que l'appareil soit reconnu par votre interface graphique :

    sudo rm /usr/share/gvfs/mounts/gphoto2.mount
    sudo rm /usr/share/gvfs/remote-volume-monitors/gphoto2.monitor
    sudo rm /usr/lib/gvfs/gvfs-gphoto2-volume-monitor

### CUPS

Un logiciel de gestion des imprimantes édité pas Apple.
Cela à été un enfer à paraméttrer la premiere fois.
Mais dès que vous avez compris ça va vite.

    sudo apt-get install cups

Donc, comme dit précédement, CUPS, est un enfer à celui qui n'y prete pas attention  !
Pour faire simple, par défaut, vous ne pourrez accesséder à l'interface qu'en localhost.
Inteface avec laquel vous aurez à vous familliarisez puisqu'elle vous sera d'une grande aide quand l'imprimante aura des plantages.

Banchez votre imprimante sur le Raspberry Pi puis sur l'interface de ce dernier render-vous via le nagigateur de votre choix à l'adresse suivante :
`http://localhost:631`

il ne vous reste plus qu'à inscrire votre imprimante en local.
Cette action fait entrer la ligne de commande suivante, qui permet à l'utilisateur et le root (pour info le code est executer en sudo/root pour des questions de GPIO)

    lpadmin -p Canon_SELPHY_CP1200 -u allow:pi,root

Normalement c'est bon !

### NodeJS

Bien-sûr le couple NodeJS et npm est indispenssable.

Je le fait tourner sur la version 10 mais cela fonctionne avec la version d'origine de Raspbian.


Installation des dépendances

    sudo npm install

pour des raisons étrange vous devez installer séparement les 3 prochaines dépendances :

    sudo npm install --unsafe-perm --verbose epoll
    sudo npm install --unsafe-perm --verbose onoff
    sudo npm install --unsafe-perm --verbose pigpio



## Usage

Pour le lancer c'est normalemnt simple :

Il faut lancer les excutable nodeJS mais j'ai fait pur cela des .sh pour simplement double cliquer.

Pour le premier lancer il faut lancer

    ./paramettrage.sh

Cette commande va créer la photo d'illustration

Ne pas oublier de paramettrer votre appareil photo pour qu'il ne fournisse

ensuite lancer le serveur

    ./serveur.sh

Laissez lui 10 secondes et lancer la fenettre du navigateur via

    ./window.sh


## Credits

la font https://www.dafont.com/fr/black-chancery.font?

## License

C'est open mais je serai ravi d'avoir des corrections
