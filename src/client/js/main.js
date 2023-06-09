import "../scss/styles.scss"
import "../scss/search.scss"
import "../scss/player.scss"
import "../scss/library.scss"
import "../scss/playlist.scss"
import "../scss/profile.scss"
import { async } from "regenerator-runtime"


const player = document.querySelector(".player");
const random = document.querySelector(".player .random")
const repeat = document.querySelector(".player .repeat")
const next = document.querySelector(".player .next")
const previous = document.querySelector(".player .previous")

const body = document.querySelector("body");
const currentPlaylistDisplay = document.querySelector(".current-playlist");
const playerHeader = document.querySelector(".player-header");
const bottomIcons = document.querySelector(".bottom-icons");
const viewPlaylist = document.querySelectorAll(".view-playlist")
const playlistClose = document.querySelector(".current-playlist .player-header img");
const nowPlaying = document.querySelector(".now-playing")


const progressBar = document.querySelector(".progress-bar")
const passed = progressBar.querySelector(".passed")
const total = progressBar.querySelector(".total")
const bar = progressBar.querySelector(".bar")
let duration = 0;

const playlistWrapper = document.querySelector('.current-playlist-wrapper');
const navAnchor = document.querySelectorAll("nav ul a");
const logoutButton = document.querySelector("button.logout");

const likeButton = document.querySelectorAll(".like")
let liked = false
const mobileLikeButton = document.querySelector(".like-wrap.mobile.open")

const playlistTitleWrapper = document.querySelector(".library-title.add")
const playlistTitle = document.querySelector(".library-title.add span")
const playlistInput = document.querySelector(".library-title.add input")
const createBtn = document.querySelector(".createBtn")

const playlistForm = document.querySelector("#playlistForm")
const searchForm = document.querySelector("#searchForm")

const addToLibraryButton = document.querySelectorAll(".add-to-library");
const viewLibrary = document.querySelector(".view-library")

const editBtn = document.querySelector(".edit-library")
const libraryCovers = document.querySelectorAll("#library .cover-wrapper")
const deleteBtns = document.querySelectorAll(".deleteBtn")
let isEditMode = false;

const playerClose = document.querySelector(".player-header img")

const playButton = document.querySelectorAll(".play")

var tag = document.createElement('script');

let loggedIn = false;


nowPlaying.addEventListener("click", () => {
    if (window.innerWidth < 600) {
        player.classList.add("open");
        mobileLikeButton.classList.remove("hidden")
        body.classList.add("not-overflowY");
        playerHeader.classList.remove("hidden");
        bottomIcons.classList.remove("hidden");
    }
});

function deleteCurrentPlaylist(event) {
    const work = event.target;
    const indexNumber = work.classList[0];
    currentPlaylist.splice(indexNumber, 1)
    updateCurrentPlaylistScreen()
}


viewPlaylist.forEach(btn => {
    btn.addEventListener("click", () => {
        bottomIcons.classList.add('hidden');
        body.classList.toggle("not-overflowY");
        currentPlaylistDisplay.classList.toggle("hidden");
        updateCurrentPlaylistScreen();
    })
})


playlistClose.addEventListener("click", () => {
    body.classList.remove("not-overflowY");
    currentPlaylistDisplay.classList.add("hidden");
    bottomIcons.classList.remove("hidden");
})


playerClose.addEventListener("click", (event) => {
    event.stopPropagation();
    player.classList.remove("open");
    mobileLikeButton.classList.add("hidden")
    body.classList.remove("not-overflowY");
    playerHeader.classList.add("hidden");
    bottomIcons.classList.add("hidden");
    viewLibrary.classList.add("hidden");
    playlistTitle.classList.remove("hidden")
    playlistInput.classList.add("hidden")
    createBtn.classList.add("hidden")
    playlistInput.value = "";
})

window.addEventListener("resize", () => {
    if (window.innerWidth >= 600) {
        if (player.classList.contains("open")) {
            player.classList.remove("open");
            playerHeader.classList.add("hidden");
            bottomIcons.classList.add("hidden");
            mobileLikeButton.classList.add("hidden")
        }
    }
    if (window.innerWidth < 600) {
        const bottomIconsMobile = document.querySelector(".bottom-icons.mobile")
        if (!player.classList.contains("open")) {
            bottomIconsMobile.classList.add("hidden");
        }
        if (!currentPlaylistDisplay.classList.contains("hidden")) {
            currentPlaylistDisplay.classList.add("hidden");
        }
    }

})


