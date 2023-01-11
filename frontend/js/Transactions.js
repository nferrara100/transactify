import {cookieExists} from "./util.js";

export class Transactions {
    constructor() {
        this.transactions = [];
        this.revision = 1;
        this.rendered = 0;
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
        let i = 0;
        while (i < this.transactions.length) {
            if (this.transactions[i].created < transaction.created) {
                break;
            }
            i++;
        }
        this.transactions.splice(i, 0, transaction);
        this.revision++;
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
