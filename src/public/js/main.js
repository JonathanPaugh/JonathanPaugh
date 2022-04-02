$(() => {
    fetchFile("./JonathanPaugh/src/public/svg/transition.svg", (data) => {
        $(".transition-container").append(data);
    });
});

function fetchFile(path, callback) {
    fetch(`${window.location.origin}/${path}`)
        .then(response => response.text())
        .then(callback);
}
