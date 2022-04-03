function createElement(element) {
    return $(`<${element}/>`);
}

function createDiv() {
    return createElement("div");
}

function redirect(path) {
    window.location.assign(`${path}${window.location.search}`);
}

function fetchFile(path, callback) {
    fetch(`${window.location.origin}/${path}`)
        .then(response => response.text())
        .then(callback);
}

async function fetchFileAsync(path) {
    let response = await fetch(`${window.location.origin}/${path}`)
    return response.text()
}
