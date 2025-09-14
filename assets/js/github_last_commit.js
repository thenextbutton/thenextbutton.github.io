window.initGithubLastCommit = function () {
  fetch('/repo-updates.json')
    .then(res => res.json())
    .then(data => {
      for (const [key, isoDate] of Object.entries(data)) {
        const el = document.getElementById(`${key}-date`);

        if (el && isoDate) {
          const dateObj = new Date(isoDate);
          el.textContent = `Last updated: ${timeAgo(dateObj)}`;
          // el.title = dateObj.toLocaleString(); // optional tooltip
        } else {
        if (el) el.style.display = 'none';
        }
      }
    })
    .catch(err => console.error("Failed to load repo-updates.json:", err));
};



function timeAgo(date) {
  const now = new Date();

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const nowY = now.getFullYear();
  const nowM = now.getMonth();
  const dateY = date.getFullYear();
  const dateM = date.getMonth();

  const diffMonth = (nowY - dateY) * 12 + (nowM - dateM);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${plural(diffMin)} ago`;
  if (diffHr < 24) return `${diffHr} hour${plural(diffHr)} ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay} day${plural(diffDay)} ago`;
  if (diffDay < 14) return "last week";
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} week${plural(Math.floor(diffDay / 7))} ago`;
  if (diffMonth === 1) return "last month";
  if (diffMonth < 12) return `${diffMonth} month${plural(diffMonth)} ago`;
  return `${diffYear} year${plural(diffYear)} ago`;
}

function plural(n) {
  return n !== 1 ? "s" : "";
}