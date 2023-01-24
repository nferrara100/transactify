import {BaseView} from "./BaseView.js";
import {deleteCookie} from "../util.js";

/*
 *  Logs the user out before redirecting to the login page
 */
export class Logout extends BaseView {
    handleHtml() {
        deleteCookie("authToken");
        deleteCookie("authTokenExpiry");
        this.transactions.wipe();
        this.navigateTo("/login", {logout: true});
    }
}
