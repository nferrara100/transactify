import {BaseView} from "./BaseView.js";
import {ListTransactions} from "./ListTransactions.js";
import {formatCurrency, toCheckbox} from "../helpers.js";

export class ViewTransaction extends BaseView {
    constructor(params) {
        super(params);
        this.background = new ListTransactions();
        this.key = params.key;
        this.setTitle("View Transaction");
    }

    async handleHtml() {
        this.transaction = await this.transactions.get(this.key);
        this.fillModal(`
            <h1>View Transaction</h1>
            <table>
                ${this.getDetails()}
            </table>
        `);
    }

    getDetails() {
        return `
            <tr>
                <td>Amount</td>
                <td>${formatCurrency(
                    this.transaction.amount,
                    this.transaction.currency,
                )}</td>
            </tr>
            <tr>
                <td>Bank</td>
                <td>${this.transaction.bank}</td>
            </tr>
            <tr>
                <td>Billable</td>
                <td>${toCheckbox(this.transaction.billable)}</td>
            </tr>
            <tr>
                <td>Card Name</td>
                <td>${this.transaction.cardName}</td>
            </tr>
            <tr>
                <td>Card Number</td>
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
                <td>Created</td>
                <td>${new Date(this.transaction.created).toLocaleDateString()}</td>
            </tr>
            ${
                this.transaction.currency !== "USD"
                    ? `
                <tr>
                    <td>Converted Amount</td>
                    <td>${formatCurrency(this.transaction.convertedAmount, "USD")}</td>
                </tr>
                <tr>
                    <td>Currency Conversion Rate</td>
                    <td>${this.transaction.currencyConversionRate}</td>
                </tr>
                `
                    : ""
            }
            <tr>
                <td>Details</td>
                <td>${this.transaction.details}</td>
            </tr>
            <tr>
                <td>Managed Card</td>
                <td>${toCheckbox(this.transaction.managedCard)}</td>
            </tr>
            <tr>
                <td>Merchant Category Code</td>
                <td>${this.transaction.mcc}</td>
            </tr>
            <tr>
                <td>Merchant</td>
                <td>${this.transaction.merchant}</td>
            </tr>
            <tr>
                <td>Receipt State</td>
                <td>${this.transaction.receiptState}</td>
            </tr>
            <tr>
                <td>Reimbursable</td>
                <td>${toCheckbox(this.transaction.reimbursable)}</td>
            </tr>
            <tr>
                <td>Tag</td>
                <td>${this.transaction.tag}</td>
            </tr>
            <tr>
                <td>Unverified</td>
                <td>${toCheckbox(this.transaction.unverified)}</td>
            </tr>
        `;
    }
}