window.loginAlert = () => {
    if (!loggedIn) {
        alert("Please sign in")
    }
}



function changeNav() {
    let currentPath = location.pathname;

    navAnchor.forEach(anchor => {
        anchor.classList.remove('active');
    })

    if (currentPath !== "/profile") {
        let menuItem = document.querySelector('[href="' + currentPath + '"]');

        if (currentPath == '/') {
            menuItem = document.querySelector('nav ul a:first-of-type')
        }

        if (menuItem) {
            menuItem.classList.add('active');
        }
    }
}

changeNav()



tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var iframePlayer;

window.onYouTubeIframeAPIReady = () => {
    iframePlayer = new YT.Player('player', {
        height: '0',
        width: '0',
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
            playlist: currentPlaylist.map(item => item.videoId).join(','),
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

const currentTitle = document.querySelector(".player .info .title span")
const currentPerformer = document.querySelector(".player .info .performer span")
const currentComposer = document.querySelector(".player .info .composer span")
const currentCover = document.querySelector(".player .cover-wrapper")

let currentIndex = -1;
let playing = 'none';
let currentVideoId = 'none';

window.updateNowPlaying = () => {
    currentIndex = currentPlaylist.length - 1;
    playPlayer();
    playPause();
}

window.playInPlaylist = (index) => {
    currentIndex = index;
    playPlayer();
}

function playPlayer() {
    playing = currentPlaylist[currentIndex]
    currentVideoId = playing.videoId
    checkLiked();
    iframePlayer.loadVideoById(currentVideoId);
    updateCurrentCover();
    currentCover.style.backgroundImage = `url(${playing.thumbnail})`;
    currentTitle.textContent = playing.title;
    currentPerformer.textContent = playing.performer;
    currentComposer.textContent = playing.composer;
    isPlaying = true;
}

const currentPlaylistList = playlistWrapper.querySelectorAll("div")

currentPlaylistList.forEach(list => {
    list.addEventListener("click", () => {
        const index = list.className
        inPlaylistPlay(index);
    })
})

function inPlaylistPlay(index) {
    currentIndex = index;
    playPlayer()
}


let isPlaying = undefined;

function playPause() {
    if (isPlaying) {
        playButton.forEach(btn => {
            btn.className = "pause"
            btn.src = "/public/icons/pause.svg";
        })
    } else if (!isPlaying) {
        playButton.forEach(btn => {
            btn.className = "play"
            btn.src = "/public/icons/play.svg";
        })
    }
}




function onPlayerReady(event) {
    playButton.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isPlaying !== undefined) {
                iframePlayer.playVideo();
                isPlaying = !isPlaying;
                if (isPlaying) {
                    iframePlayer.playVideo();
                } else {
                    iframePlayer.pauseVideo();
                }
                playPause();
            }
        });
    });
}

let repeatMode = 'none';

repeat.addEventListener("click", () => {
    if (repeatMode === 'none') {
        repeatMode = true;
    } else if (repeatMode === true) {
        repeatMode = 'playlistRepeat';
    } else if (repeatMode === 'playlistRepeat') {
        repeatMode = 'none';
    }

    if (repeatMode === true) {
        repeat.src = "/public/icons/repeat_one.svg";
    } else if (repeatMode === 'playlistRepeat') {
        repeat.src = "/public/icons/repeat_active.svg";
    } else {
        repeat.src = "/public/icons/repeat_inactive.svg";
    }
})

setInterval(progressBarAutomaticUpdate, 1000);


function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && loggedIn !== true) {
        duration = "1:00"
        total.textContent = duration;
        setTimeout(stopVideo, 60000);
    } else if (event.data == YT.PlayerState.PLAYING) {
        duration = iframePlayer.getDuration();
        let minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration - (60 * (Math.floor(duration / 60))))

        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60)
            minutes = minutes - (hours * 60)
            duration = `${hours}:${minutes}:${seconds}`
        } else {
            if (seconds < 10) {
                duration = `${minutes}:0${seconds}`
            } else {
                duration = `${minutes}:${seconds}`
            }
        }


        total.textContent = duration;
    } else {
        if (event.data === YT.PlayerState.ENDED) {
            if (repeatMode === true) {
                iframePlayer.playVideo();
            } else if (repeatMode === 'playlistRepeat') {
                playNextVideo()
            } else if (repeatMode === 'none') {
                if (currentIndex < currentPlaylist.length - 1) {
                    playNextVideo()
                }
            }
        }
        if (event.data === YT.PlayerState.PLAYING) { }
    }
};


