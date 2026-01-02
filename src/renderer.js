const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", async () => {
    const backBtn = document.querySelector(".Back");
    const forwardBtn = document.querySelector(".Forward");
    const stateBtn = document.querySelector(".State");
    const lengthBg = document.querySelector(".LengthBg");
    const lengthBar = document.querySelector(".Length");
    const songTitle = document.querySelector(".SongTitle");
    const songCover = document.querySelector(".SongCover");
    const pauseSVG = document.querySelector(".PauseSVG");
    const volumeBg = document.querySelector(".VolumeBg");
    const volumeBar = document.querySelector(".Volume");

    const audio = new Audio();
    let songs = [];
    let index = 0;
    let isPlaying = false;
    let isDraggingVolume = false;

    (async() => {
        songs = await ipcRenderer.invoke("select-music-folder");
        if (songs.length > 0) LoadSong(0);
    })();

    function LoadSong(i) {
        index = i;
        const song = songs[index];

        audio.src = `file://${encodeURI(song.path.replace(/\\/g, "/"))}`;
        audio.volume = 0.5;
        songTitle.textContent = song.title || "images/cover-default.png";
        songCover.src = song.cover;
        volumeBar.style.width = "50%";

        audio.load();
        audio.play().catch(err => console.error("Play fehlgeschlagen:", err));
        isPlaying = true;
    };

    function Play() {
        audio.play();
        isPlaying = true;
    };

    function Pause() {
        audio.pause();
        isPlaying = false;
    };

    function Next() {
        if (!songs.length) return;
        index = (index + 1) % songs.length;
        pauseSVG.src = "images/Pause.svg";
        LoadSong(index)
    };

    function Prev() {
        if (!songs.length) return;
        index = (index - 1 + songs.length) % songs.length;
        pauseSVG.src = "images/Pause.svg";
        LoadSong(index)
    };

    function SetVolumeFromEvent(e) {
        const rect = volumeBg.getBoundingClientRect();

        let volume = 1 - (e.clientY - rect.top) / rect.height;
        volume = Math.min(Math.max(volume, 0), 1);

        audio.volume = volume;
        volumeBar.style.width = `${volume * 100}%`;
    }

    stateBtn.addEventListener("click", () => {
        if (isPlaying) {
            Pause();
            pauseSVG.src = "images/Start.svg";
        } else {
            Play();
            pauseSVG.src = "images/Pause.svg";
        }
    });

    forwardBtn.addEventListener("click", Next)
    backBtn.addEventListener("click", Prev)

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        lengthBar.style.width = `${percent}%`
    });

    lengthBg.addEventListener("click", (e) => {
        const rect = lengthBg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    audio.addEventListener("ended", Next);

    audio.addEventListener("error", (e) => {
        console.error("Audio-Fehler:", e);
        songTitle.textContent = "Fehler beim Laden des Songs";
        isPlaying = false;
    });

    volumeBg.addEventListener("mousedown", (e) => {
        isDraggingVolume = true;
        SetVolumeFromEvent(e);
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDraggingVolume) return;
        SetVolumeFromEvent(e);
    });

    document.addEventListener("mouseup", (e) => {
        isDraggingVolume = false;
    });
});