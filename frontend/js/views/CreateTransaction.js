import {BaseFormView} from "./BaseFormView.js";
import {ListTransactions} from "./ListTransactions.js";
import {setTitle} from "../util.js";

export class CreateTransaction extends BaseFormView {
    formId = "create-form";

    endpoint = "/api/transaction.php";

    async handleHtml() {
        this.background = new ListTransactions();
        setTitle("Create Transaction");

        this.fillModal(
            `
            <h1>Create Transaction</h1>
            <form action="${this.endpoint}" method="POST" id="${this.formId}">
                <label for="created">Date</label>
                <input type="date" name="created" id="created" required/>
                <label for="merchant">Merchant</label>
                <input type="text" name="merchant" id="merchant" placeholder="Small Pharaoh's Falafel" required/>
                <label for="amount">Amount (USD)</label>
                <input type="number" placeholder="132.78" name="amount" id="amount" step=".01" required/>
                <button type="submit">Save</button>
                <div class="response"></div>
            </form>
        `,
            true,
        );
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
