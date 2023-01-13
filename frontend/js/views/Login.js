import {cookieExists, fillPage, logoutOnSessionExpiration, setTitle} from "../util.js";
import {BaseFormView} from "./BaseFormView.js";

export class Login extends BaseFormView {
    formId = "#login-form";

    endpoint = "/api/login.php";

    async handleHtml() {
        setTitle("Login");
        fillPage(`
            <div class="small-page">
                <hr class="invert">
                <h1>Login</h1>
                <form action="${this.endpoint}" method="POST" id="${this.formId}">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username" autofocus required/>
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" required />
                    <button type="submit">Login</button>
                    <div class="response"></div>
                </form>
            </div>
        `);

        if (cookieExists("authToken")) {
            this.navigateTo("/");
        }
        await super.handleHtml();
    }

    async onSubmitResult(data) {
        const json = await data.json();
        if (data.status === 200) {
            this.transactions.fetch();
            logoutOnSessionExpiration(() => this.navigateTo("/logout"));
            this.navigateTo("/");
        } else if (data.status === 401) {
            this.triggerError(
                "We couldn't recognize that username and password combination. Please try again.",
            );
        } else if (json.cloudflare_error) {
            this.triggerError(
                "It's not presently possible to access the Expensify API because of a Cloudflare error. Please try again later.",
            );
        } else {
            this.triggerError();
        }
    }
}
