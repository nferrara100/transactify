import {BaseView} from "./BaseView.js";

export class BaseFormView extends BaseView {
    prepareInteractivity() {
        this.form = document.getElementById(this.formId);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.form.addEventListener("submit", this.onSubmit.bind(this));
    }

    onSubmit(event) {
        event.preventDefault();
        this.submitButton.disabled = true;

        const formData = new FormData(this.form);
        formData.set("csrfToken", window.csrfToken);
        const amount = formData.get("amount");
        if (amount) {
            const cents = Math.round((+amount + Number.EPSILON) * 100);
            formData.set("amount", cents);
        }
        fetch(this.endpoint, {
            body: formData,
            method: "POST",
        })
            .then(this.invokeOnSubmitResult.bind(this))
            .catch(() => this.triggerError());
    }

    triggerError(message) {
        const text = message || "Something went wrong. Please try again.";
        this.form.querySelector(".response").innerHTML = `<p class='error'>${text}</p>`;
        this.submitButton.disabled = false;
    }

    async invokeOnSubmitResult(data) {
        this.submitButton.disabled = false;
        await this.onSubmitResult(data);
    }

    async onSubmitResult() {
        throw new Error("Not Implemented");
    }
}
