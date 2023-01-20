<?php

require_once 'config.php';
require_once 'util.php';

session_start();

class Endpoint
{
    protected $proxyEndpoint = "https://www.expensify.com/api";

    public function handle()
    {
        header("Content-Type: application/json; charset=UTF-8");

        // Handle the request
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->get();
        } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            csrfVerification();
            $this->post();
        } else {
            $this->notAllowed();
        }
    }

    protected function get()
    {
        $this->notAllowed();
    }

    protected function post()
    {
        $this->notAllowed();
    }

    protected function notAllowed()
    {
        http_response_code(405);
    }

    protected function fetch($method, $parameters)
    {
        $url = $this->proxyEndpoint . "?" . http_build_query($parameters);
        $options = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_COOKIEFILE => "",
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

        updateLogin(getCurlCookie($ch, "authToken"));
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

        return $json_response;
    }
}
