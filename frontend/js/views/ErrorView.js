import {fillPage, setTitle} from "../util.js";
import {BaseView} from "./BaseView.js";

export class ErrorView extends BaseView {
    async handleHtml() {
        if (window.ajaxStatus === 404) {
            setTitle("Page Not Found");
        } else {
            setTitle("An Error Occurred");
        }
        if (window.ajaxStatus === 404) {
            fillPage(
                `<h1>We could not find that page</h1>
                <p>
                    Please check the URL and try again or go <a href="/" ajax-link>home</a>.
                </p>`,
            );
        } else {
            fillPage(
                `<h1>An error occurred</h1>
                <p>
                    Please <a href="">refresh the page</a> to try again or go <a href="/" ajax-link>home</a>.
                </p>`,
            );
        }
        window.ajaxStatus = null;
    }
}
