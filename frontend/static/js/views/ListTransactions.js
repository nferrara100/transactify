import {LogoutButton} from "../LogoutButton.js";
import {addTransactionDetailsClick} from "../transaction_details.js";
import {BaseView} from "./BaseView.js";

export class ListTransactions extends BaseView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async handleHtml() {
        const logoutButton = new LogoutButton(this.navigateTo, this.transaction);
        this.fillPage(`
            ${logoutButton.getHtml()}
            <div id="transactionTable">
                <h1>Transactions</h1>

                <div class="loading-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <table id="transactions" class="hidden">
                    <thead>
                        <tr>
                            <th>Transaction Date</th>
                            <th>Merchant</th>
                            <th>Amount</th>
                        </tr>
                    </thead>

                    <tbody id="transactionTableBody"></tbody>
                </table>
            </div>
        `);
    }

    async execute() {
        this.transactions.addLoadedCallback(this.onTransactionsLoaded.bind(this));
        addTransactionDetailsClick(this.transactions);
    }

    onTransactionsLoaded() {
        const transactions = this.transactions.listTransactions();
        for (const transaction of Object.values(transactions)) {
            const tr = document.createElement("tr");
            tr.setAttribute("key", transaction.transactionID);
            const date = document.createElement("td");
            date.innerHTML = transaction.created;
            const merchant = document.createElement("td");
            merchant.innerHTML = transaction.merchant;
            const amount = document.createElement("td");
            const formattedAmount = (transaction.amount / 100).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                },
            );
            amount.innerHTML = formattedAmount + " " + transaction.currency;
            tr.appendChild(date);
            tr.appendChild(merchant);
            tr.appendChild(amount);
            document.getElementById("transactionTableBody").appendChild(tr);
        }
        document.querySelectorAll(".loading-ring").forEach((element) => {
            element.classList.add("hidden");
        });
        document.getElementById("transactions").classList.remove("hidden");
    }
}
