export class BaseView {
    async show(navigateTo, transactions) {
        this.navigateTo = navigateTo;
        this.transactions = transactions;
        this.handleHtml();
        this.background?.show(navigateTo, transactions);
    }

    async handleHtml() {
        new Error("Not implemented");
    }
}
