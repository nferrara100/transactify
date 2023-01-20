"use strict";

import {clearModal, cookieExists, logoutOnSessionExpiration} from "./util.js";
import {Transactions} from "./Transactions.js";
import {CreateTransaction} from "./views/CreateTransaction.js";
import {ErrorView} from "./views/ErrorView.js";
import {ListTransactions} from "./views/ListTransactions.js";
import {Login} from "./views/Login.js";
import {Logout} from "./views/Logout.js";
import {ViewTransaction} from "./views/ViewTransaction.js";

const transactions = new Transactions();

const navigateTo = (url) => {
    if (url === null) {
        router();
    } else {
        history.pushState(null, null, url);
        router(url);
    }
};

const router = async (url) => {
    let match = null;
    if (url) {
        const routes = [
            {path: "/", view: ListTransactions},
            {path: "/login", view: Login},
            {path: "/create", view: CreateTransaction},
            {path: "/transaction", view: ViewTransaction, data: true},
            {path: "/logout", view: Logout},
        ];
        match = routes.find((route) => {
            if (route?.data) {
                return url.startsWith(route.path);
            } else {
                return route.path === url;
            }
        });
    }

    if (!match || !url) {
        window.ajaxStatus = 404;
    }
    if (window.ajaxStatus >= 400) {
        match = {path: "/error", view: ErrorView};
    }

    clearModal();
    const view = new match.view();
    view.show(navigateTo, transactions);
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[ajax-link]")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute("href"));
        }
    });

    if (!cookieExists("authToken")) {
        navigateTo("/login");
    } else {
        router(location.pathname);
        logoutOnSessionExpiration(() => navigateTo("/logout"));
    }
});
