const closeIcon = document.querySelector("form svg:nth-of-type(2)");
const input = document.querySelector('input[type="text"]');
const before = document.getElementById("before-search");
const after = document.getElementById("after-search");

function showCloseDiv() {
    if (input.value !== "") {
        closeIcon.style.opacity = 1
    } else {
        closeIcon.style.opacity = 0;
    }
}

function clearInput() {
    input.value = "";
    closeIcon.style.opacity = 0;
    before.style.display = "block";
    after.style.display = "none"
}


input.addEventListener("input", () => {
    if (input.value) {
        before.style.display = "none";
        after.style.display = "block"
        history.replaceState(null, null, "/search?keyword=" + input.value);
    } else {
        before.style.display = "block";
        after.style.display = "none"
        history.replaceState(null, null, "/search");
    }
})

// search fetch 

const searchForm = document.querySelector("header form")
const searchSection = document.querySelector("section#search")


searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("worked");

    const searchInput = document.querySelector("header input").value;

    navigateToPage(`/search?keyword=${searchInput}`)
})



// function navigateToPage(url) {
//     fetch(url)
//         .then((response) => response.text())
//         .then((html) => {
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(html, "text/html");
//             const newMainContent = doc.querySelector("main");

//             const currentMain = document.querySelector("main")

//             currentMain.innerHTML = "";

//             currentMain.innerHTML = newMainContent.innerHTML;
//             pageTitle = url.charAt(0);
//             changeNav();
//         })
//         .catch((error) => {
//             console.error(error);
//         });
// }


// function updateContent(main) {
//     const mainContent = document.querySelector("main");
//     mainContent.innerHTML = main;
// }
