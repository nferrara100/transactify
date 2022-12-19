import {cookieExists} from "./cookies.js";

export class Transactions {
    constructor() {
        this.transactions = {};
        this.fetch();
    }

    async get(transactionID) {
        await Promise.race([this.fetchPromise]);
        if (this.transactions[transactionID] !== undefined) {
            return this.transactions[transactionID];
        }
        throw new Error(`Transaction ${transactionID} not found`);
    }

    async list() {
        await Promise.race([this.fetchPromise]);
        return this.transactions;
    }

    wipe() {
        this.transactions = {};
    }

    set(transaction) {
        this.transactions[transaction.transactionID] = transaction;
    }

    fetch() {
        if (cookieExists("authToken")) {
            this.fetchPromise = fetch("/api/transactions.php")
                .then((response) => response.json())
                .then((data) => {
                    for (const transaction of data.transactions) {
                        this.set(transaction);
                    }
                });
        }
    }
}
