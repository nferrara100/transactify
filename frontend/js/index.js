"use strict";

import {Transactions} from "./Transactions.js";
import {cookieExists} from "./util.js";
import {CreateTransaction} from "./views/CreateTransaction.js";
import {ListTransactions} from "./views/ListTransactions.js";
import {Login} from "./views/Login.js";
import {Logout} from "./views/Logout.js";
import {ErrorView} from "./views/ErrorView.js";
import {ViewTransaction} from "./views/ViewTransaction.js";
import {clearModal} from "./util.js";

const transactions = new Transactions();

const pathToRegex = (path) =>
    new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
        (result) => result[1],
    );

    return Object.fromEntries(
        keys.map((key, i) => {
            return [key, values[i]];
        }),
    );
};

const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        {path: "/", view: ListTransactions},
        {path: "/login", view: Login},
        {path: "/create", view: CreateTransaction},
        {path: "/transaction/:key", view: ViewTransaction},
        {path: "/logout", view: Logout},
    ];

    // Test each route for potential match
    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path)),
        };
    });

    let match = potentialMatches.find(
        (potentialMatch) => potentialMatch.result !== null,
    );

    if (!match) {
        window.statusCode = 404;
    }
    if (window.statusCode >= 400) {
        match = {
            route: {path: "/error", view: ErrorView},
            result: [location.pathname],
        };
    }

    clearModal();
    const view = new match.route.view(getParams(match));
    view.show(navigateTo, transactions);
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[ajax-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    if (!cookieExists("authToken")) {
        navigateTo("/login");
    } else {
        router();
        logoutOnSessionExpiration(() => navigateTo("/logout"));
    }
});
