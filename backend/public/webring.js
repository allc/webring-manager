let webringData;

async function webringSetup() {
  const apiServer = webring.getAttribute('api-server');
  const apiUrl = new URL(`${apiServer}/api/websites/neighbours`);
  apiUrl.search = new URLSearchParams({ current: webring.getAttribute('url') });
  const response = await fetch(apiUrl);
  const webringData = await response.json();
  if (response.ok && webringData && webring.hasAttribute('inject')) {
    // remove HTML content
    webring.innerHTML = '';

    if (webringData.prev) {
      const prev = document.createElement('a');
      prev.href = webringData.prev.url;
      prev.textContent = `<- ${webringData.prev.title}`;
      prev.target = '_blank';
      webring.appendChild(prev);
    }

    const randomUrl = new URL(`${apiServer}/api/websites/random`);
    randomUrl.search = new URLSearchParams({ current: webring.getAttribute('url') });
    const random = document.createElement('a');
    random.href = randomUrl;
    random.textContent = `RANDOM`;
    random.target = '_blank';
    webring.appendChild(random);

    if (webringData.next) {
      const next = document.createElement('a');
      next.href = webringData.next.url;
      next.textContent = `${webringData.next.title} ->`;
      next.target = '_blank';
      webring.appendChild(next);
    }
  }
}

webringSetup();