let shuffled = false;
random.addEventListener("click", () => {
    if (!shuffled) {
        shuffled = true
        random.src = '/public/icons/random_active.svg';
    } else {
        shuffled = false
        random.src = '/public/icons/random_inactive.svg';
    }
})

let previousIndex = 0;

function playNextVideo() {
    previousIndex = currentIndex;
    if (!shuffled) {
        if (currentIndex == currentPlaylist.length - 1) {
            if (repeatMode === "playlistRepeat") {
                currentIndex = 0;
            } else {
                currentIndex = 0;
            }
        } else {
            currentIndex += 1;
        }
    } else {
        do {
            currentIndex = Math.floor(Math.random() * (currentPlaylist.length - 1))
        } while (currentIndex === previousIndex);
    }
    if (currentPlaylist !== []) {
        playPlayer()
    }
}


function playPreviousVideo() {
    if (!shuffled) {
        if (currentIndex != 0) {
            currentIndex -= 1;
        } else {
        }
    } else {
        currentIndex = previousIndex;
    }
    if (currentPlaylist !== []) {
        playPlayer();
    }
}

function stopVideo() {
    isPlaying = !isPlaying;
    iframePlayer.stopVideo();
    playPause();
};

next.addEventListener("click", playNextVideo)
previous.addEventListener("click", playPreviousVideo)

let currentPlaylist = [];

window.addPlaylist = (videoId, title, performer, composer, thumbnail) => {
    const added = {
        videoId: videoId,
        title: title,
        performer: performer,
        composer: composer,
        thumbnail: thumbnail,
    }

    currentCoverUrl = thumbnail;

    const existingIndex = currentPlaylist.findIndex(item => item.videoId === videoId);

    if (existingIndex !== -1) {
        currentPlaylist.splice(existingIndex, 1);
    }

    currentPlaylist.push(added);

    addSongHistory(videoId);

    createPlaylistElement(title, performer, thumbnail);
}

window.queueAlarm = () => {
    const message = document.querySelector(".added-notification")
    message.classList.remove("hidden");
    setTimeout(function () {
        message.classList.add("hidden")
    }, 2000);
}

function playlistAlarm() {
    const message = document.querySelector(".added-to-playlist-notification")
    message.classList.remove("hidden");
    setTimeout(function () {
        message.classList.add("hidden")
    }, 2000);
}




function createPlaylistElement(addedTitle, addedPerformer, addedCover, i) {
    const newElement = document.createElement('div');
    newElement.classList.add('element');

    const coverWrapper = document.createElement('div');
    coverWrapper.classList.add('cover-wrapper');
    coverWrapper.style.backgroundImage = `url(${addedCover})`
    coverWrapper.setAttribute('onclick', `playInPlaylist(${i})`);

    const info = document.createElement('div');
    info.classList.add('info');

    const title = document.createElement('div');
    title.classList.add('title');
    title.textContent = addedTitle;

    const performer = document.createElement('div');
    performer.classList.add('performer');
    performer.textContent = addedPerformer;

    const drag = document.createElement('div');
    drag.classList.add('drag');

    const deletePlaylistBtn = document.createElement('img');
    deletePlaylistBtn.src = '/public/icons/close.svg';
    deletePlaylistBtn.classList.add("delete-playlist")
    deletePlaylistBtn.onclick = deleteCurrentPlaylist;

    drag.appendChild(deletePlaylistBtn);
    info.appendChild(title);
    info.appendChild(performer);
    newElement.appendChild(coverWrapper);
    newElement.appendChild(info);
    newElement.appendChild(drag);

    newElement.className = i

    playlistWrapper.appendChild(newElement);
}

