import navigate from './navigate';

window.addEventListener("load", function () {

    console.log("Hello World");

    window.addEventListener("hashchange", function () {
        navigate(window.location.hash);
    })
});