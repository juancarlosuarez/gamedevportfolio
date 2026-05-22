// =========================================
// DOM HELPERS
// =========================================

const $id = id =>
    document.getElementById(id);

// =========================================
// SHARED COMPONENT LOADER
// =========================================

async function loadComponent(id, path){

    const element =
        $id(id);

    if(!element){
        return;
    }

    try{

        const response =
            await fetch(path, {
                cache:"no-cache"
            });

        if(!response.ok){

            throw new Error(
                `Could not load component: ${path}`
            );

        }

        element.innerHTML =
            await response.text();

    }catch(error){

        console.error(
            "Component loader error:",
            error
        );

        element.innerHTML = `
            <div class="container py-3 text-center text-warning">
                Component could not be loaded.
            </div>
        `;

    }

}

// =========================================
// ASSET PATH HELPER
// =========================================

function getAssetPath(relativePath){

    const currentScript =
        document.currentScript ||
        document.querySelector('script[src$="main.js"]');

    if(!currentScript){
        return relativePath;
    }

    return new URL(
        relativePath,
        currentScript.src
    ).href;

}

// =========================================
// ACTIVE NAVIGATION LINK
// =========================================

function setActiveLink(){

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "") || "index";

    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.remove("active");

            if(link.dataset.page === currentPage){

                link.classList.add("active");

            }

        });

}

// =========================================
// DYNAMIC COPYRIGHT YEAR
// =========================================

