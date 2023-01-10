import {BaseView} from "./BaseView.js";

export class BaseFormView extends BaseView {
    form;

    formId;

    submitButton;

    endpoint;

    async handleHtml() {
        this.form = document.getElementById(this.formId);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.form.addEventListener("submit", this.onSubmit.bind(this));
    }

    onSubmit(event) {
        event.preventDefault();
        this.submitButton.disabled = true;

        const formData = new FormData(this.form);
        const amount = formData.get("amount");
        if (amount) {
            const cents = Math.round((+amount + Number.EPSILON) * 100);
            formData.set("amount", cents);
        }
        fetch(this.endpoint, {
            method: "POST",
            body: formData,
        })
            .then(this.invokeOnSubmitResult.bind(this))
            .catch((error) => this.triggerError(error));
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

    async onSubmitResult(data) {
        throw new Error("Not Implemented");
    }
}
