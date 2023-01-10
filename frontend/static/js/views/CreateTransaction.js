import {BaseFormView} from "./BaseFormView.js";
import {ListTransactions} from "./ListTransactions.js";

export class CreateTransaction extends BaseFormView {
    constructor(params) {
        super(params);
        this.background = new ListTransactions();
        this.setTitle("Create Transaction");
    }

    formId = "create-form";

    endpoint = "/api/transaction.php";

    async handleHtml() {
        this.fillModal(`
            <h1>Create Transaction</h1>
            <form action="${this.endpoint}" method="POST" id="${this.formId}">
                <label for="created">Date</label>
                <input type="date" name="created" id="created" />
                <label for="merchant">Merchant</label>
                <input type="text" name="merchant" id="merchant" />
                <label for="amount">Amount ($)</label>
                <input type="number" name="amount" id="amount" step="any" />
                <button type="submit">Save</button>
                <div class="response"></div>
            </form>
        `);
        document.getElementById("created").valueAsDate = new Date();
        super.handleHtml();
    }

    async onSubmitResult(data) {
        if (data.status === 201) {
            const json = await data.json();
            this.transactions.set(json.transactions[0]);
            this.navigateTo("/");
        } else {
            this.triggerError();
        }
    }
}
