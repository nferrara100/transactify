import {cookieExists} from "./util.js";

export class Transactions {
    constructor() {
        this.transactions = new Map();
        this.rendered = false;
        this.sortKey = "created";
        this.sortDir = "desc";
        this.fetch();
    }

    async get(id) {
        await Promise.race([this.fetchPromise]);
        return this.transactions.get(id);
    }

    wipe() {
        this.transactions = new Map();
        this.revision = 1;
        this.rendered = 0;
    }

    shouldRender() {
        return !this.rendered;
    }

    set(transaction) {
        this.transactions.set(transaction.transactionID, transaction);
        this.rendered = false;
    }

    search(query) {
        this.rendered = false;
        this.query = query;
    }

    orderBy(sortKey, sortDir) {
        if (this.sortKey === sortKey && this.sortDir === sortDir) {
            return;
        }
        this.rendered = false;
        this.sortKey = sortKey;
        this.sortDir = sortDir;
    }

    async list() {
        await Promise.race([this.fetchPromise]);
        this.rendered = true;
        let transactionArray = Array.from(this.transactions.values());
        if (this.query) {
            transactionArray = transactionArray.filter((transaction) => {
                return transaction.merchant
                    .toLowerCase()
                    .includes(this.query.toLowerCase());
            });
        }
        return transactionArray.sort((a, b) => {
            if (typeof a[this.sortKey] === "number") {
                if (this.sortDir === "asc") {
                    return a[this.sortKey] - b[this.sortKey];
                }
                return b[this.sortKey] - a[this.sortKey];
            }
            if (this.sortDir === "asc") {
                return String(a[this.sortKey]).localeCompare(
                    b[this.sortKey].toString(),
                );
            }
            return String(b[this.sortKey]).localeCompare(String(a[this.sortKey]));
        });
    }

    fetch() {
        if (cookieExists("authToken")) {
            this.fetchPromise = fetch("/api/transaction.php")
                .then((response) => response.json())
                .then((data) => {
                    const earlyTransactions = this.transactions;
                    this.transactions = new Map(
                        data.transactions.map((transaction) => [
                            transaction.transactionID,
                            transaction,
                        ]),
                    );
                    earlyTransactions.forEach((transaction) => {
                        this.set(transaction);
                    });
                })
                .catch((error) => {
                    alert("Could not load transactions. Please try again later.");
                });
        }
    }
}
