import {BaseView} from "./BaseView.js";
import {fillSmallPage} from "../util.js";

/*
 *  Display generic error messages
 */
export class ErrorView extends BaseView {
    async handleHtml() {
        if (window.ajaxStatus === 404) {
            fillSmallPage(
                `
                <p>
                    Please check the URL and try again or go <a href="/" ajax-link>home</a>.
                </p>
                `,
                "Page Not Found",
            );
        } else {
            fillSmallPage(
                `
                <p>
                    Please <a href="">refresh the page</a> to try again or go <a href="/" ajax-link>home</a>.
                </p>
                `,
                "An Error Occurred",
            );
        }
        // Reset the status so this doesn't trigger again, unless it occurs again
        window.ajaxStatus = 200;
    }
}
