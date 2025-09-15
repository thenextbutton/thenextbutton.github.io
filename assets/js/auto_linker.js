function initAutoLinker() {
    let links = {
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
    let contentArea = document.getElementById("content-area");

    if (!contentArea) {
        console.warn("Content area not found for auto-linker. Auto-linking skipped.");
        return;
    }

    let treeWalker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            // Reject nodes that are inside specific tags or are empty
            const parentName = node.parentNode.nodeName;
            if (parentName === "A" || parentName === "SCRIPT" || parentName === "STYLE" || parentName === "BUTTON" || parentName.match(/^H[1-3]$/) || node.nodeValue.trim().length === 0) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        }
    }, false);

    let currentNode;
    let nodesToProcess = [];

    // Collect all text nodes first to avoid issues with DOM modifications
    while (currentNode = treeWalker.nextNode()) {
        nodesToProcess.push(currentNode);
    }

    nodesToProcess.forEach(textNode => {
        let newNodes = [textNode]; // Start with the original text node

        for (let keyword in links) {
            const url = links[keyword];
            // Negative lookahead `(?!\w)` ensures the word is not part of another word.
            const regex = new RegExp(`\\b(${keyword})(?!\\w)`, "gi");
            let nextNodes = []; // Nodes for the next iteration

            newNodes.forEach(node => {
                // Only process text nodes
                if (node.nodeType === Node.TEXT_NODE) {
                    let text = node.nodeValue;
                    let lastIndex = 0;
                    let match;
                    
                    while (null !== (match = regex.exec(text))) {
                        // Add text before the match
                        if (match.index > lastIndex) {
                            nextNodes.push(document.createTextNode(text.substring(lastIndex, match.index)));
                        }
                        
                        // Create the link and add it
                        let link = document.createElement("a");
                        link.href = url;
                        link.target = "_blank";
                        link.rel = "noopener noreferrer";
                        link.textContent = match[0];
                        nextNodes.push(link);
                        
                        lastIndex = regex.lastIndex;
                    }
                    
                    // Add any remaining text after the last match
                    if (lastIndex < text.length) {
                        nextNodes.push(document.createTextNode(text.substring(lastIndex)));
                    }

                } else {
                    // If the node isn't a text node (e.g., it's a link from a previous pass),
                    // just add it to the next pass without modification.
                    nextNodes.push(node);
                }
            });
            // Replace the nodes for the next iteration
            newNodes = nextNodes;
        }


        if (newNodes.length > 1) {
            // Insert the new nodes before the original node
            newNodes.forEach(newNode => textNode.parentNode.insertBefore(newNode, textNode));
            // Remove the original text node once all new nodes are in place
            textNode.parentNode.removeChild(textNode);
        }
    });
}