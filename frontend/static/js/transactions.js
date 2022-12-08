export class Transactions {
    constructor() {
        this.transactions = {};
    }

    getTransaction(transactionID) {
        return this.transactions[transactionID];
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
}
