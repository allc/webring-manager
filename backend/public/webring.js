let webringData;

async function webringSetup() {
  const apiServer = webring.getAttribute('api-server');
  const apiUrl = new URL(`${apiServer}/api/websites/neighbours`);
  apiUrl.search = new URLSearchParams({ currentUrl: webring.getAttribute('url') });
  webringData = await fetch(apiUrl).then(response => response.json());
  if (webring.hasAttribute('inject')) {
    if (webringData.prev) { // random and next should also exist
      const prev = document.createElement('a');
      prev.href = webringData.prev.url;
      prev.textContent = `<- ${webringData.prev.title}`;
      prev.target = '_blank';
      webring.appendChild(prev);

      const random = document.createElement('a');
      random.href = webringData.random.url;
      random.textContent = `RANDOM`;
      random.target = '_blank';
      webring.appendChild(random);

      const next = document.createElement('a');
      next.href = webringData.next.url;
      next.textContent = `${webringData.next.title} ->`;
      next.target = '_blank';
      webring.appendChild(next);
    } else if (webringData.random) {
      const random = document.createElement('a');
      random.href = webringData.random.url;
      random.textContent = `Random Webring Neighbour`;
      random.target = '_blank';
      webring.appendChild(random);
    } else {
      const message = document.createElement('div');
      message.textContent = 'Cannot find neighbours in the webring'
      webring.appendChild(message);
    }
  }
}

webringSetup();
