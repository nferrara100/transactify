"use strict";

function cookieExists(cookieName) {
    // return true if cookie exists, false otherwise
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

if (cookieExists("authToken")) {
    fetch("/api/transactions.php")
        .then((response) => response.json())
        .then((data) => {
            console.log(data.transactions);
            for (const transaction of data.transactions) {
                const tr = document.createElement("tr");
                const td1 = document.createElement("td");
                td1.innerHTML = transaction.created;
                const td2 = document.createElement("td");
                td2.innerHTML = transaction.merchant;
                const td3 = document.createElement("td");
                td3.innerHTML = transaction.amount;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                document.getElementById("transactionTableBody").appendChild(tr);
            }
            document.querySelectorAll(".loading-ring").forEach((element) => {
                element.classList.add("hidden");
            });
            document.getElementById("transactions").classList.remove("hidden");
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
