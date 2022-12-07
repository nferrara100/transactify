<?php

require_once 'config.php';
require_once 'Endpoint.php';

class ProxyEndpoint extends Endpoint
{
    protected $endpoint = "https://www.expensify.com/api";

    protected function fetch($method, $parameters)
    {
        $options = array(
            'http' => array(
                'method' => $method,
            )
        );
        $context = stream_context_create($options);
        $url = $this->endpoint . "?" . http_build_query($parameters);
        $response = file_get_contents($url, false, $context);

        // If file_get_contents failed return an error
        if ($response === false) {
            http_response_code(500);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "An error occurred while connecting to a required API."
                )
            );
            exit();
        }

        // Decode the response
        $json_response = json_decode($response, true);
        $statusCode = filter_var($json_response["jsonCode"], FILTER_VALIDATE_INT);

        // If the status code is not where we expect return an error as the API changed
        if (!$statusCode) {
            http_response_code(502);
            echo json_encode(
                array(
                    "error" => "Bad Gateway",
                    "message" => "A required API on another server returned an invalid status code."
                )
            );
            exit();
        }

        // This happens when Cloudflare blocks the request
        if ($statusCode === 403) {
            http_response_code(502);
            echo json_encode(
                array(
                    "error" => "Bad Gateway",
                    "message" => "The server was forbidden from accessing a required API on another server, most likely because that server is mistakenly blocking traffic from this server."
                )
            );
            exit();
        }

        // Catch all other unexpected responses
        if ($statusCode !== 200) {
            http_response_code(500);
            echo json_encode(
                array(
                    "error" => "Internal Server Error",
                    "message" => "A required API on another server returned an unexpected status code.",
                    "api_status_code" => $statusCode
                )
            );
            exit();
        }

        return $json_response;
    }

}
