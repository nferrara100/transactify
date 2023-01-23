import {cookieExists, fillSmallPage, logoutOnSessionExpiration} from "../util.js";
import {BaseFormView} from "./BaseFormView.js";

/*
 *  Generates the login form
 */
export class Login extends BaseFormView {
    formId = "#login-form";

    endpoint = "/api/login.php";

    async handleHtml() {
        if (cookieExists("authToken")) {
            this.navigateTo("/");
            return;
        }
        fillSmallPage(
            `
            <form action="${this.endpoint}" method="POST" id="${this.formId}">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" autofocus required/>
                <label for="password">Password</label>
                <input type="password" name="password" id="password" required />
                <button type="submit">Login</button>
                <div class="response"></div>
            </form>
        `,
            "Login",
        );
        this.prepareInteractivity();
    }

    async onSubmitResult(data) {
        const json = await data.json();
        if (data.status === 200) {
            this.transactions.fetch();
            logoutOnSessionExpiration(() => this.navigateTo("/logout"));
            this.navigateTo("/");
        } else if (data.status === 401) {
            this.triggerError(
                "Unknown username and password combination. Please try again.",
            );
        } else if (json.cloudflare_error) {
            this.triggerError(
                "It's not presently possible to access the Expensify API because of a Cloudflare error. Please try again later.",
            );
        } else if (json.csrfError) {
            this.triggerError(`Please <a href="">refresh the page</a> and try again.`);
        } else {
            this.triggerError();
        }
    }
}
