function initAutoLinker(){
  let e = {
    Plex:"https://plex.tv/",
    Plexamp:"https://www.plex.tv/en-gb/plexamp/",
    Jellyfin:"https://jellyfin.org/",
    "Home Assistant":"https://www.home-assistant.io/",
    Frigate:"https://frigate.video/",
    Powershell:"https://learn.microsoft.com/en-us/powershell/",
    Docker:"https://www.docker.com/",
    Proxmox:"https://www.proxmox.com/"
  };
  let t = document.getElementById("content-area");

  if(!t){
    console.warn("Content area not found for auto-linker. Auto-linking skipped.");
    return;
  }

  let n = document.createTreeWalker(t,NodeFilter.SHOW_TEXT,{
    acceptNode:function(e){
      return"A"===e.parentNode.nodeName||"SCRIPT"===e.parentNode.nodeName||"STYLE"===e.parentNode.nodeName||e.parentNode.nodeName.match(/^H[1-3]$/)||0===e.nodeValue.trim().length?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT
    }
  },!1);

  let o, r=[];
  for(;o=n.nextNode();)r.push(o);

  r.forEach(t=>{
    let n=[t];
    for(let o in e){
      let r=e[o];
      // MODIFIED LINE: Changed the trailing \b to (?!\w) for more robust matching with punctuation
      let a=RegExp(`\\b(${o})(?!\\w)`,"gi");
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
            n=a.lastIndex;
          }
          n<t.length&&l.push(document.createTextNode(t.substring(n))),
          0===l.length&&l.push(e);
        } else {
          l.push(e);
        }
      });
      n=l;
    }
    n.forEach(e=>{t.parentNode.insertBefore(e,t)}),
    t.parentNode.removeChild(t);
  });
}
document.addEventListener("DOMContentLoaded",initAutoLinker);
