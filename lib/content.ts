import type { CategoryId } from "@/lib/types";

export const pipeline = [
  {
    step: "01",
    title: "Un dépôt Git, un paquet RPM",
    where: "github.com/sailfishos",
    text: "Chaque dépôt public est en général un paquet au format tar_git : les sources, un fichier rpm/*.spec, parfois un sous-module vers un miroir upstream. Un tag Git prévient l’Open Build Service par webhook.",
  },
  {
    step: "02",
    title: "L’OBS compile les RPM",
    where: "build.sailfishos.org",
    text: "L’Open Build Service construit le paquet dans un environnement tiré de ses BuildRequires. La promotion documentée passe par devel, puis testing, puis release. Les appareils suivent l’un de ces niveaux.",
  },
  {
    step: "03",
    title: "Les patterns choisissent le contenu",
    where: "méta-paquets RPM",
    text: "Un pattern est un RPM vide qui dépend d’autres paquets. Le kickstart de l’appareil ne liste pas des centaines de noms : il tire un pattern de configuration, qui tire l’interface, le cœur, les applications, puis l’adaptation matérielle.",
  },
  {
    step: "04",
    title: "mic assemble l’image",
    where: "sailfishos/mic",
    text: "mic lit le kickstart (.ks) de l’appareil et produit le rootfs. Pour un port, la commande documentée dans le Platform SDK est rpm/dhd/helpers/build_packages.sh --mic. L’archive obtenue est l’image flashable.",
  },
] as const;

export const patterns = [
  {
    name: "patterns-sailfish-device-configuration-@DEVICE@",
    role: "Pattern racine de l’image d’un appareil.",
  },
  {
    name: "patterns-sailfish-device-adaptation-@DEVICE@",
    role: "Paquets matériels, Hybris compris.",
  },
  {
    name: "patterns-sailfish-ui",
    role: "Cœur, session Qt/Wayland, homescreen Lipstick, animation de charge.",
  },
  {
    name: "patterns-sailfish-core",
    role: "Paquets requis sur un appareil, middleware compris.",
  },
  {
    name: "patterns-sailfish-applications",
    role: "Applications de base.",
  },
  {
    name: "patterns-sailfish-mw",
    role: "Middleware générique.",
  },
];

export const strata: {
  id: CategoryId | "outside";
  depth: string;
  title: string;
  text: string;
}[] = [
  {
    id: "interface",
    depth: "Surface",
    title: "Applications et homescreen",
    text: "Navigateur, appareil photo, bureau, appels, clavier Maliit, lanceur. Lipstick compose les fenêtres Wayland.",
  },
  {
    id: "comms",
    depth: "Au-dessus du middleware",
    title: "Réseau, téléphone, synchro",
    text: "ConnMan, oFono, BlueZ, Buteo, historique de messages, GeoClue, NFC.",
  },
  {
    id: "media",
    depth: "Middleware",
    title: "Audio, capteurs, multimédia",
    text: "PulseAudio et ohm pour le routage audio, SensorFW, GStreamer. gst-droid et droidmedia exposent les codecs Android.",
  },
  {
    id: "qt",
    depth: "Socle graphique",
    title: "Qt, Wayland, Mesa",
    text: "Les applications sont en Qt/QML. L’affichage passe par Wayland. Mesa fournit l’OpenGL ES logiciel, remplaçable à la construction de l’image.",
  },
  {
    id: "system",
    depth: "Session",
    title: "systemd, énergie, confinement",
    text: "systemd enchaîne l’arrêt, la charge écran éteint, la mise à jour et la session qui démarre Lipstick. MCE, dsme, timed, usb-moded et Sailjail sont à cet étage.",
  },
  {
    id: "distro",
    depth: "Fond",
    title: "Userland GNU empaqueté",
    text: "La majorité des dépôts. glibc, bash, coreutils, Python, X11, et des centaines de bibliothèques reprises d’upstream, chacune dans son RPM.",
  },
  {
    id: "outside",
    depth: "Sous le fond",
    title: "Noyau et adaptation Android",
    text: "Le noyau n’est pas livré avec l’OS. Il vient de l’adaptation. Sur téléphone Android, cette couche est dans l’organisation mer-hybris : libhybris, droid-hal, droid-config.",
  },
];

export type Principal = {
  name: string;
  text: string;
};

