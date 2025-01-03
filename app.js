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
const ul = document.querySelector("ul");
const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
    let music = player.getMusic();
    displayMusic(music);
    audio.volume = volumeBar.value / 100;
    displayMusicList(player.musicList);
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
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}

function playMusic() {
    container.classList.add("playing");
    play.querySelector("i").classList  = "fa-solid fa-pause";
    audio.play().catch(() => window.location.reload());
}

const calculateTime = (totalSecond) => {
    const minute = Math.floor(totalSecond / 60);
    const second = Math.floor(totalSecond % 60);
    const updatedSeconds = second < 10 ? `0${second}`: `${second}`;
    return `${minute}:${updatedSeconds}`;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100; // 0.0 - 1.0 arasında bir değer
    if (value === 0) {
        audio.muted = true;
        isMuted = true;
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        audio.muted = false;
        isMuted = false;
        volume.classList = "fa-solid fa-volume-high";
    }
});


let isMuted = false;

volume.addEventListener("click", () => {
    if (!isMuted) {
        audio.muted = true;
        isMuted = true;
        volume.classList = "fa-solid fa-volume-xmark";
    } else {
        audio.muted = false;
        isMuted = false;
        volume.classList = "fa-solid fa-volume-high";
    }
});

progressBar.addEventListener("input", () => {
   currentTime.textContent = calculateTime(progressBar.value);
   audio.currentTime = progressBar.value;
});

const displayMusicList = (list) => {
    for (let i = 0; i < list.length; i++) {
        let liTag =
        `
        <li li-index='${i}' onclick="SelectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${list[i].getName() + " - " + list[i].getSinger()}</span>
                    <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                    <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
        </li>
        `;

        ul.insertAdjacentHTML("beforeend", liTag);

        let liAudioDuration = ul.querySelector(`#music-${i}`);
        let liAudioSpan = ul.querySelector(`.music-${i}`);

        liAudioSpan.addEventListener("loadeddata", () => {
        liAudioDuration.innerText = calculateTime(liAudioSpan.duration);
        });
    }
};

function SelectedMusic (li) {
    const index = li.getAttribute("li-index");
    player.index = index;
    displayMusic(player.getMusic());
    playMusic(index);
    isPlayingNow();
}

const isPlayingNow = () => {
    for(let i of ul.querySelectorAll("li")) {
        if(i.classList.contains("playing")) {
            i.classList.remove("playing");
        }

        if(i.getAttribute("li-index") === player.index) {
            i.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
});