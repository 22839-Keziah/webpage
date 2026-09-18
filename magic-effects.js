/* =========================================================
   MAGIC EFFECTS + CONTINUOUS MUSIC
========================================================= */

const music = document.getElementById("forestMusic");
const musicToggle = document.getElementById("musicToggle");

let musicEnabled = sessionStorage.getItem("musicEnabled") === "true";
let savedTime = sessionStorage.getItem("musicTime");

if (savedTime) {
    music.currentTime = Number(savedTime);
}

function updateMusicButton() {
    if (!musicToggle) return;

    musicToggle.textContent = musicEnabled
        ? "🔊 ปิดเพลง"
        : "🔇 เปิดเพลง";
}

async function startMusic() {
    try {
        await music.play();
        musicEnabled = true;
        sessionStorage.setItem("musicEnabled", "true");
        updateMusicButton();
    } catch (error) {
        musicEnabled = false;
        sessionStorage.setItem("musicEnabled", "false");
        updateMusicButton();
        console.log("เบราว์เซอร์รอให้ผู้ใช้กดปุ่มก่อนเปิดเสียง");
    }
}

function stopMusic() {
    music.pause();
    musicEnabled = false;
    sessionStorage.setItem("musicEnabled", "false");
    updateMusicButton();
}

if (musicToggle) {
    musicToggle.addEventListener("click", () => {
        if (music.paused) {
            startMusic();
        } else {
            stopMusic();
        }
    });
}

if (musicEnabled) {
    startMusic();
}

updateMusicButton();

/* บันทึกตำแหน่งเพลงก่อนเปลี่ยนหน้า */
window.addEventListener("pagehide", () => {
    if (music) {
        sessionStorage.setItem(
            "musicTime",
            String(music.currentTime)
        );
    }
});

/* =========================================================
   Mouse Glow
========================================================= */

const mouseGlow = document.createElement("div");

mouseGlow.style.position = "fixed";
mouseGlow.style.width = "180px";
mouseGlow.style.height = "180px";
mouseGlow.style.borderRadius = "50%";
mouseGlow.style.pointerEvents = "none";
mouseGlow.style.zIndex = "1";
mouseGlow.style.transform = "translate(-50%, -50%)";
mouseGlow.style.background =
    "radial-gradient(circle, rgba(192,132,252,.18), transparent 70%)";
mouseGlow.style.filter = "blur(8px)";

document.body.appendChild(mouseGlow);

document.addEventListener("pointermove", (event) => {
    mouseGlow.style.left = `${event.clientX}px`;
    mouseGlow.style.top = `${event.clientY}px`;
});

/* =========================================================
   Click Sparkle + Ripple
========================================================= */

const sparkleSymbols = [
    "✨",
    "✦",
    "✧",
    "🌟",
    "💜",
    "🧚",
    "🍄"
];

document.addEventListener("click", (event) => {
    const ripple = document.createElement("span");

    ripple.className = "magic-ripple";
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;

    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 900);

    for (let i = 0; i < 7; i++) {
        const sparkle = document.createElement("span");

        sparkle.className = "magic-spark";
        sparkle.textContent =
            sparkleSymbols[
                Math.floor(Math.random() * sparkleSymbols.length)
            ];

        sparkle.style.left = `${event.clientX}px`;
        sparkle.style.top = `${event.clientY}px`;

        sparkle.style.setProperty(
            "--spark-x",
            `${Math.round(Math.random() * 160 - 80)}px`
        );

        sparkle.style.setProperty(
            "--spark-y",
            `${Math.round(Math.random() * 160 - 80)}px`
        );

        sparkle.style.animationDelay = `${i * 40}ms`;

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

/* =========================================================
   3D Card Tilt
========================================================= */

const tiltElements = document.querySelectorAll(
    ".card, .magic-card, .hobby-card, .photo-frame, .profile-card, .info-card"
);

tiltElements.forEach((element) => {
    element.style.transformStyle = "preserve-3d";
    element.style.transition = "transform .2s ease";

    element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 12;
        const rotateX = ((y / rect.height) - 0.5) * -12;

        element.style.transform =
            `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    element.addEventListener("pointerleave", () => {
        element.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
});

/* =========================================================
   Emoji Pop-up ตอน hover
========================================================= */

const interactiveItems = document.querySelectorAll(
    "a, button, .card, .magic-card, .hobby-card"
);

interactiveItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
        if (item.dataset.emojiShown === "true") return;

        item.dataset.emojiShown = "true";

        const emoji = document.createElement("span");

        emoji.textContent = "✨";
        emoji.style.position = "absolute";
        emoji.style.pointerEvents = "none";
        emoji.style.fontSize = "22px";
        emoji.style.zIndex = "20";
        emoji.style.animation = "magicSparkPop .8s ease-out forwards";

        item.style.position = "relative";
        item.appendChild(emoji);

        setTimeout(() => {
            emoji.remove();
            item.dataset.emojiShown = "false";
        }, 800);
    });
});