function updateCurrentPlaylistScreen() {
    playlistWrapper.innerHTML = "";
    let i = 0;
    currentPlaylist.forEach(list => {
        createPlaylistElement(list.title, list.performer, list.thumbnail, i);
        i++
    })
}



let percentage = 0;

function progressBarAutomaticUpdate() {
    if (isPlaying) {
        let minutes = Math.floor(iframePlayer.getCurrentTime() / 60)
        let seconds = Math.trunc(iframePlayer.getCurrentTime() - (minutes * 60))

        if (loggedIn === true) {
            percentage = (Math.floor(iframePlayer.getCurrentTime()) / Math.floor(iframePlayer.getDuration())) * 100;

        } else if (loggedIn === undefined || loggedIn === false) {
            percentage = (Math.floor(iframePlayer.getCurrentTime()) / 60) * 100;
            if (iframePlayer.getCurrentTime() >= 60) {
                stopVideo();
            }
        }
        if (seconds == 0) {
            seconds = '00';
        } else if (seconds < 10) {
            seconds = `0${seconds}`
        }
        passed.textContent = `${minutes}:${seconds}`;

        bar.style.setProperty('--after-width', `${percentage}%`);
    }
}



function updateProgressBar(event) {
    const clickedX = event.clientX - bar.getBoundingClientRect().left;
    const barWidth = bar.clientWidth;
    const progress = (clickedX / barWidth) * 100;
    if (loggedIn === true) {
        iframePlayer.seekTo(iframePlayer.getDuration() * (progress * 0.01));
    } else {
        iframePlayer.seekTo(60 * (progress * 0.01));
    }

    bar.style.setProperty('--after-width', `${progress}%`)

}


bar.addEventListener('click', updateProgressBar);

let currentCoverUrl = "";

function updateCurrentCover() {
    const covers = document.querySelectorAll(".player .cover-wrapper");

    covers.forEach((cover) => {
        cover.style.backgroundImage = `url(${currentCoverUrl})`;
    })
}


// soundbar 

const soundbarContainer = document.querySelector(".soundbar-container");
const soundbarWrapper = document.querySelector('.soundbar-wrapper');
const soundbar = document.querySelector('.soundbar');
const soundHeightVariable = '--sound-height';

let isDragging = false;

soundbarWrapper.addEventListener('mousedown', startDrag);
soundbarWrapper.addEventListener('touchstart', startDrag);
document.addEventListener('mousemove', handleDrag);
document.addEventListener('touchmove', handleDrag);
document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function startDrag(event) {
    isDragging = true;
    event.preventDefault();
    updateSoundHeight(event);
}

function handleDrag(event) {
    if (isDragging) {
        event.preventDefault();
        updateSoundHeight(event);
        showSoundbar()
    }
}

function stopDrag() {
    isDragging = false;
}

const soundIcon = document.querySelector('.sound')
let newSoundHeight = 0;

function updateSoundHeight(event) {
    const soundbarHeight = soundbarWrapper.offsetHeight;
    const rect = soundbarWrapper.getBoundingClientRect();
    const offsetY = event.clientY;
    let relativeY = rect.bottom - offsetY;
    const clampedRelativeY = Math.max(0, Math.min(relativeY, soundbarHeight));
    let percentage = ((clampedRelativeY / soundbarHeight) * 100);
    newSoundHeight = `${Math.floor(relativeY)}px`;

    if (!isMuted) {
        if (Math.floor(relativeY) > 60) {
            newSoundHeight = '60px';
        }
    }
    soundbar.style.setProperty(soundHeightVariable, newSoundHeight);

    const volume = percentage;
    iframePlayer.setVolume(volume);

}

let isMuted = false
let previousVolume = 0;

soundIcon.addEventListener("click", (event) => {
    let previousHeight = newSoundHeight;
    if (!isMuted) {
        isMuted = true;
        soundIcon.src = "/public/icons/mute.svg";
        previousVolume = iframePlayer.getVolume();
        iframePlayer.setVolume(0);
        soundbar.style.setProperty(soundHeightVariable, 0);
    } else {
        soundIcon.src = "/public/icons/sound.svg";
        iframePlayer.setVolume(previousVolume);
        soundbar.style.setProperty(soundHeightVariable, previousHeight);
    }
})

