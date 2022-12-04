<?php
require_once 'config.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if the request is valid
    if (isset($_POST["username"]) && isset($_POST["password"])) {
        // Check if username and password match the username and password in .env
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
        $passwordHash = password_hash($_POST["password"], $GLOBALS['config']['password_algorithm']);
        if ($email == $GLOBALS['config']['user']["email"] && $passwordHash == $GLOBALS['config']['user']["password_hash"]) {
            http_response_code(200);
            // Set logged in cookie
            setcookie($GLOBALS['config']['auth_cookie']["name"], "true", time() + ($GLOBALS['config']['auth_cookie']["expiry"]), "/");
        } else {
            // If the username and password don't match return a status 401
            http_response_code(401);
        }
    } else {
        http_response_code(400);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // If the request is an options request return a status 200
    http_response_code(200);
} else {
    // If the request is not a post request return a status 405
    http_response_code(405);
}
?>
