import {BaseView} from "./BaseView.js";

export class CreateTransaction extends BaseView {
    constructor(params) {
        super(params);
        this.setTitle("Create Transaction");
    }

    async getHtml() {
        return `
            <h1>Create Transaction</h1>
            <p>
                Form goes here.
            </p>
        `;
    }
}
