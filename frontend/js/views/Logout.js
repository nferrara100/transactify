import {BaseView} from "./BaseView.js";
import {deleteCookie} from "../util.js";

export class Logout extends BaseView {
    handleHtml() {
        deleteCookie("authToken");
        deleteCookie("authTokenExpiry");
        this.transactions.wipe();
        this.navigateTo("/login");
    }
}
