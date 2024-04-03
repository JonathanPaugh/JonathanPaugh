jQuery.fn.extend({
    observe: function (onChange) {
        return observe(this, onChange);
    }
});

function observe(element, onChange) {
    onChange(element);
    $(window).on("resize", () => onChange(element));
    const observer = new MutationObserver(() => onChange(element));
    observer.observe(element[0], {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    });
    return element;
}