function setCopyrightYear(){

    const yearElement =
        $id("copyright-year") ||
        $id("copyrightYear");

    if(!yearElement){
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}

// =========================================
// AOS ANIMATIONS
// =========================================

function initAOS(){

    if(typeof AOS === "undefined"){
        return;
    }

    AOS.init({
        duration:1000,
        once:true
    });

}

// =========================================
// GIF SWIPER
// =========================================

function initGifSwiper(){

    if(typeof Swiper === "undefined"){
        return;
    }

    const swiperContainer =
        document.querySelector(".gameGifSwiper");

    if(!swiperContainer){
        return;
    }

    new Swiper(".gameGifSwiper", {

        loop:true,

        effect:"fade",

        speed:1000,

        autoplay:{
            delay:3500,
            disableOnInteraction:false
        }

    });

}

// =========================================
// PROJECT MODAL STATE
// =========================================

let currentProjectIndex = 0;

let projectSwiper = null;

// =========================================
// PROJECT MODAL INITIALIZATION
// =========================================

function initProjectModal(){

    const modal =
        $id("projectModal");

    if(!modal){
        return;
    }

    document
        .querySelectorAll(".open-project-modal")
        .forEach(button => {

            button.addEventListener("click", event => {

                event.preventDefault();

                const projectIndex =
                    parseInt(
                        button.dataset.project,
                        10
                    );

                openProjectModal(projectIndex);

            });

        });

    $id("closeProjectModal")
        ?.addEventListener(
            "click",
            closeProjectModal
        );

    document
        .querySelector(".project-modal-overlay")
        ?.addEventListener(
            "click",
            closeProjectModal
        );

    $id("nextProjectButton")
        ?.addEventListener("click", () => {

            openProjectModal(
                (currentProjectIndex + 1) %
                projects.length
            );

        });

    $id("previousProjectButton")
        ?.addEventListener("click", () => {

            openProjectModal(
                (
                    currentProjectIndex - 1 +
                    projects.length
                ) % projects.length
            );

        });

    document.addEventListener("keydown", event => {

        if(
            event.key === "Escape" &&
            modal.classList.contains("active")
        ){

            closeProjectModal();

        }

    });

}

// =========================================
// OPEN PROJECT MODAL
// =========================================

function openProjectModal(index){

    currentProjectIndex =
        index;

    const project =
        projects[index];

    if(!project){
        return;
    }

    const title =
        $id("modalProjectTitle");

    const tags =
        $id("modalProjectTags");

    const wrapper =
        $id("modalSwiperWrapper");

    const externalLinkButton =
        $id("projectExternalLink");

    const modal =
        $id("projectModal");

    if(
        !title ||
        !tags ||
        !wrapper ||
        !modal
    ){
        return;
    }

    title.textContent =
        project.title;

    if(externalLinkButton){

        if(project.link){

            externalLinkButton.href =
                project.link;

            externalLinkButton.style.display =
                "flex";

        }else{

            externalLinkButton.style.display =
                "none";

        }

    }

    tags.innerHTML =
        "";

    project.tags.forEach(tag => {

        const span =
            document.createElement("span");

        span.textContent =
            tag;

        tags.appendChild(span);

    });

    wrapper.innerHTML =
        "";

    project.slides.forEach(slide => {

        const div =
            document.createElement("div");

        div.className =
            "swiper-slide";

        div.innerHTML = `
            <img
                src="${slide}"
                class="project-slide-image"
                alt="Project Slide"
            >
        `;

        wrapper.appendChild(div);

    });

    if(projectSwiper){

        projectSwiper.destroy(
            true,
            true
        );

    }

    if(typeof Swiper !== "undefined"){

        projectSwiper =
            new Swiper(".modalProjectSwiper", {

                loop:true,

                speed:900,

                autoplay:{
                    delay:3500,
                    disableOnInteraction:false
                },

                navigation:{
                    nextEl:".swiper-button-next",
                    prevEl:".swiper-button-prev"
                }

            });

    }

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}

// =========================================
// CLOSE PROJECT MODAL
// =========================================

function closeProjectModal(){

    const modal =
        $id("projectModal");

    if(!modal){
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "modal-open"
    );

}

// =========================================
// LEGACY VIDEO PREVIEW
// =========================================

function initLegacyVideoPreview(
    playButtonId,
    videoId,
    thumbnailId
){

    const playButton =
        $id(playButtonId);

    const video =
        $id(videoId);

    const thumbnail =
        $id(thumbnailId);

    if(
        !playButton ||
        !video ||
        !thumbnail
    ){
        return;
    }

    playButton.addEventListener("click", async () => {

        thumbnail.style.display =
            "none";

        video.style.display =
            "block";

        video.controls =
            true;

        try{

            await video.play();

        }catch(error){

            console.error(
                "Video playback failed:",
                error
            );

        }

    });

    video.addEventListener("ended", async () => {

        try{

            if(document.fullscreenElement){

                await document.exitFullscreen();

            }

            if(video.webkitDisplayingFullscreen){

                video.webkitExitFullscreen();

            }

        }catch(error){

            console.error(
                "Fullscreen exit failed:",
                error
            );

        }

        video.pause();

        video.currentTime =
            0;

        video.style.display =
            "none";

        video.controls =
            false;

        thumbnail.style.display =
            "block";

    });

}

// =========================================
// GAME VIDEO INITIALIZATION
// =========================================

function initGameVideoPreviews(){

    initLegacyVideoPreview(
        "playVideoButton",
        "gameVideo",
        "videoThumbnail"
    );

    initLegacyVideoPreview(
        "playVideoButton1",
        "gameVideo1",
        "videoThumbnail1"
    );

}

// =========================================
// CONTACT FORM SUBMIT
// =========================================

function initContactForm(){

    const contactForm =
        $id("contactForm");

    if(!contactForm){
        return;
    }

    if(typeof emailjs === "undefined"){

        console.warn(
            "EmailJS is not available."
        );

        return;

    }

    emailjs.init(
        "DU196t1EmwXbjv4oF"
    );

    const contactName =
        $id("contactName");

    const contactEmail =
        $id("contactEmail");

    const contactMessage =
        $id("contactMessage");

    const contactModal =
        $id("contactModal");

    const contactModalMessage =
        $id("contactModalMessage");

    const closeContactModal =
        $id("closeContactModal");

    const contactModalCloseButton =
        $id("contactModalCloseButton");

    // =========================================
    // CONTACT STATUS MODAL
    // =========================================

    function openContactModal(message){

        contactModalMessage.textContent =
            message;

        contactModal.classList.add("active");

        contactModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );

    }

    function closeContactStatusModal(){

        contactModal.classList.remove("active");

        contactModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "modal-open"
        );

    }

    closeContactModal?.addEventListener(
        "click",
        closeContactStatusModal
    );

    contactModalCloseButton?.addEventListener(
        "click",
        closeContactStatusModal
    );

    // =========================================
    // CONTACT FORM SUBMIT
    // =========================================

    contactForm.addEventListener("submit", async event => {

        event.preventDefault();

        // Native HTML5 validation

        if(!contactForm.checkValidity()){

            contactForm.reportValidity();

            return;

        }

        const name =
            contactName.value.trim();

        const email =
            contactEmail.value.trim();

        const message =
            contactMessage.value.trim();

        try{

            await emailjs.send(
                "service_n7flo7d",
                "template_l9yi7dp",
                {
                    from_name:name,
                    from_email:email,
                    reply_to:email,
                    message:message
                }
            );

            openContactModal(
                "Message sent successfully."
            );

            contactForm.reset();

        }catch(error){

            console.error(
                "EmailJS error:",
                error
            );

            openContactModal(
                "An error occurred while sending the message."
            );

        }

    });

}

// =========================================
// APPLICATION BOOTSTRAP
// =========================================

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "navbar",
        getAssetPath("../components/navbar.html")
    );

    await loadComponent(
        "footer",
        getAssetPath("../components/footer.html")
    );

    setActiveLink();

    setCopyrightYear();

    initAOS();

    initGifSwiper();

    initProjectModal();

    initGameVideoPreviews();

    initContactForm();

});