export const principalGroups: {
  id: string;
  title: string;
  lede: string;
  repos: Principal[];
}[] = [
  {
    id: "assemblage",
    title: "Assemblage de l’image",
    lede: "Ces dépôts produisent ou décrivent l’image. Ils ne contiennent pas le code du système.",
    repos: [
      {
        name: "mic",
        text: "Image Creator. Il crée le rootfs à partir d’un kickstart : c’est l’outil qui sort l’image du système.",
      },
      {
        name: "sailfish-version",
        text: "Paquet qui porte le numéro de version du système.",
      },
      {
        name: "pykickstart",
        text: "Lecture des fichiers kickstart utilisés pour décrire une image.",
      },
      {
        name: "mer-kickstarter-configs",
        text: "Anciennes configurations du générateur de kickstarts, du temps de Mer. Dernier changement en avril 2021.",
      },
      {
        name: "sailfish-snapshot",
        text: "Outil d’image d’usine et de snapshot.",
      },
      {
        name: "ssu",
        text: "Sur l’appareil, choisit les dépôts RPM suivis : release, testing, devel, et l’adaptation matérielle. C’est l’aiguillage des mises à jour.",
      },
      {
        name: "zypper",
        text: "Gestionnaire de paquets en ligne de commande, avec libzypp.",
      },
      {
        name: "PackageKit",
        text: "Installation des RPM pour les outils graphiques et le SDK (sdk-deploy-rpm s’appuie dessus).",
      },
    ],
  },
  {
    id: "systeme",
    title: "Ce qui fait tourner l’appareil",
    lede: "Le cœur ouvert de la session et du middleware. Un dépôt par service.",
    repos: [
      {
        name: "systemd",
        text: "Sessions système : arrêt, charge écran éteint, mode de mise à jour, session utilisateur.",
      },
      {
        name: "lipstick",
        text: "Compositor Wayland, lanceur, verrouillage et notifications. Le habillage QML Jolla est posé dessus.",
      },
      {
        name: "mce",
        text: "Mode Control Entity : touches, proximité, veille et contrôle de l’affichage.",
      },
      {
        name: "dsme",
        text: "Watchdog et appui long sur le bouton d’alimentation.",
      },
      {
        name: "timed",
        text: "Horloge, alarmes et fuseau horaire.",
      },
      {
        name: "usb-moded",
        text: "Rôle du port USB, dont le MTP avec buteo-mtp.",
      },
      {
        name: "sailjail",
        text: "Confinement des applications, avec sailjail-permissions.",
      },
      {
        name: "ofono",
        text: "Téléphonie et modem. Fourche du projet oFono.",
      },
      {
        name: "connman",
        text: "Connexions réseau : Wi-Fi via wpa_supplicant, données mobiles via oFono.",
      },
      {
        name: "bluez5",
        text: "Bluetooth. Sur Android 8 et plus, le lien HAL passe par bluebinder dans mer-hybris.",
      },
      {
        name: "buteo-syncfw",
        text: "Moteur de synchronisation (calendrier, contacts, courriel).",
      },
      {
        name: "commhistory-daemon",
        text: "Historique unifié des messages, avec libcommhistory et telepathy-ring.",
      },
      {
        name: "geoclue",
        text: "Position. Les fournisseurs GPS Hybris sont dans mer-hybris.",
      },
      {
        name: "nfcd",
        text: "Daemon NFC.",
      },
      {
        name: "pulseaudio",
        text: "Audio bas niveau. Le routage est décidé par ohm et pulseaudio-policy-enforcement.",
      },
      {
        name: "sensorfw",
        text: "Capteurs. Le branchement HAL Android est dans les plugins hybris, côté adaptation.",
      },
      {
        name: "glibc",
        text: "Bibliothèque C du système. La documentation d’architecture indique glibc 2.30.",
      },
    ],
  },
  {
    id: "ui",
    title: "Interface et applications ouvertes",
    lede: "Ce que l’on voit, quand le code est public. Silica et le homescreen Jolla n’y sont pas.",
    repos: [
      {
        name: "sailfish-browser",
        text: "Navigateur, dépôt le plus suivi de l’organisation. Le chrome est en QML, le moteur est Gecko.",
      },
      {
        name: "gecko-dev",
        text: "Moteur Gecko embarqué, avec qtmozembed et embedlite-components.",
      },
      {
        name: "maliit-framework",
        text: "Clavier virtuel, avec maliit-plugins et la prédiction tt9.",
      },
      {
        name: "mapplauncherd",
        text: "Préchargement des applications, dont le booster Silica.",
      },
      {
        name: "jolla-camera",
        text: "Application appareil photo. Les codecs matériels passent par gst-droid et droidmedia.",
      },
      {
        name: "voicecall",
        text: "Interface d’appel.",
      },
      {
        name: "sailfish-office",
        text: "Suite bureautique, au-dessus de Calligra.",
      },
      {
        name: "qtbase",
        text: "Qt, socle de toutes les applications. qtdeclarative porte QML, qtwayland porte l’affichage.",
      },
      {
        name: "mesa",
        text: "OpenGL ES et EGL logiciels (LLVMpipe), remplaçables par le pilote de l’appareil au moment de l’image.",
      },
    ],
  },
  {
    id: "sdk",
    title: "SDK, à côté de l’OS",
    lede: "Ces dépôts construisent les outils du développeur. L’image système, elle, sort de mic.",
    repos: [
      {
        name: "scratchbox2",
        text: "Bac de compilation croisée du Platform SDK. La commande mb2, derrière sfdk, s’en sert pour produire des RPM.",
      },
      {
        name: "sdk-setup",
        text: "Utilitaires d’installation et de configuration du SDK.",
      },
      {
        name: "sdk-build-tools",
        text: "Scripts qui fabriquent le SDK lui-même : Qt statique pour l’installeur, Qt Creator, gdb croisé.",
      },
      {
        name: "sailfish-qtcreator",
        text: "IDE du SDK applicatif.",
      },
    ],
  },
  {
    id: "hw",
    title: "Adaptation présente dans cette organisation",
    lede: "Le pont Android et les noyaux de téléphone sont surtout dans mer-hybris. Ici, seulement la colle multimédia et le noyau PC.",
    repos: [
      {
        name: "droidmedia",
        text: "Service multimédia Android utilisé par gst-droid pour la caméra et les codecs matériels.",
      },
      {
        name: "gst-droid",
        text: "Plugin GStreamer qui parle à droidmedia, donc au HAL Android.",
      },
      {
        name: "kernel-adaptation-pc",
        text: "Adaptation noyau pour le PC. Les téléphones reçoivent leur noyau par l’adaptation matérielle, pas par ce dépôt.",
      },
      {
        name: "android-tools-hadk",
        text: "Outils Android utilisés par le guide de portage HADK.",
      },
      {
        name: "mer-kernel-checks",
        text: "Vérifie que la configuration du noyau couvre ce que le système attend. Noyau minimum documenté : 3.4 patché, 4.4 recommandé.",
      },
    ],
  },
];

