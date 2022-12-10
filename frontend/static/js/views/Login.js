import {cookieExists} from "../cookies.js";
import {BaseView} from "./BaseView.js";

export class Login extends BaseView {
    constructor(params) {
        super(params);
        this.setTitle("Login");
    }

    loginForm;

    submitButton;

    endpoint = "/api/login.php";

    async handleHtml() {
        this.fillPage(`
            <h1>Login</h1>
            <form action="/api/login.php" method="POST" class="ajax" id="login-form">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" autofocus />
                <label for="password">Password</label>
                <input type="password" name="password" id="password" />
                <button type="submit">Login</button>
                <div class="response"></div>
            </form>
        `);

        if (cookieExists("authToken")) {
            this.navigateTo("/");
        }
        this.loginForm = document.querySelector("form.ajax");
        this.submitButton = this.loginForm.querySelector('button[type="submit"]');
        this.loginForm.addEventListener("submit", this.onSubmit.bind(this));
    }

    onSubmit(event) {
        event.preventDefault();
        this.submitButton.disabled = true;

        fetch(this.endpoint, {
            method: "POST",
            body: new FormData(this.loginForm),
        })
            .then(this.onSubmitResult.bind(this))
            .catch(() => this.triggerError());
    }

    triggerError(message) {
        const text = message || "Something went wrong. Please try again.";
        this.loginForm.querySelector(
            ".response",
        ).innerHTML = `<p class='error'>${text}</p>`;
        this.submitButton.disabled = false;
    }

    onSubmitResult(data) {
        this.submitButton.disabled = false;
        if (data.status === 200) {
            this.transactions.fetch();
            this.navigateTo("/");
        } else if (data.status === 401) {
            this.triggerError(
                "We couldn't recognize that username and password combination. Please try again.",
            );
        } else if (data.status === 403) {
            data.json().then((json) => {
                if (json.cloudflare_error) {
                    this.triggerError(
                        "It's not presently possible to access the Expensify API because of a Cloudflare error. Please try again later.",
                    );
                } else {
                    this.triggerError();
                }
            });
        } else {
            this.triggerError();
        }
    }
}
