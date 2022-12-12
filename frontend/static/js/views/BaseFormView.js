import {BaseView} from "./BaseView.js";

export class BaseFormView extends BaseView {
    form;

    formSelector;

    submitButton;

    endpoint;

    async handleHtml() {
        this.form = document.querySelector(this.formSelector);
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.form.addEventListener("submit", this.onSubmit.bind(this));
    }

    onSubmit(event) {
        event.preventDefault();
        this.submitButton.disabled = true;

        fetch(this.endpoint, {
            method: "POST",
            body: new FormData(this.form),
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
