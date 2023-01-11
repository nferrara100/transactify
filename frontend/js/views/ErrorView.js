import {setTitle} from "../util.js";
import {BaseView} from "./BaseView.js";

export class ErrorView extends BaseView {
    constructor(params) {
        super(params);
        if (window.statusCode === 404) {
            setTitle("Page Not Found");
        } else {
            setTitle("An Error Occurred");
        }
    }

    async handleHtml() {
        if (window.statusCode === 404) {
            this.fillPage(
                `<h1>We could not find that page</h1>
                <p>
                    Please check the URL and try again.
                </p>`,
            );
        } else {
            this.fillPage(
                `<h1>An error occurred</h1>
                <p>
                    Please <a href="">refresh the page</a> to try again.
                </p>`,
            );
        }
        window.RedirectStatus = null;
    }
}
