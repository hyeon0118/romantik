const closeIcon = document.querySelector(".searchbar svg:nth-of-type(2)");
const input = document.querySelector('input[name="keyword"]');
const before = document.getElementById("before-search");
const after = document.getElementById("after-search");

// function showCloseDiv() {
//     if (input.value !== "") {
//         closeIcon.style.opacity = 1
//     } else {
//         closeIcon.style.opacity = 0;
//     }
// }

function clearInput() {
    input.value = "";
    closeIcon.style.opacity = 0;
    before.style.display = "flex";
    after.style.display = "none"
}


input.addEventListener("input", () => {
    if (input.value) {
        before.style.display = "none";
        after.style.display = "flex"
        history.replaceState(null, null, "/search?keyword=" + input.value);
    } else {
        before.style.display = "flex";
        after.style.display = "none"
        history.replaceState(null, null, "/search");
    }
})

