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
    before.classList.remove('hidden');
    after.classList.add('hidden');
}


input.addEventListener("input", () => {
    if (input.value) {
        before.classList.add('hidden');
        after.classList.remove('hidden');
    } else {
        before.classList.remove('hidden');
        after.classList.add('hidden');
    }
})