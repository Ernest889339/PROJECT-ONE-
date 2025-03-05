document.addEventListener('DOMContentLoaded', function () {
    const audioPlayer = document.querySelector('.audio-player');
    const audio = audioPlayer.querySelector('audio');
    const playPauseBtn = audioPlayer.querySelector('.playPauseBtn');
    const prevBtn = audioPlayer.querySelector('.prevBtn');
    const nextBtn = audioPlayer.querySelector('.nextBtn');
    const playlistBtn = audioPlayer.querySelector('.playlistBtn');
    const progressBar = audioPlayer.querySelector('.progressBar');
    const currentTimeDisplay = audioPlayer.querySelector('.currentTime');
    const durationDisplay = audioPlayer.querySelector('.duration');
    const volumeControl = audioPlayer.querySelector('.volumeControl');
    const playlist = audioPlayer.querySelector('.playlist');
    const playlistTracks = audioPlayer.querySelector('.playlist-tracks');

    const playlistArray = JSON.parse(audioPlayer.getAttribute('data-playlist'));
    let currentTrackIndex = 0;

    function loadTrack(index) {
        audio.src = playlistArray[index];
        audio.play();
        playPauseBtn.textContent = '⏸ Pause';
        updatePlaylistUI();
    }

    function updatePlaylistUI() {
        playlistTracks.innerHTML = '';
        playlistArray.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `Track ${index + 1}`;
            if (index === currentTrackIndex) {
                li.style.fontWeight = 'bold';
            }
            li.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
            });
            playlistTracks.appendChild(li);
        });
    }

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '⏸ Pause';
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶ Play';
        }
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlistArray.length) % playlistArray.length;
        loadTrack(currentTrackIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlistArray.length;
        loadTrack(currentTrackIndex);
    });

    playlistBtn.addEventListener('click', () => {
        playlist.style.display = playlist.style.display === 'none' ? 'block' : 'none';
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });

    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value;
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    loadTrack(currentTrackIndex);
});