<?php

require_once 'config.php';

class Endpoint
{
    public function handle()
    {
        header("Content-Type: application/json; charset=UTF-8");

        // Handle the request
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $this->get();
        } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->post();
        } else if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            $this->options();
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

    protected function options()
    {
        http_response_code(200);
    }

    protected function notAllowed()
    {
        http_response_code(405);
    }

    protected function requireAuthentication()
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

    protected function requirePOSTParameters($parameters)
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
}
