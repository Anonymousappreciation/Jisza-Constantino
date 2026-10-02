"use strict";


/* ==========================================
   PASSWORD SETTINGS
========================================== */

const SECRET_PASSWORD = "019";


/* ==========================================
   GET HTML ELEMENTS
========================================== */

const lockScreen =
    document.getElementById("lockScreen");

const mainContent =
    document.getElementById("mainContent");

const passwordInput =
    document.getElementById("password");

const unlockForm =
    document.getElementById("unlockForm");

const errorMessage =
    document.getElementById("errorMessage");

const music =
    document.getElementById("backgroundMusic");

const musicButton =
    document.getElementById("musicButton");


/* ==========================================
   UNLOCK THE PAGE
========================================== */

if (unlockForm) {

    unlockForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const enteredPassword =
                passwordInput.value.trim();


            if (
                enteredPassword ===
                SECRET_PASSWORD
            ) {

                lockScreen.classList.add(
                    "hidden"
                );

                mainContent.classList.remove(
                    "hidden"
                );

                errorMessage.textContent = "";

                passwordInput.value = "";


                /*
                 * Try to start music after
                 * the user has interacted with
                 * the page.
                 */

                startMusic();

            } else {

                errorMessage.textContent =
                    "❌ Incorrect password. Please try again.";

                passwordInput.value = "";

                passwordInput.focus();

            }

        }
    );

}


/* ==========================================
   START MUSIC
========================================== */

async function startMusic() {

    if (!music) {
        return;
    }

    try {

        await music.play();

        if (musicButton) {
            musicButton.textContent =
                "⏸️ Pause Music";
        }

    } catch (error) {

        console.log(
            "Music could not start automatically.",
            error
        );

        if (musicButton) {
            musicButton.textContent =
                "🎵 Play Music";
        }

    }

}


/* ==========================================
   PLAY / PAUSE MUSIC BUTTON
========================================== */

if (musicButton) {

    musicButton.addEventListener(
        "click",
        async function () {

            if (!music) {
                return;
            }


            if (music.paused) {

                await startMusic();

            } else {

                music.pause();

                musicButton.textContent =
                    "🎵 Play Music";

            }

        }
    );

}


/* ==========================================
   MUSIC STATUS
========================================== */

if (music) {

    music.addEventListener(
        "play",
        function () {

            if (musicButton) {

                musicButton.textContent =
                    "⏸️ Pause Music";

            }

        }
    );


    music.addEventListener(
        "pause",
        function () {

            if (musicButton) {

                musicButton.textContent =
                    "🎵 Play Music";

            }

        }
    );


    music.addEventListener(
        "error",
        function () {

            if (musicButton) {

                musicButton.textContent =
                    "🎵 Music Unavailable";

            }

        }
    );

}


/* ==========================================
   CREATE PHOTO PLACEHOLDER
========================================== */

function createPlaceholder(label) {

    const safeLabel =
        String(label || "Photo")
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );


    const svg = `

        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="600"
            height="600"
            viewBox="0 0 600 600"
        >

            <defs>

                <linearGradient
                    id="background"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >

                    <stop
                        offset="0%"
                        stop-color="#e9c9df"
                    />

                    <stop
                        offset="100%"
                        stop-color="#b5e3e8"
                    />

                </linearGradient>

            </defs>


            <rect
                width="600"
                height="600"
                rx="35"
                fill="url(#background)"
            />


            <text
                x="300"
                y="265"
                font-size="90"
                text-anchor="middle"
            >
                📸
            </text>


            <text
                x="300"
                y="340"
                font-family="Arial, sans-serif"
                font-size="30"
                font-weight="bold"
                text-anchor="middle"
                fill="#76588e"
            >
                ${safeLabel}
            </text>


            <text
                x="300"
                y="385"
                font-family="Arial, sans-serif"
                font-size="20"
                text-anchor="middle"
                fill="#666666"
            >
                Add your photo here
            </text>

        </svg>
    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );

}


/* ==========================================
   HANDLE MISSING PHOTOS
========================================== */

const photos =
    document.querySelectorAll(
        "img[data-placeholder]"
    );


photos.forEach(
    function (img) {

        img.addEventListener(
            "error",
            function () {

                /*
                 * Prevent infinite error loops.
                 */

                if (
                    img.dataset
                        .fallbackApplied ===
                    "true"
                ) {
                    return;
                }


                img.dataset.fallbackApplied =
                    "true";


                img.src =
                    createPlaceholder(
                        img.dataset.placeholder
                    );

            }
        );


        /*
         * Check whether the image has
         * already failed to load.
         */

        if (
            img.complete &&
            img.naturalWidth === 0
        ) {

            img.dispatchEvent(
                new Event("error")
            );

        }

    }
);


/* ==========================================
   INITIAL PAGE CHECK
========================================== */

if (
    lockScreen &&
    mainContent &&
    passwordInput
) {

    /*
     * Automatically place the cursor
     * in the password box.
     */

    passwordInput.focus();

}