const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.querySelector(".palette-container");

generateBtn.addEventListener("click", generatePalette);

paletteContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("copy-btn")) {
        const hexValue = e.target.previousElementSibling.textContent;

        navigator.clipboard
            .writeText(hexValue)
            .then(() => showCopySuccess(e.target));
    }

    if (e.target.classList.contains("color")) {
        const hexValue =
            e.target.nextElementSibling.querySelector(".hex-value").textContent;

        navigator.clipboard
            .writeText(hexValue)
            .then(() =>
                showCopySuccess(
                    e.target.nextElementSibling.querySelector(".copy-btn")
                )
            );
    }
});

function showCopySuccess(element) {
    element.classList.remove("far", "fa-copy");
    element.classList.add("fas", "fa-check");

    element.style.color = "#22c55e";

    setTimeout(() => {
        element.classList.remove("fas", "fa-check");
        element.classList.add("far", "fa-copy");

        element.style.color = "";
    }, 1200);
}

function generatePalette() {
    const colors = [];

    for (let i = 0; i < 5; i++) {
        colors.push(generateRandomColor());
    }

    updatePalette(colors);
}

function generateRandomColor() {
    const letters = "0123456789ABCDEF";

    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function updatePalette(colors) {
    const boxes = document.querySelectorAll(".color-box");

    boxes.forEach((box, index) => {
        const color = colors[index];

        box.querySelector(".color").style.background = color;

        box.querySelector(".hex-value").textContent = color;
    });
}

generatePalette();