function showSoundbar() {
    soundbarContainer.style.height = '100px';
    soundbarContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
    soundbarContainer.style.marginBottom = '73px';
    soundbarWrapper.style.display = "flex";
}

function hideSoundbar() {
    soundbarContainer.style.height = '27px'
    soundbarContainer.style.backgroundColor = 'transparent'
    soundbarContainer.style.marginBottom = '0';
    soundbarWrapper.style.display = "none"
}

soundbarContainer.addEventListener("mouseover", showSoundbar)
soundbarContainer.addEventListener("mouseleave", hideSoundbar)


// main tag update 

window.navigateToPage = (url) => {
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newMainContent = doc.querySelector("main");
            const newHeaderContent = doc.querySelector("header");

            const currentMain = document.querySelector("main")
            const currentHeader = document.querySelector("header")

            currentMain.innerHTML = "";
            currentHeader.innerHTML = "";

            currentMain.innerHTML = newMainContent.innerHTML;
            currentHeader.innerHTML = newHeaderContent.innerHTML;
            changeNav();
        })
        .catch((error) => {
            console.error(error);
        });
}

window.enterLibrary = (event, url) => {
    const mainContent = document.querySelector("main");
    event.preventDefault();
    navigateToPage(url);
    window.history.pushState({}, "", url);
}

navAnchor.forEach((anchor) => {
    currentPlaylistDisplay.classList.add("hidden");
    anchor.addEventListener("click", (event) => {
        const mainContent = document.querySelector("main");
        event.preventDefault();
        const url = anchor.getAttribute("href");
        navigateToPage(url);
        window.history.pushState({}, "", url);
    });
});

const logo = document.querySelector(".logo")

logo.addEventListener("click", (event) => {
    const mainContent = document.querySelector("main");
    event.preventDefault();
    const url = "/"
    navigateToPage(url);
    window.history.pushState({}, "", url);
})


window.profileBtn = (event) => {
    event.preventDefault();
    const url = "/profile"
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const mainContent = doc.querySelector("main").innerHTML;
            const headerContent = doc.querySelector("header").innerHTML;
            const docMain = document.querySelector("main");
            const docHeader = document.querySelector("header");
            docHeader.innerHTML = headerContent;
            docMain.innerHTML = mainContent;
            changeNav();
        })
        .catch((error) => {
            console.error(error);
        });
    window.history.pushState({}, "", url);
}

window.addEventListener("popstate", () => {
    const url = window.location.href;
    navigateToPage(url);
});

window.signOut = async () => {
    try {
        await fetch('/logout', {
            method: 'POST',
        });
        addPlaylistHistory();

        location.reload();
    } catch (error) {
        console.error('Failed to logout:', error);
    }
}



function checkLogin() {
    return new Promise((resolve, reject) => {
        fetch('/getLoginStatus')
            .then(response => response.json())
            .then(data => {
                loggedIn = data.loggedIn;
                resolve();
            })
            .catch(error => {
                console.error(error);
                reject(error);
            });
    });
}

window.onload = () => {
    checkLogin().then(() => {
        // console.log(loggedIn);
    });
};

