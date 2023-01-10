export const clearModal = () => {
    document.querySelector("#modal-insert").innerHTML = "";
    document.querySelector(".modal-background").classList.remove("block");
};

export const formatCurrency = (amount, currency) => {
    return (
        (amount / 100).toLocaleString(undefined, {
            minimumFractionDigits: 2,
        }) +
        " " +
        currency
    );
};

export const toCheckbox = (value) => {
    if (value) {
        return `<span class="icon" title="Yes" aria-label="Yes">&#x2714;</span>`;
    }
    return `<span class="icon" title="No" aria-label="No">&#x2716;</span>`;
};
