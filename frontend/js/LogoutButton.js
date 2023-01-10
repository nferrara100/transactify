export class LogoutButton {
    getHtml() {
        return `
            <a id="logout-button" class="button" ajax-link href="/logout">Logout</a>`;
    }
}