function addSongHistory(videoId) {
    fetch('/addSongToHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
    })
        .then((response) => {
            if (response.ok) {
                // console.log('Song added to history successfully');
            } else {
                console.error('Failed to add song to history');
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

function addPlaylistHistory() {
    const playlist = Object.values(currentPlaylist).map(song => song.videoId);

    fetch('/addPlaylistToHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlist }),
    })
        .then((response) => {
            if (response.ok) {
                // console.log('playlist added to history successfully');
            } else {
                console.error('Failed to add playlist to history');
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

const searchInput = document.querySelector("input[name='keyword']");

window.moveCursorToEnd = (inputElement) => {
    inputElement.focus();
    inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
}

window.searchUpdate = (event) => {
    let keyword = event.target.value;
    let url = `/search?keyword=${encodeURIComponent(keyword)}`

    if (keyword == "") {
        url = "/search"
    }
    fetch(url)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newMainContent = doc.querySelector("main");

            const currentMain = document.querySelector("main")

            currentMain.innerHTML = "";

            currentMain.innerHTML = newMainContent.innerHTML;


            // searchInput.focus();
            // moveCursorToEnd(searchInput);


        })
        .catch((error) => {
            console.error(error);
        });
}

window.searchCategory = (name) => {
    fetch(`/search?keyword=${name}`)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newMainContent = doc.querySelector("main");
            const newHeaderContent = doc.querySelector("header");

            const currentMain = document.querySelector("main")
            const currentHeader = document.querySelector("header")

            currentMain.innerHTML = "";
            currentHeader.innerHTML = "";

            currentMain.innerHTML = newMainContent.innerHTML;
            currentHeader.innerHTML = newHeaderContent.innerHTML;
        })
        .catch((error) => {
            console.error(error);
        });
}

function updateLikedButton(liked) {
    likeButton.forEach(btn => {
        if (liked) {
            btn.src = "/public/icons/heart.svg"
            btn.classList.remove("inactive")
            btn.classList.add("active")
        } else {
            btn.src = "/public/icons/heart_inactive.svg"
            btn.classList.remove("active")
            btn.classList.add("inactive")
        }

        likeButton.forEach((otherBtn) => {
            if (otherBtn !== btn) {
                otherBtn.classList.toggle("inactive", !liked);
                otherBtn.classList.toggle("active", liked);
                otherBtn.src = liked ? "/public/icons/heart.svg" : "/public/icons/heart_inactive.svg";
            }
        })
    })

}

likeButton.forEach(btn => {
    btn.addEventListener("click", () => {
        if (loggedIn && currentVideoId !== "none") {
            liked = !liked;
            updateLiked();
            updateLikedButton(liked);
        }

    })
})

function updateLiked() {
    fetch("/like", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId: currentVideoId }),
    })
        .then((response) => {
        })
        .catch((error) => {
            console.error("The current music like request encountered an error during processing", error);
        });
}

function checkLiked() {
    fetch('/checkLiked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentVideoId }),
    })
        .then(response => response.json())
        .then(data => {
            const { isLiked } = data;
            liked = isLiked;
            updateLikedButton(liked);
        })
        .catch(error => {
            console.error('Error occured: ', error);
        });
}

window.addToLibrary = (playlistId) => {
    if (currentVideoId !== "none") {
        fetch('/addToPlaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlistId, currentVideoId }),
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error occured: ', error);
            });
        viewLibrary.classList.add("hidden")
        playlistAlarm()
    } else {
        alert('Please play a song')
    }
}


window.createPlaylist = (event) => {
    const playlistInput = document.querySelector(".library-title.add input")
    const name = playlistInput.value;
    fetch("/createPlaylist", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, currentVideoId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Playlist created successfully') {
                reloadLibrary()
            } else {
                console.log('Failed to create a playlist');
            }
        })
        .catch(error => {
            console.log('Error:', error);
        });
    playlistInput.value = "";
}

function reloadLibrary() {
    fetch("/library")
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newLibraryContent = doc.querySelector(".view-library");

            const currentLibrary = document.querySelector(".view-library")


            currentLibrary.innerHTML = newLibraryContent.innerHTML;
        })
        .catch((error) => {
            console.error(error);
        });
}


window.playlistInputHandler = () => {
    const playlistTitle = document.querySelector(".library-title.add span")
    const playlistInput = document.querySelector(".library-title.add input")
    const createBtn = document.querySelector(".createBtn")

    playlistTitle.classList.add("hidden")
    playlistInput.classList.remove("hidden")
    createBtn.classList.remove("hidden")
    playlistInput.focus();
}

const likeWraps = document.querySelectorAll(".like-wrap")
const viewWraps = document.querySelectorAll(".view-wrap")


likeWraps.forEach(wrap => {
    const tooltip = wrap.querySelector(".tooltip")

    wrap.addEventListener("click", () => {
        if (!loggedIn) {
            tooltip.textContent = "Please sign in"
            tooltip.classList.add("show");
            setTimeout(function () {
                tooltip.classList.remove("show");
            }, 2000);
        } else if (loggedIn && !currentVideoId) {
            tooltip.textContent = "Please select a song"
            tooltip.classList.add("show");
            setTimeout(function () {
                tooltip.classList.remove("show");
            }, 2000);
        }
    })
})

viewWraps.forEach(wrap => {
    const tooltip = wrap.querySelector(".tooltip")

    wrap.addEventListener("mouseover", () => {
        tooltip.classList.remove("hidden");
    })

    wrap.addEventListener("mouseout", () => {
        tooltip.classList.add("hidden");
    })
})



