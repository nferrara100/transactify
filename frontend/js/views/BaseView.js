export class BaseView {
    constructor(params) {
        this.params = params;
    }

    navigateTo;

    transactions;

    background;

    setTitle(title) {
        document.title = title + " - Expensify Take-Home Challenge";
    }

    async show(navigateTo, transactions) {
        this.navigateTo = navigateTo;
        this.transactions = transactions;
        this.background?.show(navigateTo, transactions);
        await this.handleHtml();
    }

    async handleHtml() {
        return this.fillPage("");
    }

    fillModal(html, small) {
        document.querySelector("#modal-insert").innerHTML = html;
        document
            .querySelector(".close")
            .addEventListener("click", () => this.navigateTo("/"));
        window.onclick = (event) => {
            if (event.target == document.getElementById("modal")) {
                this.navigateTo("/");
            }
        };
        const foreground = document.querySelector(".modal-foreground");
        if (small) {
            foreground.classList.add("small-modal");
        } else {
            foreground.classList.remove("small-modal");
        }
        document.querySelector(".modal-background").classList.add("block");
    }

    fillPage(html) {
        document.querySelector("#page").innerHTML = html;
    }
}
