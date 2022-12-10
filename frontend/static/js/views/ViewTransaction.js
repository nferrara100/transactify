import {ListTransactions} from "./ListTransactions.js";

export class ViewTransaction extends ListTransactions {
    constructor(params) {
        super(params);
        this.id = params.id;
        this.setTitle("View Transaction");
    }

    async handleHtml() {
        this.transaction = await this.transactions.get(this.id);
        this.fillModal(`
            <h1>View Transaction</h1>
            <table>
                ${this.getDetails()}
            </table>
        `);
        super.handleHtml();
    }

    getDetails() {
        return `
            <tr>
                <td>Amount</td>
                <td>${this.transaction.amount}</td>
            </tr>
            <tr>
                <td>Bank</td>
                <td>${this.transaction.bank}</td>
            </tr>
            <tr>
                <td>Billable</td>
                <td>${this.transaction.billable}</td>
            </tr>
            <tr>
                <td>CardID</td>
                <td>${this.transaction.cardID}</td>
            </tr>
            <tr>
                <td>CardName</td>
                <td>${this.transaction.cardName}</td>
            </tr>
            <tr>
                <td>CardNumber</td>
                <td>${this.transaction.cardNumber}</td>
            </tr>
            <tr>
                <td>Category</td>
                <td>${this.transaction.category}</td>
            </tr>
            <tr>
                <td>Comment</td>
                <td>${this.transaction.comment}</td>
            </tr>
            <tr>
                <td>ConvertedAmount</td>
                <td>${this.transaction.convertedAmount}</td>
            </tr>
            <tr>
                <td>Created</td>
                <td>${this.transaction.created}</td>
            </tr>
            <tr>
                <td>CurrencyConversionRate</td>
                <td>${this.transaction.currencyConversionRate}</td>
            </tr>
            <tr>
                <td>Details</td>
                <td>${this.transaction.details}</td>
            </tr>
            <tr>
                <td>ManagedCard</td>
                <td>${this.transaction.managedCard}</td>
            </tr>
            <tr>
                <td>Mcc</td>
                <td>${this.transaction.mcc}</td>
            </tr>
            <tr>
                <td>Merchant</td>
                <td>${this.transaction.merchant}</td>
            </tr>
            <tr>
                <td>ReceiptID</td>
                <td>${this.transaction.receiptID}</td>
            </tr>
            <tr>
                <td>ReceiptObject</td>
                <td>${this.transaction.receiptObject}</td>
            </tr>
            <tr>
                <td>ReceiptState</td>
                <td>${this.transaction.receiptState}</td>
            </tr>
            <tr>
                <td>Reimbursable</td>
                <td>${this.transaction.reimbursable}</td>
            </tr>
            <tr>
                <td>Tag</td>
                <td>${this.transaction.tag}</td>
            </tr>
            <tr>
                <td>${this.transaction.transactionID}</td>
            </tr>
            <tr>
                <td>Unverified</td>
                <td>${this.transaction.unverified}</td>
            </tr>
        `;
    }
}
