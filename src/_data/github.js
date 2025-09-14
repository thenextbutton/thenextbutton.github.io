module.exports = async function() {
  const EleventyFetch = require('@11ty/eleventy-fetch');
  const token = process.env.GH_TOKEN;
  const headers = { 'Authorization': 'token ' + token };
  
  const projectsToTrack = [
      { id: 'now', repo: 'thenextbutton.github.io', path: 'content/now_content.html' },
      { id: 'pi-cow-garage', repo: 'PiCOW-Garage' },
      { id: 'plex-webhooks', repo: 'home_assistant', path: 'blueprints/plex_webhook_handler/plex_webhook_release.yaml' }
  ];

  const projects = {};
  await Promise.all(projectsToTrack.map(async (project) => {
      let apiUrl = `https://api.github.com/repos/thenextbutton/${project.repo}/commits?per_page=1`;
      if (project.path) {
          apiUrl += `&path=${encodeURIComponent(project.path)}`;
      }

      try {
          const json = await EleventyFetch(apiUrl, {
              type: 'json',
              duration: '1d', // Cache for 1 day
              directory: '.cache',
              fetchOptions: { headers: headers }
          });
          if (json.length > 0) {
              const commitDate = new Date(json[0].commit.committer.date);
              const now = new Date();
              const diffDays = Math.floor(Math.abs(now - commitDate) / (1000 * 60 * 60 * 24));
              projects[project.id] = diffDays === 0 ? 'Last updated: today' : `Last updated: ${diffDays} days ago`;
          } else {
              projects[project.id] = 'Last updated: N/A (No commits found)';
          }
      } catch (error) {
          projects[project.id] = 'Last updated: N/A (Build error)';
      }
  }));
  return { lastUpdated: projects };
};
