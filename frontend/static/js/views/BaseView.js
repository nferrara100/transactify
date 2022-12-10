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
    }

    async handleHtml() {
        return this.fillPage("");
    }

    fillModal(html) {
        document.querySelector("#modal-insert").innerHTML = html;
        document.querySelector(".close").addEventListener("click", this.dismissModal);
        window.onclick = (event) => {
            if (event.target == document.getElementById("modal")) {
                this.dismissModal();
            }
        };
        document.querySelector(".modal").classList.add("block");
    }

    dismissModal() {
        document.querySelector("#modal-insert").innerHTML = "";
        document.querySelector(".modal").classList.remove("block");
        const previousState = history.state;
        if (previousState && previousState.url === "/") {
            history.go(-1);
        } else {
            this.navigateTo("/");
        }
    }

    fillPage(html) {
        document.querySelector("#page").innerHTML = html;
    }
}
