cachedIcons = {};

$(setupPage);

function onBuilt() {
    injectScrollPosition();
}

function setupPage() {
    setupHeaderScroll();
    setupFooterYear();
    buildPage();
}

async function buildPage() {
    let setup = [
        createSplash(),
        createSocialIcons(),
        createTechnologyIcons(),
        createProjectItems(),
        createFooterTransition()
    ];

    await Promise.all(setup);

    onBuilt();
}

function injectScrollPosition() {
    if (DEBUG !== true) { return; }
    $(window).on( "unload", () => {
        let scrollPosition = $(window).scrollTop();
        localStorage.setItem("scrollPosition", scrollPosition);
    });
    if (localStorage.scrollPosition) {
        $(window).scrollTop(localStorage.getItem("scrollPosition"));
    }
}

function setupHeaderScroll() {
    let anchor_offset = $('a[href="#SECTION_ABOUT"]').offset().top;

    $(window).on("scroll", () => {
        if ($(window).scrollTop() > anchor_offset) {
            $("header").addClass("scrolled");
        }
        else {
            $("header").removeClass("scrolled");
        }
    });
}

function setupFooterYear() {
    $(".footer-year").append(new Date().getFullYear());
}

async function createSplash() {
    let data = await fetchFileAsync("./svg/splash.svg");
    let container = $(".splash-container");
    $(data).prependTo(container).addClass("splash");
    $(".section-splash").observe((element) => {
        container.attr("style", `width: ${element.width()}px; height: ${element.height()}px;`);
    });
}

async function createFooterTransition() {
    let data = await fetchFileAsync("./svg/transition.svg");
    $(".section-transition").append(data);
}

async function createSocialIcons() {
    let data = await fetchFileAsync("./data/socials.json");
    let socials = JSON.parse(data);
    for (const [file, url] of Object.values(socials)) {
        await createSocialIcon(file, url);
    }
}

async function createSocialIcon(file, url) {
    let data = await fetchFileAsync(`./svg/socials/${file}`);
    let link = createElement("a");
    link.attr("href", url);
    $(".landing-socials").append(link);
    link.append(data);
}

async function createTechnologyIcons() {
    let data = await fetchFileAsync("./data/technologies.json");
    let technologies = JSON.parse(data);
    for (const [name, files] of Object.entries(technologies)) {
        if (!files[0]) { return; }
        await createTechnologyIcon(name, files[2]);
    }
}

async function createTechnologyIcon(name, file) {
    let data = await fetchFileAsync(`./svg/technologies/${file}`);

    let container = createDiv();
    $(".about-technologies-container").append(container);

    let link = createElement("a");
    container.append(link);
    link.append(data);

    let tooltip = createDiv();
    tooltip.addClass("tooltip");
    tooltip.html(name);
    link.before(tooltip);

    Popper.createPopper(link[0], tooltip[0], {
        placement: "bottom"
    });

    link.hover(() => {
        tooltip.addClass("active");
    }, () => {
        tooltip.removeClass("active");
    });
}

async function createProjectItems() {
    let data = await fetchFileAsync("./data/projects.json");
    let template = await fetchFileAsync("./template/project-item.xml");
    let technologies = await fetchFileAsync("./data/technologies.json")
    for (const [heading, project] of Object.entries(JSON.parse(data))) {
        if (project.hidden) { continue; }
        await createProjectItem(heading, project, template, JSON.parse(technologies));
    }
}

async function createProjectItem(heading, project, template, technologies) {
    template = $(template).appendTo(".project-container");
    template.find(".project-item-link").attr("href", project.url);

    template.find(".project-item-heading").html(heading);
    template.find(".project-item-title").html(project.title);
    template.find(".project-item-type").html(`${project.type}, `);
    template.find(".project-item-year").html(project.year.replace("-", "\uD83E\uDC62"));

    if (project.badges) {
        for (const badge of project.badges) {
            let data = await fetchFileAsync(`./svg/technologies/${technologies[badge][1]}`);
            let icon = $(data).appendTo(template.find(".project-item-badges"));
            icon.addClass("no-hover");
        }
    }

    let preview = createElement("img");
    preview.attr("src", project.preview);

    template.find(".project-item-preview").append(preview);

    if (project.buttons) {
        for (const [text, url] of project.buttons) {
            let link = createElement("a");
            link.attr("href", url);
            template.find(".project-item-footer").append(link);
            element = createElement("button")
            element.html(text);
            link.append(element);
        }
    }
}
