import {cookieExists} from "./cookies.js";

export class Transactions {
    constructor() {
        this.transactions = {};
        this.fetchTransactions();
    }

    async getTransaction(transactionID) {
        await Promise.race([this.fetchPromise]);
        if (this.transactions[transactionID] !== undefined) {
            return this.transactions[transactionID];
        }
        throw new Error(`Transaction ${transactionID} not found`);
    }

    async listTransactions() {
        await Promise.race([this.fetchPromise]);
        return this.transactions;
    }

    setTransactions(newTransactions) {
        this.transactions = newTransactions;
    }

    addTransaction(transaction) {
        this.transactions[transaction.transactionID] = transaction;
    }

    fetchTransactions() {
        if (cookieExists("authToken")) {
            this.fetchPromise = fetch("/api/transactions.php")
                .then((response) => response.json())
                .then((data) => {
                    for (const transaction of data.transactions) {
                        this.addTransaction(transaction);
                    }
                });
        }
    }
}
