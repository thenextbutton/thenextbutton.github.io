import requests, json, os

TOKEN = os.getenv("GH_TOKEN")
HEADERS = {"Authorization": f"token {TOKEN}"}

# Repo-level targets (use pushed_at)
repo_targets = {
    "jellyfin_status": "thenextbutton/jellyfin_status",
    "PiCOW-Garage": "thenextbutton/PiCOW-Garage",
    "powershell": "thenextbutton/powershell"
}

# File-level targets (use last commit date)
file_targets = {
    "camera_offline_v2": {
        "repo": "thenextbutton/home_assistant",
        "path": "blueprints/camera_offline_v2/camera_offline_v2_release.yaml"
    },
    "jellyfin_webhook_v2": {
        "repo": "thenextbutton/home_assistant",
        "path": "blueprints/jellyfin_webhook_handler_v2/jellyfin_webhook_release_v2.yaml"
    },
    "plex_webhook": {
        "repo": "thenextbutton/home_assistant",
        "path": "blueprints/plex_webhook_handler/plex_webhook_release.yaml"
    }
}

output = {}

# Handle repo-level metadata
for name, repo in repo_targets.items():
    try:
        url = f"https://api.github.com/repos/{repo}"
        r = requests.get(url, headers=HEADERS)
        r.raise_for_status()
        data = r.json()
        output[name] = data.get("pushed_at", "unknown")
    except Exception as e:
        print(f"Skipping {name}: {e}")
        continue

# Handle file-level commit history
for name, info in file_targets.items():
    try:
        url = f"https://api.github.com/repos/{info['repo']}/commits?path={info['path']}"
        r = requests.get(url, headers=HEADERS)
        r.raise_for_status()
        commits = r.json()
        if commits:
            output[name] = commits[0]["commit"]["committer"]["date"]
        else:
            output[name] = "unknown"
    except Exception as e:
        print(f"Skipping {name}: {e}")
        continue

# Write to JSON
with open("repo-updates.json", "w") as f:
    json.dump(output, f, indent=2)
