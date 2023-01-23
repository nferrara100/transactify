/*
 *  The base view from which all viewed are extended
 */
export class BaseView {
    /*
     *  Called by the router after the view is constructed to show the view
     */
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
