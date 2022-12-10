export class BaseView {
    constructor(params) {
        this.params = params;
    }

    navigateTo;

    setTitle(title) {
        document.title = title + " - Expensify Take-Home Challenge";
    }

    async show(navigateTo, transactions) {
        this.navigateTo = navigateTo;
        this.transactions = transactions;
        await this.handleHtml();
        await this.execute();
    }

    async handleHtml() {
        return "";
    }

    fillPage(html) {
        document.querySelector("#page").innerHTML = html;
    }

    async execute() {
        return;
    }
}
