"use strict";

import {addTransactionDetailsClick} from "./transaction_details.js";
import {Transactions} from "./transactions.js";
import {cookieExists, deleteCookie} from "./cookies.js";

const transactions = new Transactions();
addTransactionDetailsClick(transactions.getTransaction);

if (cookieExists("authToken")) {
    fetch("/api/transactions.php")
        .then((response) => response.json())
        .then((data) => {
            for (const transaction of data.transactions) {
                transactions.addTransaction(transaction);
                const tr = document.createElement("tr");
                tr.setAttribute("key", transaction.transactionID);
                const date = document.createElement("td");
                date.innerHTML = transaction.created;
                const merchant = document.createElement("td");
                merchant.innerHTML = transaction.merchant;
                const amount = document.createElement("td");
                const formattedAmount = (transaction.amount / 100).toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                    },
                );
                amount.innerHTML = formattedAmount + " " + transaction.currency;
                tr.appendChild(date);
                tr.appendChild(merchant);
                tr.appendChild(amount);
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
        document.getElementById("logout").classList.remove("hidden");
    }

    const logoutButton = document.querySelector("#logout-button");
    logoutButton.addEventListener("click", function (event) {
        deleteCookie("authToken");
        loginForm.classList.remove("hidden");
        transactions.setTransactions({});
        document.getElementById("transactionTableBody").innerHTML = "";
        document.querySelectorAll(".loading-ring").forEach((element) => {
            element.classList.remove("hidden");
        });
        document.getElementById("transactions").classList.add("hidden");
        document.getElementById("logout").classList.add("hidden");
    });

    const loginForm = document.querySelector("form.ajax");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const submitButton = loginForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const triggerError = (message) => {
            const text = message || "Something went wrong. Please try again.";
            loginForm.querySelector(
                ".response",
            ).innerHTML = `<p class='error'>${text}</p>`;
            submitButton.disabled = false;
        };

        fetch("/api/login.php", {
            method: "POST",
            body: new FormData(loginForm),
        })
            .then((data) => {
                submitButton.disabled = false;
                if (data.status === 200) {
                    loginForm.classList.add("hidden");
                } else if (data.status === 401) {
                    triggerError(
                        "We couldn't recognize that username and password combination. Please try again.",
                    );
                } else if (data.status === 403) {
                    data.json().then((json) => {
                        if (json.cloudflare_error) {
                            triggerError(
                                "It's not presently possible to access the Expensify API because of a Cloudflare error. Please try again later.",
                            );
                        } else {
                            triggerError();
                        }
                    });
                } else {
                    triggerError();
                }
            })
            .catch(() => triggerError());
    });
});
