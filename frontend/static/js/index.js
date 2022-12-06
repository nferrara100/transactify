"use strict";

import {addTransactionDetailsClick} from "./transaction_details.js";

function cookieExists(cookieName) {
    // return true if cookie exists, false otherwise
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

const transactions = {};

function getTransaction(transactionID) {
    return transactions[transactionID];
}
addTransactionDetailsClick(getTransaction);

if (cookieExists("authToken")) {
    fetch("/api/transactions.php")
        .then((response) => response.json())
        .then((data) => {
            for (const transaction of data.transactions) {
                transactions[transaction.transactionID] = transaction;
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
