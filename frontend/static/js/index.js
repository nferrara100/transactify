"use strict";

import {Transactions} from "./transactions.js";
import {cookieExists} from "./cookies.js";
import {CreateTransaction} from "./views/CreateTransaction.js";
import {ListTransactions} from "./views/ListTransactions.js";
import {Login} from "./views/Login.js";
import {Logout} from "./views/Logout.js";
import {NotFoundView} from "./views/NotFoundView.js";

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
        // {path: "/transaction/:id", view: ViewTransaction},
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
        match = {
            route: {path: "/404", view: NotFoundView},
            result: [location.pathname],
        };
    }

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
    }
});
