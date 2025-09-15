function initAutoLinker() {
  const links = {
    Plex: "https://plex.tv/",
    Plexamp: "https://www.plex.tv/en-gb/plexamp/",
    Jellyfin: "https://jellyfin.org/",
    "Home Assistant": "https://www.home-assistant.io/",
    Frigate: "https://frigate.video/",
    Powershell: "https://learn.microsoft.com/en-us/powershell/",
    Docker: "https://www.docker.com/",
    Proxmox: "https://www.proxmox.com/",
    ESPHome: "https://esphome.io/",
    CarPlay: "https://www.apple.com/uk/ios/carplay/",
    "Android Auto": "https://www.android.com/intl/en_uk/auto/"
  };
  const contentArea = document.getElementById("content-area");

  if (!contentArea) {
    console.warn("Content area not found for auto-linker. Auto-linking skipped.");
    return;
  }

  const treeWalker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (node.parentNode.nodeName === "A" ||
          node.parentNode.nodeName === "SCRIPT" ||
          node.parentNode.nodeName === "STYLE" ||
          node.parentNode.closest(".tag") ||
          node.parentNode.nodeName.match(/^H[1-3]$/) ||
          node.nodeValue.trim().length === 0) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  }, false);

  const textNodes = [];
  let currentNode;
  while ((currentNode = treeWalker.nextNode())) {
    textNodes.push(currentNode);
  }

  textNodes.forEach(node => {
    let parentNodes = [node];
    for (const term in links) {
      const url = links[term];
      const regex = new RegExp(`\\b(${term})(?!\\w)`, "gi");
      let newNodes = [];

      parentNodes.forEach(parentNode => {
        if (parentNode.nodeType === Node.TEXT_NODE) {
          let text = parentNode.nodeValue;
          let lastIndex = 0;
          let match;
          while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
              newNodes.push(document.createTextNode(text.substring(lastIndex, match.index)));
            }
            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = match[0];
            newNodes.push(link);
            lastIndex = match.index + match[0].length;
          }
          if (lastIndex < text.length) {
            newNodes.push(document.createTextNode(text.substring(lastIndex)));
          }
          if (newNodes.length) {
            newNodes.forEach(newNode => parentNode.parentNode.insertBefore(newNode, parentNode));
            parentNode.parentNode.removeChild(parentNode);
          }
        } else {
          newNodes.push(parentNode);
        }
      });
      parentNodes = newNodes;
    }
  });
}

document.addEventListener('DOMContentLoaded', initAutoLinker);
