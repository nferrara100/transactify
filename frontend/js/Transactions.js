import {cookieExists} from "./util.js";

/*
 *  The main datastore for transactions, along with helper methods to deal with them
 */
export class Transactions {
    constructor() {
        this.transactions = new Map();
        this.sortKey = "created";
        this.sortDir = "desc";
        // The number of transactions to display at once
        this.chunkSize = 100;
        this.fetch();
    }

    async get(id) {
        await Promise.race([this.fetchPromise]);
        return this.transactions.get(id);
    }

    async wipe() {
        await Promise.race([this.fetchPromise]);
        this.transactions = new Map();
    }

    set(transaction) {
        this.transactions.set(transaction.transactionID, transaction);
    }

    search(query) {
        this.query = query;
    }

    orderBy(sortKey, sortDir) {
        this.sortKey = sortKey;
        this.sortDir = sortDir;
    }

    /*
     *  Return an array of sorted transactions, starting at `startPage` * `chunkSize`,
     *   of size `chunkSize`
     */
    async list(startPage = 0) {
        await Promise.race([this.fetchPromise]);

        const start = startPage * this.chunkSize;
        if (start > this.transactions.size) {
            return [];
        }

        let transactionArray = Array.from(this.transactions.values());
        if (this.query) {
            transactionArray = transactionArray.filter((transaction) => {
                return transaction.merchant
                    .toLowerCase()
                    .includes(this.query.toLowerCase());
            });
        }

        const sorted = transactionArray.sort((a, b) => {
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

        return sorted.slice(start, start + this.chunkSize);
    }

    /*
     *  Fetch transactions from the server
     */
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
                    this.errored = false;
                })
                .catch(() => {
                    this.errored = true;
                });
        }
    }

    hasErrored() {
        return this.errored;
    }
}
