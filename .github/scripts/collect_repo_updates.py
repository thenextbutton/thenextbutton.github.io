import requests, json, os

TOKEN = os.getenv("GH_TOKEN")
HEADERS = {"Authorization": f"token {TOKEN}"}
targets = {
    "jellyfin_status": "thenextbutton/jellyfin_status",
    "PiCOW-Garage": "thenextbutton/PiCOW-Garage",
    "powershell": "thenextbutton/powershell",
    "camera_offline_v2": "thenextbutton/home_assistant/contents/blueprints/camera_offline_v2/camera_offline_v2_release.yaml",
    "jellyfin_webhook_v2": "thenextbutton/home_assistant/contents/blueprints/jellyfin_webhook_handler_v2/jellyfin_webhook_release_v2.yaml",
    "plex_webhook": "thenextbutton/home_assistant/contents/blueprints/plex_webhook_handler/plex_webhook_release.yaml"
}

output = {}

for name, path in targets.items():
    try:
        if "contents/" in path:
            url = f"https://api.github.com/repos/{path}"
            r = requests.get(url, headers=HEADERS)
            r.raise_for_status()
            data = r.json()
            output[name] = data.get("sha", "unknown")  # fallback if no timestamp
        else:
            url = f"https://api.github.com/repos/{path}"
            r = requests.get(url, headers=HEADERS)
            r.raise_for_status()
            data = r.json()
            output[name] = data.get("pushed_at", "unknown")
    except Exception as e:
        print(f"Skipping {name}: {e}")
        continue

with open("repo-updates.json", "w") as f:
    json.dump(output, f, indent=2)
