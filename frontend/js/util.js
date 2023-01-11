export const clearModal = () => {
    document.querySelector("#modal").innerHTML = "";
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

export function cookieExists(cookieName) {
    // return true if cookie exists, false otherwise
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

export function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

export const setTitle = (title) => {
    document.title = title + " - Transactify Expense Management";
};

export const fillPage = (html) => {
    document.querySelector("#page").innerHTML = html;
};
