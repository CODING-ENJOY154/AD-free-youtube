const apiKey = 'YOUR_YOUTUBE_API_KEY'; // Replace with your API key
const searchBtn = document.getElementById('search-btn');
const searchBar = document.getElementById('search-bar');
const videosContainer = document.getElementById('videos-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const durationFilter = document.getElementById('duration-filter');

let nextPageToken = '';
let searchQuery = '';

searchBtn.addEventListener('click', async function () {
  const query = searchBar.value.trim();
  const duration = durationFilter.value;
  if (query) {
    searchQuery = query;
    nextPageToken = '';
    videosContainer.innerHTML = '<p>Loading...</p>';
    await searchYouTube(query, duration);
  } else {
    alert('Please enter a search query.');
  }
});

searchBar.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchBtn.click();
  }
});

loadMoreBtn.addEventListener('click', async function () {
  if (nextPageToken) {
    await searchYouTube(searchQuery, durationFilter.value, nextPageToken);
  }
});

async function searchYouTube(query, duration = '', pageToken = '') {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${encodeURIComponent(query)}&type=video${duration ? `&videoDuration=${duration}` : ''}&key=${apiKey}${pageToken ? `&pageToken=${pageToken}` : ''}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!pageToken) videosContainer.innerHTML = '';
    displayVideos(data.items);
    nextPageToken = data.nextPageToken || '';
    loadMoreBtn.style.display = nextPageToken ? 'block' : 'none';
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    alert('Something went wrong.');
  }
}

function displayVideos(videos) {
  videos.forEach(video => {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const description = video.snippet.description;
    const thumbnail = video.snippet.thumbnails.high.url;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const card = document.createElement('div');
    card.classList.add('video-card');

    card.innerHTML = `
      <img src="${thumbnail}" alt="${title}" />
      <div class="video-info">
        <p class="video-title">${title}</p>
        <p class="video-description">${description}</p>
      </div>
    `;

    card.onclick = () => window.open(videoUrl, '_blank');
    videosContainer.appendChild(card);
  });
}
