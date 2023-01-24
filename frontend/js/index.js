"use strict";

/*
 *  This is the entry point for JavaScript code.
 */

import {clearModal, getCookie, logoutOnSessionExpiration} from "./util.js";
import {CreateTransaction} from "./views/CreateTransaction.js";
import {ErrorView} from "./views/ErrorView.js";
import {Home} from "./views/Home.js";
import {Login} from "./views/Login.js";
import {Logout} from "./views/Logout.js";
import {Transactions} from "./Transactions.js";
import {ViewTransaction} from "./views/ViewTransaction.js";

const transactions = new Transactions();

/*
 *  Navigate to a new page without refreshing by using the router
 *   pass null to generate a 404
 */
const navigateTo = (url, params) => {
    if (url === null) {
        router();
    } else {
        history.pushState(null, null, url);
        router(url, params);
    }
};

/*
 *  Show the appropriate view based on the URL
 */
const router = async (url, params) => {
    let match = null;
    if (url) {
        const routes = [
            {path: "/", view: Home},
            {path: "/login", view: Login},
            {path: "/add", view: CreateTransaction},
            {hasData: true, path: "/transaction", view: ViewTransaction},
            {path: "/logout", view: Logout},
        ];
        match = routes.find((route) => {
            if (route?.hasData) {
                return url.startsWith(route.path);
            } else {
                return route.path === url;
            }
        });
    }

    if (!match || !url) {
        // Set this to window so it can be reset by the error handler same as server
        // side errors
        window.ajaxStatus = 404;
    }
    if (window.ajaxStatus >= 400) {
        match = {path: "/error", view: ErrorView};
    }

    clearModal();
    const view = new match.view();
    view.show(navigateTo, transactions, params);
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[ajax-link]")) {
            e.preventDefault();
            navigateTo(e.target.getAttribute("href"));
        }
    });

    if (!getCookie("authToken")) {
        navigateTo("/login");
    } else {
        router(location.pathname);
        logoutOnSessionExpiration(() => navigateTo("/logout"));
    }
});
