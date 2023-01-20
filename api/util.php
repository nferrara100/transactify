<?php

function csrfVerification()
{
    $csrfError = false;
    if (!isset($_POST["csrfToken"]) || !isset($_SESSION["csrfToken"])) {
        $csrfError = true;

    } else if ($_POST["csrfToken"] !== $_SESSION["csrfToken"]) {
        $csrfError = true;
    }
    if ($csrfError) {
        http_response_code(400);
        echo json_encode(
            array(
                "error" => "CSRF Verification Failed",
                "message" => "The provided CSRF token could not be verified."
            )
        );
        exit();
    }
}

function requireAuthentication()
{
    if (!isset($_COOKIE["authToken"])) {
        http_response_code(401);
        echo json_encode(
            array(
                "error" => "Unauthorized",
                "message" => "You must be logged in to access this resource."
            )
        );
        exit();
    }
}

function requirePOSTParameters($parameters)
{
    foreach ($parameters as $parameter) {
        if (!isset($_POST[$parameter])) {
            http_response_code(400);
            echo json_encode(
                array(
                    "error" => "Bad Request",
                    "message" => "The parameter $parameter is required."
                )
            );
            exit();
        }
    }
}

function check_for_misc_errors($jsonCode)
{
    // Catch all other unexpected responses
    // This is a separate method so that it does not override checks specific for
    // each particular endpoint
    if ($jsonCode !== 200) {
        http_response_code(502);
        echo json_encode(
            array(
                "error" => "Internal Server Error",
                "message" => "A required API on another server returned an unexpected status code.",
                "api_status_code" => $jsonCode
            )
        );
        exit();
    }
}

function getCurlCookie($ch, $cookieName)
{
    // Get the cookie list from the most recent cURL response
    $cookieData = curl_getinfo($ch, CURLINFO_COOKIELIST);

    // Loop through the cookie list to find the cookie with the specified name
    foreach ($cookieData as $cookie) {
        // Split the cookie string into its component parts (name, value, etc.)
        $parts = explode("\t", $cookie);

        // Check if the cookie name matches the specified name
        if ($parts[5] == $cookieName) {
            // Return the value of the cookie
            return $parts[6];
        }
    }

    // If the cookie was not found, return null
    return null;
}

function updateLogin($authToken)
{
    if (!$authToken) {
        return;
    }
    $expiry = time() + $GLOBALS['config']['auth_cookie']["expiry"];
    setcookie("authToken", $authToken, $expiry, "/");
    setcookie("authTokenExpiry", $expiry, $expiry, "/");
}

function sanitizeTransactions($transactionList)
{
    $forwardedFields = array(
        "amount",
        "bank",
        "billable",
        "cardName",
        "category",
        "comment",
        "created",
        "currency",
        "details",
        "managedCard",
        "mcc",
        "merchant",
        "receiptState",
        "reimbursable",
        "tag",
        "transactionID",
        "unverified",
        "convertedAmount",
        "currencyConversionRate"
    );
    foreach ($transactionList as &$transaction) {
        $transaction = array_intersect_key($transaction, array_flip($forwardedFields));
    }
    return $transactionList;
}

function preloadDirectory($dir, $root)
{
    $files = scandir($dir);
    foreach ($files as $file) {
        if (is_dir($dir . '/' . $file)) {
            if ($file != "." && $file != "..") {
                preloadDirectory($dir . '/' . $file, $root);
            }
        } else {
            $path = str_replace($root, '', $dir);
            echo '<link rel="modulepreload" href="' . $path . '/' . $file . '" as="script">' . PHP_EOL;
        }
    }
}
