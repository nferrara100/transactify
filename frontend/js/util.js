/*
 *  Return true if cookie `name` exists, false otherwise
 */
export function cookieExists(cookieName) {
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

/*
 *  Return value of cookie `name`
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

/*
 *  Delete cookie `name`
 */
export function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

/*
 *  Set document title to `title`
 */
export const setTitle = (title) => {
    document.title = title + " - Transactify Expense Management";
};

/*
 *  Include `html` in the page
 */
export const fillPage = (html) => {
    document.querySelector("#page").innerHTML = html;
};

/*
 *  Include `html` in a small page
 */
export const fillSmallPage = (html, title) => {
    fillPage(`
    <div class="small-page">
        <hr class="invert">
        <h1>${title}</h1>
        ${html}
    </div>
    `);
    setTitle(title);
};

/*
 *  Create a modal and include `html` in it
 */
export const fillModal = (navigateTo, html, small) => {
    document.querySelector("#modal").innerHTML = `
            <div class="modal-background">
                <div class="modal-foreground ${small ? "small-modal" : ""}">
                    <div class="modal-top-bar">
                        <hr>
                        <span id="modal-close" class="close">&times;</span>
                    </div>
                    <div id="modal-insert">${html}</div>
                </div>
            </div>
        `;
    document
        .querySelector("#modal-close")
        .addEventListener("click", () => navigateTo("/"));
};

/*
 *  Get rid of the modal
 */
export const clearModal = () => {
    document.querySelector("#modal").innerHTML = "";
};

/*
 *  Hid loading animation and show transactions
 */
export const displayLoadingComplete = () => {
    document.querySelectorAll(".loading-ring").forEach((element) => {
        element.classList.add("hidden");
    });
    document.getElementById("transactions").classList.remove("hidden");
    document.getElementById("bottom-hr").classList.remove("hidden");
};

/*
 *  Set a timer for when the current session expires, and logout then
 */
export function logoutOnSessionExpiration(logout) {
    const cookieExpiration = getCookie("authTokenExpiry");
    const expirationTime = new Date(cookieExpiration * 1000);
    const currentTime = new Date().getTime();
    const timeLeft = expirationTime - currentTime;
    setTimeout(logout, timeLeft);
}

/*
 *  If value is truthy return an HTML check mark, otherwise return an HTML X
 */
export const toCheckbox = (value) => {
    if (value) {
        return `<span class="icon" title="Yes" aria-label="Yes">&#x2714;</span>`;
    }
    return `<span class="icon" title="No" aria-label="No">&#x2716;</span>`;
};

/*
 *  Take cents based number `amount` and return a currency style string, including
 *   currency `currency` at the end.
 */
export const formatCurrency = (amount, currency) => {
    return (
        (amount / 100).toLocaleString(undefined, {
            minimumFractionDigits: 2,
        }) +
        " " +
        currency
    );
};
