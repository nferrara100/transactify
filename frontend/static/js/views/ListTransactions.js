import {LogoutButton} from "../LogoutButton.js";
import {BaseView} from "./BaseView.js";

export class ListTransactions extends BaseView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async handleHtml() {
        if (!document.querySelector("#transactionTable")) {
            const logoutButton = new LogoutButton(this.navigateTo, this.transaction);
            this.fillPage(`
                ${logoutButton.getHtml()}
                <div id="transactionTable">
                    <h1>Transactions</h1>
                    <a href="/create" class="button" ajax-link>Create Transaction</a>
                    <br /><br />

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
            this.setObserver();
            await this.loadTransactions();
        }
    }

    async loadTransactions() {
        const transactions = await this.transactions.list();
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

    setObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const addedNodes = mutation.addedNodes;
                addedNodes.forEach((node) => {
                    // If the node is an element (and not text or something else)
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        node.addEventListener("click", (event) => {
                            const transactionID =
                                event.currentTarget.getAttribute("key");
                            this.navigateTo("/transaction/" + transactionID);
                        });
                    }
                });
            });
        });

        const tableBody = document.querySelector("#transactionTableBody");
        observer.observe(tableBody, {
            childList: true,
        });
    }
}