addToLibraryButton.forEach(btn => {
    btn.addEventListener('click', function () {
        if (loggedIn) {
            viewLibrary.classList.toggle("hidden");
        } else {
            alert("Please sign in")
        }
    });
})


document.addEventListener("click", function (event) {
    if (
        !viewLibrary.contains(event.target) &
        !Array.from(addToLibraryButton).some(function (button) {
            return button.contains(event.target);
        })
    ) {
        viewLibrary.classList.add("hidden");
        playlistTitle.classList.remove("hidden")
        playlistInput.classList.add("hidden")
        createBtn.classList.add("hidden")
        playlistInput.value = "";
    }

    if (!viewLibrary.classList.contains("hidden") &&
        viewLibrary.contains(event.target) &&
        !playlistTitleWrapper.contains(event.target) &&
        !createBtn.contains(event.target)) {
        playlistTitle.classList.remove("hidden")
        playlistInput.classList.add("hidden")
        createBtn.classList.add("hidden")
        playlistInput.value = "";

    }
});

window.deleteFromPlaylist = (playlistId, videoId) => {
    fetch("/deleteFromPlaylist", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId, videoId }),
    })
        .then(response => response.json())
        .catch(error => {
            console.log('Error:', error);
        });
    fetch(`/playlist/${playlistId}`)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const content = doc.querySelector("main");

            const current = document.querySelector("main")


            current.innerHTML = content.innerHTML;
        })
        .catch((error) => {
            console.error(error);
        });
}

window.deletePlaylist = (playlistId) => {
    fetch("/deletePlaylist", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playlistId }),
    })
        .then(response => response.json())
        .catch(error => {
            console.log('Error:', error);
        });
    fetch(`/library`)
        .then((response) => response.text())
        .then((html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const content = doc.querySelector("main");

            const current = document.querySelector("main")


            current.innerHTML = content.innerHTML;
        })
        .catch((error) => {
            console.error(error);
        });
    reloadLibrary();
}


window.shakingCovers = () => {
    const editBtn = document.querySelector(".edit-library")
    const libraryCovers = document.querySelectorAll("#library .cover-wrapper")
    const deleteBtns = document.querySelectorAll(".deleteBtn")

    isEditMode = !isEditMode;

    if (isEditMode) {
        editBtn.textContent = "Done";

        deleteBtns.forEach(btn => {
            btn.classList.remove("hidden");
        });

        libraryCovers.forEach(cover => {
            cover.classList.add("shake-animation");
        });
    } else {
        editBtn.textContent = "Edit";

        deleteBtns.forEach(btn => {
            btn.classList.add("hidden");
        });

        libraryCovers.forEach(cover => {
            cover.classList.remove("shake-animation");
        });
    }
}


window.showDeleteAccount = () => {
    const profile = document.querySelector("#profile")
    const account = document.querySelector("#deleteAccount")

    profile.classList.add("hidden")
    account.classList.remove("hidden")
}


window.noButton = () => {
    const profile = document.querySelector("#profile")
    const account = document.querySelector("#deleteAccount")

    profile.classList.remove("hidden")
    account.classList.add("hidden")
}

window.deleteAccount = () => {
    fetch("/deleteAccount", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = "/"
        })
        .catch(error => {
            console.log('Error:', error);
        });


}


window.registerHandler = (event) => {
    event.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const verification = document.querySelector('input[name="verification"]').value;
    const username = document.querySelector('input[name="username"]').value;

    let errorMessage = '';

    if (password.length < 6) {
        errorMessage = `Password must be at least 6 characters long.`;
    } else if (password !== verification) {
        errorMessage = 'Password and verification password do not match.';
    }

    const errorElement = document.querySelector('.error');
    errorElement.textContent = errorMessage;

    if (errorMessage) {
        return;
    }

    fetch("/signup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username })
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/profile";
                return response.json();
            } else if (response.status === 409) {
                errorMessage = 'Email already exitsts'
                errorElement = document.querySelector('.error');
                errorElement.textContent = error.message;
            } else {
                throw new Error('Failed to sign up');
            }
        })
        .catch(error => {

        });
}

