cachedIcons = {};

$(() => {
    updateFooterYear();
    createFooterTransition();
    createTechnologyIcons();
    createSocialIcons()
});

function updateFooterYear() {
    $(".footer-year").append(new Date().getFullYear());
}

async function createSocialIcons() {
    let data = await fetchFileAsync("./JonathanPaugh/src/public/data/socials.json");
    socials = JSON.parse(data);

    for (let [file, link] of Object.values(socials)) {
        await createSocialIcon(file, link);
    }
}

async function createSocialIcon(file, link) {
    let data = await fetchFileAsync(`./JonathanPaugh/src/public/svg/socials/${file}`);
    let container = createElement("a");
    container.attr("href", link);
    $(".splash-icons").append(container);
    container.append(data);
}

async function createTechnologyIcons() {
    let data = await fetchFileAsync("./JonathanPaugh/src/public/data/technologies.json");
    technologies = JSON.parse(data);

    for (let [name, file] of Object.entries(technologies)) {
        await createTechnologyIcon(name, file);
    }
}

async function createTechnologyIcon(name, file) {
    let data = await fetchFileAsync(`./JonathanPaugh/src/public/svg/technologies/${file}`);

    let container = createDiv();
    $(".about-technologies-container").append(container);

    let anchor = createElement("a");
    container.append(anchor);
    anchor.append(data);

    let tooltip = createDiv();
    tooltip.addClass("tooltip");
    tooltip.html(name);
    anchor.before(tooltip);

    Popper.createPopper(anchor[0], tooltip[0], {
        placement: "bottom"
    });

    anchor.hover(() => {
        tooltip.addClass("active");
    }, () => {
        tooltip.removeClass("active");
    });
}

function createFooterTransition() {
    fetchFile("./JonathanPaugh/src/public/svg/transition.svg", (data) => {
        $(".transition").append(data);
    });
}
