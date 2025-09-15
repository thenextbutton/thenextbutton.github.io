function initAutoLinker(){
  let e = {
    Plex:"https://plex.tv/",
    Plexamp:"https://www.plex.tv/en-gb/plexamp/",
    Jellyfin:"https://jellyfin.org/",
    "Home Assistant":"https://www.home-assistant.io/",
    Frigate:"https://frigate.video/",
    Powershell:\"https://learn.microsoft.com/en-us/powershell/\",
    Docker:"https://www.docker.com/",
    Proxmox:"https://www.proxmox.com/",
    ESPHome:"https://esphome.io/",
    CarPlay:"https://www.apple.com/uk/ios/carplay/",
    "Android Auto":"https://www.android.com/intl/en_uk/auto/"
  };
  let t = document.getElementById("content-area");

  if(!t){
    console.warn("Content area not found for auto-linker. Auto-linking skipped.");
    return;
  }

  let n = document.createTreeWalker(t,NodeFilter.SHOW_TEXT,{
    acceptNode:function(e){
      // MODIFIED: This new condition prevents auto-linking within elements that have the 'tag' class.
      return"A"===e.parentNode.nodeName||\"SCRIPT\"===e.parentNode.nodeName||\"STYLE\"===e.parentNode.nodeName||e.parentNode.closest(".tag")||e.parentNode.nodeName.match(/^H[1-3]$/)||0===e.nodeValue.trim().length?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT
    }
  },!1);

  let o, r=[];
  for(;o=n.nextNode();)r.push(o);

  r.forEach(t=>{
    let n=[t];
    for(let o in e){
      let r=e[o];
      // MODIFIED LINE: Changed the trailing \\b to (?!\\w) for more robust matching with punctuation
      let a=RegExp(`\\\\b(${o})(?!\\\\w)`,"gi");
      let l=[];

      n.forEach(e=>{
        if(e.nodeType===Node.TEXT_NODE){
          let t=e.nodeValue,n=0,o;
          for(;null!==(o=a.exec(t));){
            o.index>n&&l.push(document.createTextNode(t.substring(n,o.index)));
            let i=document.createElement("a");
            i.href=r,
            i.target="_blank",
            i.rel="noopener noreferrer",
            i.textContent=o[0],
            l.push(i),
            n=o.index+o[0].length
          }
          n<t.length&&l.push(document.createTextNode(t.substring(n))),
          l.length&&l.forEach(e=>t.parentNode.insertBefore(e,t)),
          t.parentNode.removeChild(t)
        } else {
          l.push(e);
        }
      });

      n=l;
    }
  })
}

// Ensure the linker runs after content is loaded.
document.addEventListener('DOMContentLoaded', initAutoLinker);
