import {
    displayLoadingComplete,
    fillPage,
    formatCurrency,
    logoutOnSessionExpiration,
    setTitle,
} from "../util.js";
import {BaseView} from "./BaseView.js";

// This HTML is included here as a performance optimization in the absence of a bundler.
// Re-examine if one is implemented in the future.
const html = `
    <nav>
        <div class="title">
            <img src="/frontend/icon.svg" alt="Logo" id="logo" />
            <span class="title-text">TRANSACTIFY</span>
            <span class="subtitle">Manage your transactions. Easily.</span>
        </div>
        <div class="nav-buttons">
            <a class="button secondary-button" ajax-link href="/logout">Logout</a>
            <a href="/create" class="button" ajax-link>+ Create Transaction</a>
        </div>
    </nav>

    <!-- Credit: https://github.com/loadingio/css-spinner/ -->
    <div class="loading-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>

    <div id="search-container">
        <input type="search" placeholder="Search by merchant" id="search-input" />
        <button type="submit" id="search-button">Search</button>
    </div>
    <div id="transactions" class="hidden">
        <table>
            <thead>
                <tr>
                    <th class="created sortable-header" data-sort-dir="desc">Date<br /></th>
                    <th class="merchant sortable-header">Merchant<br /></th>
                    <th class="amount sortable-header">Amount<br /></th>
                </tr>
            </thead>
            <tbody id="transactionTableBody"></tbody>
        </table>
    </div>
    <button id="scroll-top">&#8593;</button>
    <hr id="bottom-hr" class="invert hidden" />
`;

/*
 *  The main homepage once logged in which displays navigation and all transactions
 */
export class Home extends BaseView {
    constructor(params) {
        super(params);
        setTitle("Home");
        logoutOnSessionExpiration(this.logout.bind(this));
    }

    logout() {
        this.navigateTo("/logout");
    }

    async handleHtml() {
        // Don't rerender if the page has already been rendered
        if (document.getElementById("transactionTableBody")) {
            return;
        }
        fillPage(html);
        this.addEventListeners();
        this.setObserver();
        await this.loadTransactions();
        displayLoadingComplete();
        this.infiniteScroll();
    }

    /*
     *  Load the first transactions and display a message if none exist.
     */
    async loadTransactions() {
        const tableBody = document.getElementById("transactionTableBody");
        tableBody.innerHTML = "";
        const transactions = await this.appendTransactions();
        if (transactions.length === 0) {
            tableBody.innerHTML = `
            <tr class="no-transactions">
                <td colspan="3">
                    <div>No transactions found</div>
                </td>
            </tr>
            `;
        }
    }

    /*
     *  Create a handler for the infinite scroll that appends subsequent transactions
     */
    infiniteScroll() {
        let page = 1;
        const handleInfiniteScroll = () => {
            const currentPosition = window.innerHeight + window.pageYOffset;
            const distanceToBottom = document.body.scrollHeight - currentPosition;
            const endOfPageOffset = 500;
            const shouldLoad = distanceToBottom < endOfPageOffset;
            if (shouldLoad) {
                this.appendTransactions(page);
                page++;
            }
        };
        window.addEventListener("scroll", handleInfiniteScroll);
    }

    /*
     *  Make everything clickable
     */
    addEventListeners() {
        const scrollTopButton = document.getElementById("scroll-top");
        window.onscroll = function () {
            if (document.documentElement.scrollTop > 150) {
                scrollTopButton.style.display = "flex";
            } else {
                scrollTopButton.style.display = "none";
            }
        };
        scrollTopButton.addEventListener("click", function () {
            window.scrollTo({behavior: "smooth", top: 0});
        });

        document.getElementById("search-input").addEventListener("keyup", (event) => {
            if (event.code === "Enter") {
                this.onSearch.bind(this)(event);
            }
        });
        document.getElementById("search-button").addEventListener("click", (event) => {
            this.onSearch.bind(this)(event);
        });
        document.getElementById("logo").addEventListener("click", (event) => {
            this.onSearch.bind(this)(null, "");
        });
        document.querySelectorAll(".sortable-header").forEach((element) => {
            element.addEventListener("click", (event) => this.onHeaderClick(event));
        });
    }

    /*
     *  Event handler to search for the `providedQuery` or the value of the search input
     */
    onSearch(event, providedQuery) {
        let query = providedQuery;
        const searchInput = document.getElementById("search-input");
        if (providedQuery === undefined) {
            query = searchInput.value;
        } else {
            searchInput.value = providedQuery;
        }
        this.transactions.search(query);
        this.loadTransactions();
    }

    /*
     *  Reorder the table by the clicked header
     */
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

    /*
     *  Add the next page of transactions to the table without refreshing the page
     */
    async appendTransactions(page = 0) {
        const tableBody = document.getElementById("transactionTableBody");
        const transactions = await this.transactions.list(page);
        let newHtml = "";
        for (const transaction of transactions) {
            newHtml += this.createTr(transaction);
        }
        tableBody.insertAdjacentHTML("beforeend", newHtml);
        return transactions;
    }

    /*
     *  Take a transaction and return the HTML for a table row
     */
    createTr(transaction) {
        return `
            <tr transactionId="${transaction.transactionID}">
                <td class="created">${new Date(
                    transaction.created,
                ).toLocaleDateString()}</td>
                <td class="merchant">${transaction.merchant}</td>
                <td class="amount">${formatCurrency(
                    transaction.convertedAmount,
                    "USD",
                )}</td>
            </tr>
        `;
    }

    /*
     *  Make each transaction row clickable so it displays the transaction details
     */
    setObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const addedNodes = mutation.addedNodes;
                addedNodes.forEach((node) => {
                    node.addEventListener("click", (event) => {
                        const transactionId =
                            event.currentTarget.getAttribute("transactionId");
                        this.navigateTo("/transaction/" + transactionId);
                    });
                });
            });
        });

        const tableBody = document.getElementById("transactionTableBody");
        observer.observe(tableBody, {
            attributeFilter: ["transactionId"],
            childList: true,
        });
    }
}
