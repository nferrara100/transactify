import {cookieExists} from "./cookies.js";

export class Transactions {
    constructor() {
        this.transactions = {};
        this.loadedCallbacks = [];
        this.fetchTransactions();
    }

    getTransaction(transactionID) {
        if (this.transactions[transactionID] !== undefined) {
            return this.transactions[transactionID];
        }
        throw new Error(`Transaction ${transactionID} not found`);
    }

    listTransactions() {
        return this.transactions;
    }

    setTransactions(newTransactions) {
        this.transactions = newTransactions;
    }

    addTransaction(transaction) {
        this.transactions[transaction.transactionID] = transaction;
    }

    addLoadedCallback(callback) {
        this.loadedCallbacks.push(callback);
    }

    fetchTransactions() {
        if (cookieExists("authToken")) {
            fetch("/api/transactions.php")
                .then((response) => response.json())
                .then((data) => {
                    for (const transaction of data.transactions) {
                        this.addTransaction(transaction);
                    }
                    for (const callback of this.loadedCallbacks) {
                        callback();
                    }
                });
        }
    }
}
