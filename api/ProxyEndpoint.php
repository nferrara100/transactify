<?php

require_once 'config.php';
require_once 'Endpoint.php';

class ProxyEndpoint extends Endpoint
{
    protected $endpoint = "https://www.expensify.com/api";

    protected function fetch($method, $parameters)
    {
        $url = $this->endpoint . "?" . http_build_query($parameters);
        $options = array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        );

        $ch = curl_init();
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);

        if ($response === false) {
            http_response_code(502);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "An error occurred while connecting to a required API."
                )
            );
            curl_close($ch);
            exit();
        }

        $httpStatusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // This happens when Cloudflare blocks the request
        if ($httpStatusCode === 403) {
            http_response_code(502);
            echo json_encode(
                array(
                    "error" => "Bad Gateway",
                    "message" => "The server was forbidden from accessing a required API on another server, most likely because that server is mistakenly blocking traffic from this server.",
                    "cloudflare_error" => true
                )
            );
            exit();
        }

        // Catch all other unexpected responses
        if ($httpStatusCode !== 200) {
            http_response_code(502);
            echo json_encode(
                array(
                    "error" => "Bad Gateway",
                    "message" => "An unexpected http error occurred when connecting to a required API.",
                    "status_code" => $httpStatusCode
                )
            );
            exit();
        }

        // Decode the response
        $json_response = json_decode($response, true);

        $jsonCode = filter_var($json_response["jsonCode"], FILTER_VALIDATE_INT);

        // If the status code is not where we expect return an error as the API changed
        if (!$jsonCode) {
            http_response_code(502);
            echo json_encode(
                array(
                    "error" => "Bad Gateway",
                    "message" => "A required API on another server returned an invalid status code."
                )
            );
            exit();
        }

        // Catch all other unexpected responses
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

        // Return the response
        return $json_response;
    }

    protected function updateLogin($authToken)
    {
        $expiry = time() * $GLOBALS['config']['auth_cookie']["expiry"];
        setcookie("authToken", $authToken, $expiry, "/");
    }
}
