// const apiKey = process.env.API_KEY;


const player = document.querySelector(".player");
const body = document.querySelector("body");
const currentPlaylist = document.querySelector(".current-playlist");
const playerHeader = document.querySelector(".player-header");
const bottomIcons = document.querySelector(".bottom-icons");
const viewPlaylist = document.querySelector(".controller-right-wrapper.desktop img:nth-of-type(3)")
const playlistClose = document.querySelector(".current-playlist .player-header img");

player.addEventListener("click", () => {
    if (window.innerWidth >= 600) {
        body.classList.toggle("not-overflowY");
        currentPlaylist.classList.toggle("hidden");
    } else if (window.innerWidth < 600) {
        player.classList.add("open");
        body.classList.add("not-overflowY");
        playerHeader.classList.remove("hidden");
        bottomIcons.classList.remove("hidden");
    }
});

playlistClose.addEventListener("click", () => {
    body.classList.remove("not-overflowY");
    currentPlaylist.classList.add("hidden");
})

const playerClose = document.querySelector(".player-header img")

playerClose.addEventListener("click", (event) => {
    event.stopPropagation(); // 이벤트 전파 막기
    player.classList.remove("open");
    body.classList.remove("not-overflowY");
    playerHeader.classList.add("hidden");
    bottomIcons.classList.add("hidden");
})

window.addEventListener("resize", () => {
    if (window.innerWidth >= 600 && player.classList.contains("open")) {
        player.classList.remove("open");
        playerHeader.classList.add("hidden");
        bottomIcons.classList.add("hidden");
    }
})



let currentPath = location.pathname;
if (currentPath !== "/profile") {
    let menuItem = document.querySelector('[href="' + currentPath + '"]').parentNode;
    menuItem.classList.add('active');
}
