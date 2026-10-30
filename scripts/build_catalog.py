#!/usr/bin/env python3
"""Classifie le snapshot GitHub de l'organisation sailfishos.

Lit data/snapshot.json (produit par l'API de recherche GitHub) et écrit
data/catalog.json ainsi que data/stats.json.

Option --fetch : retélécharge le snapshot (quota de l'API search).
"""

from __future__ import annotations

import argparse
import json
import urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / "data" / "snapshot.json"
CATALOG = ROOT / "data" / "catalog.json"
STATS = ROOT / "data" / "stats.json"

# Ordre d'affichage. Les identifiants sont stables (liens ?couche=).
CATEGORIES = [
    ("image", "Assemblage de l'image"),
    ("updates", "Version et mises à jour"),
    ("sdk", "SDK et compilation"),
    ("system", "Démarrage et session"),
    ("interface", "Interface et applications"),
    ("comms", "Réseau, téléphone, synchro"),
    ("media", "Audio, capteurs, multimédia"),
    ("adaptation", "Adaptation matérielle"),
    ("qt", "Qt, Wayland et rendu"),
    ("docs", "Documentation"),
    ("distro", "Reste de la distribution"),
]

EXACT = {
    # Image
    "mic": "image",
    "pykickstart": "image",
    "mer-kickstarter-configs": "image",
    "mer-release": "image",
    "repomd-pattern-builder": "image",
    "sailfish-snapshot": "image",
    "sailfish-version": "image",
    "hw-ramdisk": "image",
    # Mises à jour / pile RPM
    "ssu": "updates",
    "ssu-sysinfo": "updates",
    "nemo-osupdate": "updates",
    "zypper": "updates",
    "libzypp": "updates",
    "libzypp-bindings": "updates",
    "libsolv": "updates",
    "PackageKit": "updates",
    "PackageKit-Qt": "updates",
    "rpm": "updates",
    "createrepo_c": "updates",
    "deltarpm": "updates",
    "rpmlint": "updates",
    "rpmlint-MeeGo": "updates",
    "rpmlint-mini": "updates",
    # SDK
    "scratchbox2": "sdk",
    "sailfish-qtcreator": "sdk",
    "sailfish-svg2png": "sdk",
    "qemu-usermode": "sdk",
    "osc": "sdk",
    "fakechroot": "sdk",
    "fakeroot": "sdk",
    "cross-template-inject": "sdk",
    "cross-template-sysroot": "sdk",
    "meego-rpm-config": "sdk",
    "spectacle": "sdk",
    "sb2-as-template": "sdk",
    "sb2-obs-diagnostics-template": "sdk",
    "sb2-tools-qt5": "sdk",
    "sb2-tools-template": "sdk",
    # Session / machine
    "systemd": "system",
    "systemd-bootchart": "system",
    "systemd-user-session-targets": "system",
    "dsme": "system",
    "libdsme": "system",
    "timed": "system",
    "tzdata-timed": "system",
    "mce": "system",
    "mce-dev": "system",
    "libmce-glib": "system",
    "libmce-qt": "system",
    "usb-moded": "system",
    "libusb-moded-qt": "system",
    "sailjail": "system",
    "sailjail-permissions": "system",
    "firejail": "system",
    "user-managerd": "system",
    "profiled": "system",
    "libprofile-qt": "system",
    "statefs": "system",
    "statefs-loader-qt": "system",
    "statefs-provider-power-emu": "system",
    "statefs-providers": "system",
    "statefs-qt": "system",
    "libiphb": "system",
    "btrfs-balancer": "system",
    "udisks2": "system",
    "polkit": "system",
    "polkit-qt-1": "system",
    "sailfish-access-control": "system",
    "sailfish-secrets": "system",
    "sailfish-polkit-agent": "system",
    "libsailfishkeyprovider": "system",
    "vault": "system",
    "password-manager": "system",
    "tojblockd": "system",
    "connectionagent": "system",
    "input-event-daemon": "system",
    "initrd-helpers": "system",
    "mkinitrd": "system",
    "mkdevnodes": "system",
    "mingetty": "system",
    "plymouth-lite": "system",
    "oneshot": "system",
    "dbus": "system",
    "glibc": "system",
    "nemo-keepalive": "system",
    "libdbusaccess": "system",
    "libdbuslog": "system",
    "libresource": "system",
    "libresourceqt": "system",
    # Interface
    "lipstick": "interface",
    "maliit-framework": "interface",
    "maliit-plugins": "interface",
    "yamui": "interface",
    "minui": "interface",
    "tt9": "interface",
    "fingerterm": "interface",
    "libsailfishapp": "interface",
    "mapplauncherd": "interface",
    "mapplauncherd-booster-silica": "interface",
    "sailfish-browser": "interface",
    "sailfish-components-webview": "interface",
    "sailfish-office": "interface",
    "sailfish-utilities": "interface",
    "sailfish-weather": "interface",
    "sailfish-fonts": "interface",
    "sailfish-locale": "interface",
    "sailfish-labs": "interface",
    "sailfish-log-viewer": "interface",
    "sailfish-nfcshare": "interface",
    "sailfish-settings-labs": "interface",
    "sailfish-setup": "interface",
    "sailfish-components-accounts": "interface",
    "sailfish-components-gallery": "interface",
    "sailfish-account-mastodon": "interface",
    "sailfish-account-nextcloud": "interface",
    "jolla-bootchart": "interface",
    "jolla-camera": "interface",
    "jolla-gallery": "interface",
    "jolla-notes": "interface",
    "gecko-dev": "interface",
    "gecko-embedlite": "interface",
    "gecko-camera": "interface",
    "embedlite-components": "interface",
    "qtmozembed": "interface",
    "voicecall": "interface",
    "sample-app-c": "interface",
    "sample-app-cppqml": "interface",
    "python-sample": "interface",
    "qmllive": "interface",
    "calligra": "interface",
    "mlite": "interface",
    "libmlocale": "interface",
    "libcontentaction": "interface",
    # Comms
    "ofono": "comms",
    "connman": "comms",
    "connman-network-monitor": "comms",
    "bluez5": "comms",
    "libconnman-qt": "comms",
    "libqofono": "comms",
    "libqofonoext": "comms",
    "libgofono": "comms",
    "libgofonoext": "comms",
    "libgrilio": "comms",
    "libgsupplicant": "comms",
    "wpa_supplicant": "comms",
    "messagingframework": "comms",
    "commhistory-daemon": "comms",
    "libcommhistory": "comms",
    "contactsd": "comms",
    "mkcal": "comms",
    "mms-engine": "comms",
    "nfcd": "comms",
    "nfcd-policy-plugin": "comms",
    "libnfcdef": "comms",
    "geoclue": "comms",
    "gpsd": "comms",
    "mlsdb-data": "comms",
    "mobile-broadband-provider-info": "comms",
    "cell-broadcast-provider-info": "comms",
    "libphonenumber": "comms",
    "amber-web-authorization": "comms",
    "sailfish-connman-plugin-iptables": "comms",
    "provisioning-service": "comms",
    "iw": "comms",
    "rfkill": "comms",
    "ppp": "comms",
    "pptp": "comms",
    "xl2tpd": "comms",
    "openvpn": "comms",
    "openconnect": "comms",
    "openfortivpn": "comms",
    "vpnc": "comms",
    "wireguard-tools": "comms",
    "tayga": "comms",
    "pacrunner": "comms",
    "crda": "comms",
    "wireless-regdb": "comms",
    # Media
    "pulseaudio": "media",
    "pulseaudio-module-keepalive": "media",
    "pulseaudio-modules-bluez4": "media",
    "pulseaudio-modules-nemo": "media",
    "pulseaudio-policy-enforcement": "media",
    "ohm": "media",
    "ohm-plugins-misc": "media",
    "ohm-rule-engine": "media",
    "libdres-ohm": "media",
    "libtrace-ohm": "media",
    "ngfd": "media",
    "ngfd-plugin-pulse": "media",
    "libngf": "media",
    "libngf-qt": "media",
    "sensorfw": "media",
    "sensors-glib": "media",
    "droidmedia": "media",
    "gst-droid": "media",
    "gst-droidcamsrc": "media",
    "gst-omx": "media",
    "gst-jolla": "media",
    "amber-mpris": "media",
    "localsearch": "media",
    "tinysparql": "media",
    "thumbnaild": "media",
    "ffmpeg": "media",
    "nemo-gst-interfaces": "media",
    "nemo-qtmultimedia-plugins": "media",
    "libaudioresource": "media",
    "libaudioresource-qt": "media",
    "qtdocgallery": "media",
    "grilo": "media",
    "grilo-plugins": "media",
    "transfer-engine": "media",
    # Adaptation (ce qui, dans CETTE org, touche au matériel Android ou au noyau)
    "android-tools": "adaptation",
    "android-tools-hadk": "adaptation",
    "kernel-adaptation-pc": "adaptation",
    "kernel-headers": "adaptation",
    "mer-kernel-checks": "adaptation",
    "droid-fonts": "adaptation",
    "gmp-droid": "adaptation",
    "binder-utils": "adaptation",
    "qtscenegraph-adaptation": "adaptation",
    # Docs
    "docs.sailfishos.org": "docs",
    "issue-tracker": "docs",
    "sdk-user-manual": "docs",
    "sailfish-qdoc-template": "docs",
    "mer-qdoc-template": "docs",
    "sailfish-api-patterns": "docs",
    "toh-designs": "docs",
    "mer-gfx-tests": "docs",
}

