const audio = document.getElementById("musicAudio");
const playBtn = document.getElementById("playPause");
const progress = document.getElementById("progressBar");
const current = document.getElementById("currentTime");
const duration = document.getElementById("durationTime");
const nextBtn = document.getElementById("musicNext");

const musicExtraText = document.getElementById("musicExtraText");
const musicPlayer = document.getElementById("musicPlayer");

let isPlaying = false;

// Initialize audio duration
audio.addEventListener("loadedmetadata", () => {
  progress.max = audio.duration;
  duration.textContent = formatTime(audio.duration);
});

// Play/Pause with fade-in
playBtn.addEventListener("click", () => {
  if (!isPlaying) {
    audio.volume = 0; // start muted for fade-in
    audio.play();
    playBtn.textContent = "⏸";
    musicExtraText.classList.add("show");
    musicPlayer.classList.add("slide-right");

    // Fade-in audio smoothly
    let fadeInInterval = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(audio.volume + 0.05, 1);
      } else {
        clearInterval(fadeInInterval);
      }
    }, 50); // ~1 second fade-in
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
  isPlaying = !isPlaying;
});

// Update progress bar and time
audio.addEventListener("timeupdate", () => {
  progress.value = audio.currentTime;
  current.textContent = formatTime(audio.currentTime);
});

// Seek through progress bar
progress.addEventListener("input", () => {
  audio.currentTime = progress.value;
});

// Next button: fade-out
nextBtn.addEventListener("click", () => {
  if (!audio.paused) {
    let fadeOutInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05; // gradually lower volume
      } else {
        clearInterval(fadeOutInterval);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1; // reset volume
        playBtn.textContent = "▶";
        isPlaying = false;

        // Reset animations
        musicPlayer.classList.remove("slide-right");
        musicExtraText.classList.remove("show");
      }
    }, 50); // ~1 second fade-out
  } else {
    // Already paused, just reset animations
    musicPlayer.classList.remove("slide-right");
    musicExtraText.classList.remove("show");
  }
});

// Helper: format time
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
