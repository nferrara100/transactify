export function addTransactionDetailsClick(transactions) {
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            const addedNodes = mutation.addedNodes;
            addedNodes.forEach(function (node) {
                // If the node is an element (and not text or something else)
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.addEventListener("click", function (event) {
                        const transactionID = event.currentTarget.getAttribute("key");
                        const transaction = transactions.getTransaction(transactionID);
                        const details = document.createElement("div");
                        details.classList.add("transaction-details");
                        details.innerHTML = getDetails(transaction);
                        event.currentTarget.parentNode.insertBefore(
                            details,
                            event.currentTarget.nextSibling,
                        );
                    });
                }
            });
        });
    });

    const tableBody = document.querySelector("#transactionTableBody");
    observer.observe(tableBody, {
        childList: true,
    });
}

function getDetails(transaction) {
    return `
        <tr>
            <td>Amount</td>
            <td>${transaction.amount}</td>
        </tr>
        <tr>
            <td>Bank</td>
            <td>${transaction.bank}</td>
        </tr>
        <tr>
            <td>Billable</td>
            <td>${transaction.billable}</td>
        </tr>
        <tr>
            <td>CardID</td>
            <td>${transaction.cardID}</td>
        </tr>
        <tr>
            <td>CardName</td>
            <td>${transaction.cardName}</td>
        </tr>
        <tr>
            <td>CardNumber</td>
            <td>${transaction.cardNumber}</td>
        </tr>
        <tr>
            <td>Category</td>
            <td>${transaction.category}</td>
        </tr>
        <tr>
            <td>Comment</td>
            <td>${transaction.comment}</td>
        </tr>
        <tr>
            <td>ConvertedAmount</td>
            <td>${transaction.convertedAmount}</td>
        </tr>
        <tr>
            <td>Created</td>
            <td>${transaction.created}</td>
        </tr>
        <tr>
            <td>CurrencyConversionRate</td>
            <td>${transaction.currencyConversionRate}</td>
        </tr>
        <tr>
            <td>Details</td>
            <td>${transaction.details}</td>
        </tr>
        <tr>
            <td>ManagedCard</td>
            <td>${transaction.managedCard}</td>
        </tr>
        <tr>
            <td>Mcc</td>
            <td>${transaction.mcc}</td>
        </tr>
        <tr>
            <td>Merchant</td>
            <td>${transaction.merchant}</td>
        </tr>
        <tr>
            <td>ReceiptID</td>
            <td>${transaction.receiptID}</td>
        </tr>
        <tr>
            <td>ReceiptObject</td>
            <td>${transaction.receiptObject}</td>
        </tr>
        <tr>
            <td>ReceiptState</td>
            <td>${transaction.receiptState}</td>
        </tr>
        <tr>
            <td>Reimbursable</td>
            <td>${transaction.reimbursable}</td>
        </tr>
        <tr>
            <td>Tag</td>
            <td>${transaction.tag}</td>
        </tr>
        <tr>
            <td>${transaction.transactionID}</td>
        </tr>
        <tr>
            <td>Unverified</td>
            <td>${transaction.unverified}</td>
        </tr>
    `;
}
