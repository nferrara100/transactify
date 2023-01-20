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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

export function logoutOnSessionExpiration(logout) {
    const cookieExpiration = getCookie("authTokenExpiry");
    const expirationTime = new Date(cookieExpiration * 1000);
    const currentTime = new Date().getTime();
    const timeLeft = expirationTime - currentTime;
    setTimeout(logout, timeLeft);
}

export const setTitle = (title) => {
    document.title = title + " - Transactify Expense Management";
};

export const fillPage = (html) => {
    document.querySelector("#page").innerHTML = html;
};

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

export const displayLoadingComplete = () => {
    document.querySelectorAll(".loading-ring").forEach((element) => {
        element.classList.add("hidden");
    });
    document.getElementById("transactions").classList.remove("hidden");
    document.getElementById("bottom-hr").classList.remove("hidden");
};
