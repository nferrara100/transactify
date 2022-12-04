"use strict";

function cookieExists(cookieName) {
    // return true if cookie exists, false otherwise
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // if cookie authToken is set to true, then hide the login form
    if (cookieExists("authToken")) {
        document.getElementById("login-form").classList.add("hidden");
    }

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
                form.classList.add("hidden");
            } else {
                form.querySelector(".response").innerHTML =
                    "<p class='error'>Login failed.</p>";
                submitButton.disabled = false;
            }
        };

        request.onerror = function () {
            form.querySelector(".response").innerHTML =
                "<p class='error'>An error ocurred. Please try again.</p>";
            submitButton.disabled = false;
        };
    });
});
