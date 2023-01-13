import {fillSmallPage, setTitle} from "../util.js";
import {BaseView} from "./BaseView.js";

export class ErrorView extends BaseView {
    async handleHtml() {
        if (window.ajaxStatus === 404) {
            setTitle("Page Not Found");
            fillSmallPage(
                `
                <h1>Page Not Found</h1>
                <p>
                    Please check the URL and try again or go <a href="/" ajax-link>home</a>.
                </p>
                `,
            );
        } else {
            setTitle("An Error Occurred");
            fillSmallPage(
                `
                <h1>An Error Occurred</h1>
                <p>
                    Please <a href="">refresh the page</a> to try again or go <a href="/" ajax-link>home</a>.
                </p>
                `,
            );
        }
        window.ajaxStatus = null;
    }
}
