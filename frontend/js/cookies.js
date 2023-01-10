export function cookieExists(cookieName) {
    // return true if cookie exists, false otherwise
    return document.cookie.split(";").some(function (item) {
        return item.trim().indexOf(cookieName + "=") == 0;
    });
}

export function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}