PREFIXES = [
    ("nemo-qml-plugin-", "interface"),
    ("nemo-", "interface"),
    ("jolla-", "interface"),
    ("sdk-", "sdk"),
    ("sb2-", "sdk"),
    ("sailfish-", "interface"),
    ("xorg-", "distro"),
    ("python3-", "distro"),
    ("python-", "distro"),
    ("perl-", "distro"),
    ("gst-", "media"),
    ("pulseaudio", "media"),
    ("telepathy-", "comms"),
    ("buteo-", "comms"),
    ("libaccounts-", "comms"),
    ("libsignon", "comms"),
    ("signon-", "comms"),
    ("libqofono", "comms"),
    ("libgofono", "comms"),
    ("nfcd", "comms"),
    ("mce", "system"),
    ("systemd", "system"),
    ("statefs", "system"),
    ("mapplauncherd", "interface"),
    ("qt", "qt"),
    ("wayland", "qt"),
    ("mesa", "qt"),
    ("llvm", "qt"),
    ("android-tools", "adaptation"),
    ("kernel-", "adaptation"),
    ("droid", "adaptation"),
    ("gecko-", "interface"),
    ("embedlite-", "interface"),
]


def classify(name: str) -> str:
    if name in EXACT:
        return EXACT[name]
    for prefix, category in PREFIXES:
        if name.startswith(prefix):
            return category
    return "distro"


