const clientId = 'aa72f29201044716a8e07b3d1cf905ba';
const clientSecret = '43b4e2590c8d40109891faa7b190d793';
let token = '';
let tracks = [];
let currentTrackIndex = -1;
const botifyDiv = document.querySelector('.sidebar-heading');

botifyDiv.addEventListener('click', () => {
  location.reload();
});
async function getToken() {
    try {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        token = data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
    }
}

async function searchAlbums(query) {
    try {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        displayAlbums(data.albums.items);
    } catch (error) {
        console.error('Error searching albums:', error);
    }
}

function displayAlbums(albums) {
    const albumsDiv = document.getElementById('albums');
    const introText = document.getElementById('intro-text');
    albumsDiv.innerHTML = '';
    albums.forEach(album => {
        const albumDiv = document.createElement('div');
        albumDiv.classList.add('album-card');
        albumDiv.innerHTML = `
            <img src="${album.images[0].url}" alt="${album.name}" class="album-img">
            <div class="album-info">
                <p class="album-name">${album.name}</p>
            </div>
        `;

        albumDiv.addEventListener('click', async function () {
            try {
                tracks = await getTracks(album.id);
                if (tracks.length > 0) {
                    currentTrackIndex = 0;
                    playTrack(tracks[currentTrackIndex].preview_url);
                } else {
                    showToast("No preview available for this album.", 'warning');
                }
            } catch (error) {
                console.error('Error getting tracks:', error);
            }
        });

        albumsDiv.appendChild(albumDiv);
    });
        if (introText) {
        introText.style.display = 'none';
    }
}

async function getTracks(albumId) {
    try {
        const result = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        const data = await result.json();
        return data.items;
    } catch (error) {
        console.error('Error getting tracks:', error);
        return [];
    }
}

function playTrack(trackUrl) {
    const audioPlayer = document.getElementById('audio-player');
    const playIcon = document.getElementById('play-icon');
    
    audioPlayer.src = trackUrl;
    audioPlayer.play().catch(error => {
        console.error('Error playing track:', error);
        showToast("Error playing track. Please try again.", 'danger');
    });
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.classList.add('toast', 'align-items-center', 'text-bg-' + type, 'border-0', 'fade', 'show');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });

    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
}

const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');

playPauseBtn.addEventListener('click', function () {
    if (audioPlayer.paused) {
        audioPlayer.play().catch(error => {
            console.error('Error playing audio:', error);
        });
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        audioPlayer.pause();
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
});

audioPlayer.addEventListener('timeupdate', function () {
    const duration = audioPlayer.duration;
    const currentTime = audioPlayer.currentTime;
    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
    }
});

progressBar.addEventListener('click', function (e) {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
});

document.getElementById('search-btn').addEventListener('click', function () {
    const query = document.getElementById('search').value;
    if (query.length > 0) {
        searchAlbums(query);
    }
});

document.getElementById('prev').addEventListener('click', function () {
    if (tracks.length > 0 && currentTrackIndex > 0) {
        currentTrackIndex--;
        playTrack(tracks[currentTrackIndex].preview_url);
    } else {
        showToast("No previous track available.", 'warning');
    }
});

document.getElementById('next').addEventListener('click', function () {
    if (tracks.length > 0 && currentTrackIndex < tracks.length - 1) {
        currentTrackIndex++;
        playTrack(tracks[currentTrackIndex].preview_url);
    } else {
        showToast("No next track available.", 'warning');
    }
});

getToken();