export const elsewhere = [
  {
    title: "Open Build Service",
    href: "https://build.sailfishos.org",
    meta: "Compilation des RPM",
    text: "Instance OBS de Sailfish OS. Un tag sur un dépôt Git déclenche le build. Les projets de ports communautaires gardent souvent des noms nemo:devel:hw:<vendeur>:<appareil>. La documentation parle encore de mer:core comme exemple de projet devel.",
  },
  {
    title: "mer-hybris",
    href: "https://github.com/mer-hybris",
    meta: "157 dépôts · adaptation Android",
    text: "Là où se construit le lien avec un téléphone Android : libhybris, libgbinder, hybris-boot, droid-hal, droid-config, qt5-qpa-hwcomposer-plugin, ofono-ril-binder-plugin, bluebinder, audioflingerglue. Le droid-config de l’appareil porte le pattern d’adaptation et le kickstart consommé par mic.",
  },
  {
    title: "Guide HADK",
    href: "https://hadk.sailfishos.org/mic/",
    meta: "Image flashable d’un port",
    text: "Le Hardware Adaptation Development Kit installe le Platform SDK, fait construire les paquets d’adaptation, puis appelle mic. C’est la procédure ouverte pour obtenir une image, appareil par appareil.",
  },
  {
    title: "sailfishos-mirror",
    href: "https://github.com/sailfishos-mirror",
    meta: "564 dépôts · miroirs upstream",
    text: "Miroirs des projets upstream référencés en sous-modules. Le correctif Sailfish reste dans le dépôt de packaging, sous forme de patch rpm/*.patch.",
  },
  {
    title: "sailfishos-chum",
    href: "https://github.com/sailfishos-chum",
    meta: "313 dépôts · communauté",
    text: "Dépôt communautaire d’applications. Il ne constitue pas le système de base.",
  },
  {
    title: "Arbres fermés",
    href: "https://docs.sailfishos.org/Services/Development/Sailfish_OS_Source/",
    meta: "Code propriétaire Jolla",
    text: "Silica (composants QML), le homescreen posé sur Lipstick, le client du Store et Alien Dalvik n’ont pas de dépôt public. La documentation Jolla décrit des arbres git fermés pour ce code. Les patterns qui définissent l’image commerciale n’apparaissent pas non plus dans les 964 dépôts indexés.",
  },
];

export const merHybrisCores = [
  { name: "libhybris", href: "https://github.com/mer-hybris/libhybris" },
  { name: "libgbinder", href: "https://github.com/mer-hybris/libgbinder" },
  { name: "hybris-boot", href: "https://github.com/mer-hybris/hybris-boot" },
  { name: "droid-hal-device", href: "https://github.com/mer-hybris/droid-hal-device" },
  { name: "droid-hal-configs", href: "https://github.com/mer-hybris/droid-hal-configs" },
  {
    name: "qt5-qpa-hwcomposer-plugin",
    href: "https://github.com/mer-hybris/qt5-qpa-hwcomposer-plugin",
  },
  {
    name: "ofono-ril-binder-plugin",
    href: "https://github.com/mer-hybris/ofono-ril-binder-plugin",
  },
  { name: "hadk-faq", href: "https://github.com/mer-hybris/hadk-faq" },
];

export const sources = [
  {
    label: "Architecture",
    href: "https://docs.sailfishos.org/Reference/Architecture/",
  },
  {
    label: "Patterns et images",
    href: "https://docs.sailfishos.org/Reference/Software_Packaging/Patterns_and_Images/",
  },
  {
    label: "Code source",
    href: "https://docs.sailfishos.org/Services/Development/Sailfish_OS_Source/",
  },
  {
    label: "Open Build Service",
    href: "https://docs.sailfishos.org/Services/Development/Open_Build_Service/",
  },
  {
    label: "HADK, création du rootfs",
    href: "https://hadk.sailfishos.org/mic/",
  },
  {
    label: "Sources par release",
    href: "https://releases.sailfishos.org/sources/",
  },
];
