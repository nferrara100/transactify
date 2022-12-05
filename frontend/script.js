"use strict";

function cookieExists(cookieName) {
    // return true if cookie exists, false otherwise
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // if cookie authToken exists, then hide the login form
    if (cookieExists("authToken")) {
        document.getElementById("login-form").classList.add("hidden");
    }

    const loginForm = document.querySelector("form.ajax");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const triggerError = () => {
            loginForm.querySelector(".response").innerHTML =
                "<p class='error'>Something went wrong. Please try again.</p>";
            submitButton.disabled = false;
        };

        fetch("/api/login.php", {
            method: "POST",
            body: new FormData(loginForm),
        })
            .then((data) => {
                if (data.status === 200) {
                    loginForm.classList.add("hidden");
                } else if (data.status === 401) {
                    loginForm.querySelector(".response").innerHTML =
                        "<p class='error'>Login failed.</p>";
                    submitButton.disabled = false;
                } else {
                    triggerError();
                }
            })
            .catch(triggerError);
    });
});