def fetch_snapshot() -> list[dict]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "sailfish-map",
    }
    items: list[dict] = []
    for page in range(1, 11):
        url = (
            "https://api.github.com/search/repositories"
            f"?q=org:sailfishos&per_page=100&page={page}&sort=updated"
        )
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=60) as response:
            payload = json.loads(response.read().decode())
        batch = payload.get("items") or []
        print(f"page {page}: {len(batch)} total={payload.get('total_count')}")
        items.extend(batch)
        if len(batch) < 100:
            break
    slim = []
    seen = set()
    for repo in items:
        if repo["full_name"] in seen:
            continue
        seen.add(repo["full_name"])
        slim.append(
            {
                "name": repo["name"],
                "desc": repo.get("description") or "",
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "pushed": repo.get("pushed_at"),
                "updated": repo.get("updated_at"),
                "created": repo.get("created_at"),
                "lang": repo.get("language"),
                "archived": repo.get("archived"),
                "fork": repo.get("fork"),
                "default_branch": repo.get("default_branch"),
                "html_url": repo.get("html_url"),
                "topics": repo.get("topics") or [],
                "size": repo.get("size"),
            }
        )
    return slim


def build(repos: list[dict]) -> tuple[dict, dict]:
    labels = dict(CATEGORIES)
    catalog_repos = []
    for repo in repos:
        category = classify(repo["name"])
        catalog_repos.append(
            {
                "name": repo["name"],
                "description": repo.get("desc") or "",
                "stars": repo.get("stars") or 0,
                "forks": repo.get("forks") or 0,
                "pushed": repo.get("pushed"),
                "language": repo.get("lang"),
                "archived": bool(repo.get("archived")),
                "url": repo.get("html_url"),
                "category": category,
            }
        )
    catalog_repos.sort(key=lambda item: item["name"].lower())
    counts = Counter(item["category"] for item in catalog_repos)
    active = Counter(
        item["category"] for item in catalog_repos if not item["archived"]
    )
    stats = {
        "org": "sailfishos",
        "orgUrl": "https://github.com/sailfishos",
        "claimedPublicRepos": 966,
        "indexed": len(catalog_repos),
        "archived": sum(1 for item in catalog_repos if item["archived"]),
        "withoutLanguage": sum(1 for item in catalog_repos if not item["language"]),
        "fetchedAt": "2026-10-30T13:24:00Z",
        "categories": [
            {
                "id": category_id,
                "label": label,
                "count": counts.get(category_id, 0),
                "active": active.get(category_id, 0),
            }
            for category_id, label in CATEGORIES
        ],
    }
    catalog = {"categories": stats["categories"], "repos": catalog_repos}
    return catalog, stats


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--fetch",
        action="store_true",
        help="Retélécharge le snapshot via l'API search GitHub",
    )
    args = parser.parse_args()
    if args.fetch:
        repos = fetch_snapshot()
        SNAPSHOT.write_text(json.dumps(repos))
        print(f"snapshot {len(repos)}")
    else:
        repos = json.loads(SNAPSHOT.read_text())
    catalog, stats = build(repos)
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, separators=(",", ":")))
    STATS.write_text(json.dumps(stats, ensure_ascii=False, indent=2) + "\n")
    print(f"indexed {stats['indexed']} archived {stats['archived']}")
    for category in stats["categories"]:
        print(
            f"{category['count']:4} ({category['active']:4} actifs)  {category['id']:12} {category['label']}"
        )
    print("--- petits tas (noms) ---")
    by_cat: dict[str, list[str]] = {category_id: [] for category_id, _ in CATEGORIES}
    for repo in catalog["repos"]:
        by_cat[repo["category"]].append(repo["name"])
    for category_id, _label in CATEGORIES:
        if category_id in {"distro", "qt"}:
            continue
        print(f"\n## {category_id}")
        print(", ".join(by_cat[category_id]))


if __name__ == "__main__":
    main()
