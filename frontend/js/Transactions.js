import {cookieExists} from "./util.js";

export class Transactions {
    constructor() {
        this.transactions = new Map();
        this.revision = 1;
        this.rendered = 0;
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
        if (this.rendered < this.revision) {
            this.rendered++;
            return true;
        }
        return false;
    }

    set(transaction) {
        this.transactions.set(transaction.transactionID, transaction);
        this.revision++;
    }

    async sorted(key, reverse = false) {
        await Promise.race([this.fetchPromise]);
        return Array.from(this.transactions.values()).sort((a, b) => {
            if (reverse) {
                return b[key].localeCompare(a[key]);
            }
            return a[key].localeCompare(b[key]);
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
