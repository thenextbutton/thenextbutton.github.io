// Function to initialize auto-linking
function initAutoLinker() {
    // Define the keywords and their corresponding URLs
    const keywordMap = {
        'Plex': 'https://plex.tv/',
        'Jellyfin': 'https://jellyfin.org/',
        'Home Assistant': 'https://www.home-assistant.io/',
        'Frigate': 'https://frigate.video/'
        // Add more keywords and URLs as needed
    };

    const contentArea = document.getElementById('content-area');
    if (!contentArea) {
        console.warn("Content area not found for auto-linker. Auto-linking skipped.");
        return;
    }

    // Create a new TreeWalker to traverse text nodes within the contentArea
    // NodeFilter.SHOW_TEXT ensures only text nodes are visited
    const walker = document.createTreeWalker(
        contentArea,
        NodeFilter.SHOW_TEXT,
        {
            // Custom filter function to accept or reject nodes
            acceptNode: function(node) {
                // Reject text nodes that are inside <a>, <script>, <style>, or any H1-H6 tags
                // This prevents linking within existing links, breaking script/style, or modifying headers.
                if (node.parentNode.nodeName === 'A' ||
                    node.parentNode.nodeName === 'SCRIPT' ||
                    node.parentNode.nodeName === 'STYLE' ||
                    node.parentNode.nodeName.match(/^H[1-6]$/)) { // ADDED: Check for H1-H6 tags
                    return NodeFilter.FILTER_REJECT;
                }
                // Only accept text nodes that are not empty or just whitespace
                if (node.nodeValue.trim().length === 0) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false // Not used in modern browsers, but good practice for older compatibility
    );

    let node;
    const textNodesToProcess = [];

    // Collect all eligible text nodes first.
    // We collect them before processing to avoid issues where modifying the DOM
    // during traversal can confuse the TreeWalker.
    while ((node = walker.nextNode())) {
        textNodesToProcess.push(node);
    }

    // Process each collected text node
    textNodesToProcess.forEach(textNode => {
        let currentNodes = [textNode]; // Start with the original text node for processing

        // Iterate through each keyword in the map
        for (const keyword in keywordMap) {
            const url = keywordMap[keyword];
            // Create a regular expression for the current keyword.
            // \b ensures whole word matching (e.g., "Plex" won't match "Complex").
            // 'gi' flags for global (find all occurrences) and case-insensitive.
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');

            let newNodesAfterKeywordProcessing = [];

            // Process each node that resulted from previous keyword replacements
            currentNodes.forEach(nodeToProcess => {
                if (nodeToProcess.nodeType === Node.TEXT_NODE) {
                    // If it's a text node, attempt to replace keywords within it
                    let text = nodeToProcess.nodeValue;
                    let lastIndex = 0;
                    let match;

                    // Find all matches of the current keyword in the text node's value
                    while ((match = regex.exec(text)) !== null) {
                        // Add the text segment before the current match
                        if (match.index > lastIndex) {
                            newNodesAfterKeywordProcessing.push(document.createTextNode(text.substring(lastIndex, match.index)));
                        }

                        // Create the <a> element for the matched keyword
                        const link = document.createElement('a');
                        link.href = url;
                        link.target = '_blank'; // Open link in a new tab
                        link.rel = 'noopener noreferrer'; // Security best practice for target="_blank"
                        link.textContent = match[0]; // Use the actual matched text (preserves original casing)
                        newNodesAfterKeywordProcessing.push(link);

                        lastIndex = regex.lastIndex; // Update lastIndex for the next search
                    }

                    // Add any remaining text after the last match
                    if (lastIndex < text.length) {
                        newNodesAfterKeywordProcessing.push(document.createTextNode(text.substring(lastIndex)));
                    }

                    // If no matches were found in this text node, just keep the original text node
                    // (or the parts of it if it was already split by a previous keyword)
                    if (newNodesAfterKeywordProcessing.length === 0) {
                        newNodesAfterKeywordProcessing.push(nodeToProcess);
                    }

                } else {
                    // If the node is not a text node (e.g., it's already an <a> tag from a previous keyword),
                    // just pass it through to the next stage of processing.
                    newNodesAfterKeywordProcessing.push(nodeToProcess);
                }
            });
            // Update currentNodes to be the result of processing with the current keyword
            currentNodes = newNodesAfterKeywordProcessing;
        }

        // After processing with all keywords, replace the original text node
        // with the new set of nodes (which might include links and new text nodes).
        currentNodes.forEach(newNode => {
            textNode.parentNode.insertBefore(newNode, textNode);
        });
        textNode.parentNode.removeChild(textNode); // Remove the original text node
    });
}

// Call initAutoLinker once on initial DOMContentLoaded
// This ensures auto-linking works for the content present on the very first page load.
document.addEventListener('DOMContentLoaded', initAutoLinker);
