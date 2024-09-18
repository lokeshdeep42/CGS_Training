const client_id = 'aa72f29201044716a8e07b3d1cf905ba';
const client_secret = '43b4e2590c8d40109891faa7b190d793';
let token = '';
let currentAudio = null;

async function fetchToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    token = data.access_token;
}

async function searchTracks(query) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await result.json();
    
    const introText = document.getElementById('intro-text');
    if (introText) {
        introText.style.display = 'none';
    }

    displayTracks(data.tracks.items);
}

function displayTracks(tracks) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    tracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('col-md-3', 'p-2');
        trackElement.innerHTML = `
                    <div class="card h-100">
                        <img src="${track.album.images[0].url}" class="card-img-top" alt="${track.name}">
                        <div class="card-body">
                            <h5 class="card-title">${track.name}</h5>
                            <p class="card-text">${track.artists[0].name}</p>
                            <div class="audio-player">
                                <button class="play-pause-btn" id="playPause-${track.id}">
                                    <i class="fa fa-play"></i>
                                </button>
                                <div class="progress-container">
                                    <div class="progress-bar" id="progressBar-${track.id}"></div>
                                </div>
                                <span class="current-time" id="currentTime-${track.id}">00:00</span>
                                <span class="total-time" id="totalTime-${track.id}">00:30</span>
                            </div>
                            <audio id="audio-${track.id}">
                                <source src="${track.preview_url}" type="audio/mpeg">
                            </audio>
                        </div>
                    </div>
                `;
        resultsContainer.appendChild(trackElement);
        setupAudioPlayer(track.id);
    });
}

function setupAudioPlayer(trackId) {
    const playPauseBtn = document.getElementById(`playPause-${trackId}`);
    const progressBar = document.getElementById(`progressBar-${trackId}`);
    const audio = document.getElementById(`audio-${trackId}`);
    const currentTimeElem = document.getElementById(`currentTime-${trackId}`);
    const totalTimeElem = document.getElementById(`totalTime-${trackId}`);
    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
            isPlaying = false;
        } else {
            if (currentAudio && currentAudio !== audio) {
                currentAudio.pause();
                const currentAudioBtn = document.querySelector('.play-pause-btn .fa-pause');
                if (currentAudioBtn) currentAudioBtn.classList.replace('fa-pause', 'fa-play');
            }
            audio.play();
            playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
            isPlaying = true;
            currentAudio = audio;
        }
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeElem.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
        isPlaying = false;
        currentAudio = null;
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchSong').value;
    if (query) {
        searchTracks(query);
    }
});

fetchToken();
