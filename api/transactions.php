<?php
require_once 'config.php';
require_once 'ProxyEndpoint.php';

class TransactionsEndpoint extends ProxyEndpoint
{
    protected function get()
    {
        $this->requireAuthentication();

        $onwardParameters = array(
            "command" => "Get",
            "authToken" => $_COOKIE["authToken"],
            "returnValueList" => "transactionList",
        );
        if ($GLOBALS['config']['localTest']) {
            $response = file_get_contents("../fixtures/get_success.json");
            $json_response = json_decode($response, true);
        } else {
            $json_response = $this->fetch("GET", $onwardParameters);
        }

        echo json_encode(
            array(
                "transactions" => $json_response["transactionList"]
            )
        );
        http_response_code(200);
    }

    protected function post()
    {
        $this->requireAuthentication();

        $requiredParameters = array(
            'created',
            'amount',
            'merchant',
        );
        $this->requirePOSTParameters($requiredParameters);

        $onwardParameters = array(
            "command" => "CreateTransaction",
            "authToken" => $_COOKIE["authToken"],
            "created" => $_POST["created"],
            "amount" => $_POST["amount"],
            "merchant" => $_POST["merchant"],
        );
        if ($GLOBALS['config']['localTest']) {
            $response = file_get_contents("../fixtures/create_transaction_success.json");
            $json_response = json_decode($response, true);
        } else {
            $json_response = $this->fetch("POST", $onwardParameters);
        }

        echo json_encode(
            array(
                "transactions" => $json_response["transactionList"]
            )
        );
        http_response_code(200);
    }
}

$endpoint = new TransactionsEndpoint();
$endpoint->handle();
