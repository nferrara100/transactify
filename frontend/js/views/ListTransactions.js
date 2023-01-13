import {
    fillPage,
    formatCurrency,
    logoutOnSessionExpiration,
    setTitle,
} from "../util.js";
import {BaseView} from "./BaseView.js";

export class ListTransactions extends BaseView {
    constructor(params) {
        super(params);
        setTitle("Home");
        logoutOnSessionExpiration(this.logout.bind(this));
    }

    logout() {
        this.navigateTo("/logout");
    }

    async handleHtml() {
        if (!this.transactions.shouldRender()) {
            return;
        }
        fillPage(`
        <div class="title">
        <img src = "/frontend/icon.svg" alt="Logo" class="logo"/>
        <span class="title-text">TRANSACTIFY</span>
        <span class="subtitle">Manage your transactions. Easily.</span>
        </div>
        <a class="button secondary-button" ajax-link href="/logout">Logout</a>
        <a href="/create" class="button" ajax-link>+ Create Transaction</a>

        <div class="loading-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>

        <table id="transactions" class="hidden">
            <div id="search-container">
                <form id="search-form">
                    <input type="search" placeholder="Search by merchant" id="search-input">
                    <button type="submit" id="search-button">
                        Search
                    </button>
                </form>
            </div>
            <thead>
                <tr>
                    <th class="created sortable-header" data-sort-dir="desc">Date</th>
                    <th class="merchant sortable-header">Merchant</th>
                    <th class="amount sortable-header">Amount</th>
                </tr>
            </thead>
            <tbody id="transactionTableBody"></tbody>
        </table>
        <hr id="bottom-hr" class="invert hidden" />
        `);
        document.getElementById("search-input").addEventListener("keyup", (event) => {
            if (event.code === "Enter") {
                this.onSearch.bind(this)(event);
            }
        });
        document.getElementById("search-button").addEventListener("click", (event) => {
            this.onSearch.bind(this)(event);
        });

        document
            .getElementById("search-form")
            .addEventListener("submit", (event) => this.onSearch(event));
        document.querySelectorAll(".sortable-header").forEach((element) => {
            element.addEventListener("click", (event) => this.onHeaderClick(event));
        });

        await this.loadTransactions();
    }

    onSearch() {
        const searchInput = document.getElementById("search-input");
        this.transactions.search(searchInput.value);
        this.loadTransactions();
    }

    onHeaderClick(event) {
        const sortKey = event.currentTarget.classList[0];
        const sortDir =
            event.currentTarget.getAttribute("data-sort-dir") === "asc"
                ? "desc"
                : "asc";
        document.querySelectorAll(".sortable-header").forEach((element) => {
            element.removeAttribute("data-sort-dir");
        });
        event.currentTarget.setAttribute("data-sort-dir", sortDir);
        this.transactions.orderBy(sortKey, sortDir);
        this.loadTransactions();
    }

    async loadTransactions() {
        this.setObserver();
        const tableBody = document.getElementById("transactionTableBody");
        tableBody.innerHTML = "";
        const transactions = await this.transactions.list();
        for (const transaction of transactions) {
            const tr = document.createElement("tr");
            tr.setAttribute("key", transaction.transactionID);
            const date = document.createElement("td");
            date.innerHTML = new Date(transaction.created).toLocaleDateString();
            const merchant = document.createElement("td");
            merchant.innerHTML = transaction.merchant;
            const amount = document.createElement("td");
            amount.classList.add("amount");
            amount.innerHTML = formatCurrency(transaction.convertedAmount, "USD");
            tr.appendChild(date);
            tr.appendChild(merchant);
            tr.appendChild(amount);
            tableBody.appendChild(tr);
        }
        if (transactions.length === 0) {
            tableBody.innerHTML = `
            <td colspan="3">
                <div class="no-transactions">No transactions found</div>
            </td>
            `;
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
                            if (transactionKey) {
                                this.navigateTo("/transaction/" + transactionKey);
                            }
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
