import {ListTransactions} from "./ListTransactions.js";

export class CreateTransaction extends ListTransactions {
    constructor(params) {
        super(params);
        this.setTitle("Create Transaction");
    }

    async handleHtml() {
        this.fillModal(`
            <h1>Create Transaction</h1>
            <p>
                Form goes here.
            </p>
        `);
        super.handleHtml();
    }
}
