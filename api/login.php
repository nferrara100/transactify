<?php
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
        if ($_POST["username"] == getenv('exampleUserEmail') && $_POST["password"] == getenv('exampleUserPassword')) {
            http_response_code(200);
            // Set logged in cookie for 30 days
            setcookie("authToken", "true", time() + (86400 * 30), "/");
        } else {
            // If the username and password don't match return a status 401
            http_response_code(401);
        }
    }
    else {
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
