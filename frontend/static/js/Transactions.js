import {cookieExists} from "./cookies.js";

export class Transactions {
    constructor() {
        this.transactions = [];
        this.fetch();
    }

    async get(index) {
        await Promise.race([this.fetchPromise]);
        if (index < this.transactions.length) {
            return this.transactions[index];
        }
        throw new Error(`Transaction ${index} not found`);
    }

    async list() {
        await Promise.race([this.fetchPromise]);
        return this.transactions;
    }

    wipe() {
        this.transactions = [];
    }

    set(transaction) {
        let i = 0;
        while (i < this.transactions.length) {
            if (this.transactions[i].created < transaction.created) {
                break;
            }
            i++;
        }
        this.transactions.splice(i, 0, transaction);
    }

    fetch() {
        if (cookieExists("authToken")) {
            this.fetchPromise = fetch("/api/transaction.php")
                .then((response) => response.json())
                .then((data) => {
                    const earlyTransactions = this.transactions;
                    this.transactions = data.transactions;
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
