import {deleteCookie} from "../cookies.js";
import {BaseView} from "./BaseView.js";

export class Logout extends BaseView {
    handleHtml() {
        deleteCookie("authToken");
        this.transactions.setTransactions({});
        this.navigateTo("/login");
    }
}
