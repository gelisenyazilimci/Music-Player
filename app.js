const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const audio = document.querySelector("audio");
const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
});

function displayMusic(music) {
    title.innerText = music.getName();
    singer.innerText = music.singer;
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => {
    prevMusic();
});

next.addEventListener("click", () => {
    nextMusic();
});

function prevMusic() {
    player.prev();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
}

function nextMusic() {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
}

function pauseMusic() {
    container.classList.remove("playing");
    play.classList = "fa-solid fa-play";
    audio.pause();
}

function playMusic() {
    container.classList.add("playing");
    play.classList = "fa-solid fa-pause";
    audio.play();
}

const calculateTime = (toplamSaniye) => {
    const dakika = Math.floor(toplamSaniye / 60);
    const saniye = Math.floor(toplamSaniye % 60);
    const guncellenenSaniye = saniye < 10 ? `0${saniye}`: `${saniye}`;
    const sonuc = `${dakika}:${guncellenenSaniye}`;
    return sonuc;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

// Ses kontrolü için event listener
volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100; // 0.0 - 1.0 arasında bir değer
    if (value === 0) {
        audio.muted = true;
        isMuted = true;
        volume.classList = "fa-solid fa-volume-xmark"; // İkonu değiştir
    } else {
        audio.muted = false;
        isMuted = false;
        volume.classList = "fa-solid fa-volume-high"; // İkonu geri değiştir
    }
});

// Sessiz durumu kontrolü
let isMuted = false;

volume.addEventListener("click", () => {
    if (!isMuted) {
        audio.muted = true;
        isMuted = true;
        volume.classList = "fa-solid fa-volume-xmark"; // İkonu değiştir
    } else {
        audio.muted = false;
        isMuted = false;
        volume.classList = "fa-solid fa-volume-high"; // İkonu geri değiştir
    }
});

progressBar.addEventListener("input", () => {
   currentTime.textContent = calculateTime(progressBar.value);
   audio.currentTime = progressBar.value;
});