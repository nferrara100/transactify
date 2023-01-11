import {fillPage} from "../util.js";

export class BaseView {
    constructor(params) {
        this.params = params;
    }

    navigateTo;

    transactions;

    background;

    async show(navigateTo, transactions) {
        this.navigateTo = navigateTo;
        this.transactions = transactions;
        this.background?.show(navigateTo, transactions);
        await this.handleHtml();
    }

    async handleHtml() {
        return fillPage("");
    }

    fillModal(html, small) {
        document.querySelector("#modal").innerHTML = `
            <div class="modal-background">
                <div class="modal-foreground ${small ? "small-modal" : ""}">
                    <div class="modal-top">
                        <hr>
                        <span id="modal-close" class="close">&times;</span>
                    </div>
                    <div id="modal-insert">${html}</div>
                </div>
            </div>`;
        document
            .querySelector("#modal-close")
            .addEventListener("click", () => this.navigateTo("/"));
    }
}
