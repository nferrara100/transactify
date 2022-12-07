<?php
require_once 'config.php';

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle the request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_COOKIE["authToken"])) {
        // Check if username and password match the username and password in .env
        $endpoint = "https://www.expensify.com/api";
        $parameters = array(
            "command" => "Get",
            "authToken" => $_COOKIE["authToken"],
            "returnValueList" => "transactionList",
        );
        $options = array(
            'http' => array(
                'method' => 'GET',
            )
        );
        $context = stream_context_create($options);
        $url = $endpoint . "?" . http_build_query($parameters);
        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            http_response_code(500);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "An error occurred."
                )
            );
            exit();
        }

        // Decode the response
        $json_response = json_decode($response, true);

        if ($json_response["jsonCode"] === 407) {
            http_response_code(401);
            echo json_encode(
                array(
                    "error" => "Auth token not valid",
                    "message" => "Please log in again."
                )
            );
            exit();
        }

        // if $response is not a 200 status code then return an error
        if ($json_response["jsonCode"] !== 200) {
            http_response_code(500);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "An error occurred.",
                    "error_code" => $json_response["jsonCode"]
                )
            );
            exit();
        }

        // if $response is a 200 status code then return the authToken
        if ($json_response["jsonCode"] === 200) {
            http_response_code(200);
            echo json_encode(
                array(
                    "transactions" => $json_response["transactionList"]
                )
            );
            exit();
        }
    } else {
        http_response_code(403);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_COOKIE["authToken"])) {
        // Check if username and password match the username and password in .env
        $endpoint = "https://www.expensify.com/api";
        $parameters = array(
            "command" => "CreateTransaction",
            "authToken" => $_COOKIE["authToken"],
            "created" => $_POST["created"],
            "amount" => $_POST["amount"],
            "merchant" => $_POST["merchant"],
        );
        $options = array(
            'http' => array(
                'method' => 'POST',
            )
        );
        $context = stream_context_create($options);
        $url = $endpoint . "?" . http_build_query($parameters);
        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            http_response_code(500);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "An error occurred."
                )
            );
            exit();
        }

        // Decode the response
        $json_response = json_decode($response, true);

        if ($json_response["jsonCode"] === 407) {
            http_response_code(401);
            echo json_encode(
                array(
                    "error" => "Auth token not valid",
                    "message" => "Please log in again."
                )
            );
            exit();
        }

        // if $response is not a 200 status code then return an error
        if ($json_response["jsonCode"] !== 200) {
            http_response_code(500);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "An error occurred.",
                    "error_code" => $json_response["jsonCode"]
                )
            );
            exit();
        }

        // if $response is a 200 status code then return the authToken
        if ($json_response["jsonCode"] === 200) {
            http_response_code(200);
            echo json_encode(
                array(
                    "transactions" => $json_response["transactionList"]
                )
            );
            exit();
        }
    } else {
        http_response_code(403);
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // If the request is an options request return a status 200
    http_response_code(200);
} else {
    // If the request is not a post request return a status 405
    http_response_code(405);
}
?>
