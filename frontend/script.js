"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form.ajax");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const formData = new FormData(form);
        const request = new XMLHttpRequest();
        request.open("POST", "/api/login.php", true);
        request.send(formData);

        request.onload = function () {
            if (request.status == 200) {
                window.location.href = "/";
            } else {
                form.querySelector(".response").innerHTML =
                    "<p class='error'>Login failed.</p>";
                submitButton.disabled = false;
            }
        };

        request.onerror = function () {
            submitButton.disabled = false;
        };
    });
});
