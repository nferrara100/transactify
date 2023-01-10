import {formatCurrency} from "../helpers.js";
import {LogoutButton} from "../LogoutButton.js";
import {BaseView} from "./BaseView.js";

export class ListTransactions extends BaseView {
    constructor(params) {
        super(params);
        this.setTitle("Home");
    }

    async handleHtml() {
        if (!this.transactions.shouldRender()) {
            return;
        }
        const logoutButton = new LogoutButton(this.navigateTo, this.transaction);
        this.fillPage(`
            ${logoutButton.getHtml()}
            <div class="title">
            <img src = "/frontend/icon.svg" alt="Logo" class="logo"/>
            <span class="title-text">TRANSACTIFY</span>
            <span class="subtitle">Manage your transactions. Easily.</span>
            </div>
            <a href="/create" class="button" ajax-link>+ Create Transaction</a>

            <div class="loading-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <table id="transactions" class="hidden">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Merchant</th>
                        <th class="amount">Amount</th>
                    </tr>
                </thead>
                <tbody id="transactionTableBody"></tbody>
            </table>
            <hr id="bottom-hr" class="invert hidden" />
        `);
        this.setObserver();
        await this.loadTransactions();
    }

    async loadTransactions() {
        const transactions = await this.transactions.list();
        const tableBody = document.getElementById("transactionTableBody");
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const tr = document.createElement("tr");
            tr.setAttribute("key", i);
            const date = document.createElement("td");
            date.innerHTML = new Date(transaction.created).toLocaleDateString();
            const merchant = document.createElement("td");
            merchant.innerHTML = transaction.merchant;
            const amount = document.createElement("td");
            amount.classList.add("amount");
            amount.innerHTML = formatCurrency(transaction.amount, transaction.currency);
            tr.appendChild(date);
            tr.appendChild(merchant);
            tr.appendChild(amount);
            tableBody.appendChild(tr);
        }
        document.querySelectorAll(".loading-ring").forEach((element) => {
            element.classList.add("hidden");
        });
        document.getElementById("transactions").classList.remove("hidden");
        document.getElementById("bottom-hr").classList.remove("hidden");
    }

    setObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const addedNodes = mutation.addedNodes;
                addedNodes.forEach((node) => {
                    // If the node is an element (and not text or something else)
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        node.addEventListener("click", (event) => {
                            const transactionKey =
                                event.currentTarget.getAttribute("key");
                            this.navigateTo("/transaction/" + transactionKey);
                        });
                    }
                });
            });
        });

        const tableBody = document.getElementById("transactionTableBody");
        observer.observe(tableBody, {
            childList: true,
        });
    }
}
