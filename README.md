# Carte des dépôts Sailfish OS

Carte de l’organisation [github.com/sailfishos](https://github.com/orgs/sailfishos/repositories) : où l’image du système est assemblée, et quels dépôts portent le cœur, l’interface, le SDK et l’adaptation matérielle.

Sailfish OS est une distribution de paquets RPM. Un dépôt Git correspond en général à un paquet. L’[Open Build Service](https://build.sailfishos.org) compile ces paquets ; [`mic`](https://github.com/sailfishos/mic) assemble l’image à partir d’un kickstart. Le noyau et le pont Android des téléphones sont surtout dans [mer-hybris](https://github.com/mer-hybris).

## Lancer

```bash
npm install
npm run dev
```

L’application écoute sur [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Données

Le catalogue est un relevé statique, produit le 30 octobre 2026 à 14:24 (heure de Paris) via l’API de recherche GitHub. L’organisation annonçait 966 dépôts publics ; l’index en a renvoyé 964.

- `data/snapshot.json` — métadonnées brutes
- `data/catalog.json` — dépôts classés par couche
- `data/stats.json` — compteurs
- `scripts/build_catalog.py` — classement

Pour reclasser sans rappeler GitHub :

```bash
python3 scripts/build_catalog.py
```

Pour retélécharger le snapshot (quota de l’API search, 10 requêtes par minute sans jeton) :

```bash
python3 scripts/build_catalog.py --fetch
```

## Sources

- [Architecture](https://docs.sailfishos.org/Reference/Architecture/)
- [Patterns et images](https://docs.sailfishos.org/Reference/Software_Packaging/Patterns_and_Images/)
- [Code source Sailfish OS](https://docs.sailfishos.org/Services/Development/Sailfish_OS_Source/)
- [HADK — création du rootfs](https://hadk.sailfishos.org/mic/)
