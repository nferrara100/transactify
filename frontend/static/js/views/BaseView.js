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
        const html = await this.getHtml();
        this.fillPage(html);
        await this.execute();
    }

    async getHtml() {
        return "";
    }

    fillPage(html) {
        document.querySelector("#page").innerHTML = html;
    }

    async execute() {
        return;
    }
}
