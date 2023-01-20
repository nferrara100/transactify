<?php
require_once 'config.php';
require_once 'Endpoint.php';

class TransactionsEndpoint extends Endpoint
{
    protected function get()
    {
        requireAuthentication();

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

        check_for_misc_errors($json_response["jsonCode"]);
        $transactionList = sanitizeTransactions($json_response["transactionList"]);

        http_response_code(200);
        echo json_encode(
            array(
                "transactions" => $transactionList
            )
        );
    }

    protected function post()
    {
        requireAuthentication();

        $requiredParameters = array(
            'created',
            'amount',
            'merchant',
        );
        requirePOSTParameters($requiredParameters);

        $onwardParameters = array(
            "command" => "CreateTransaction",
            "authToken" => strip_tags($_COOKIE["authToken"]),
            "created" => strip_tags($_POST["created"]),
            "amount" => strip_tags($_POST["amount"]),
            "merchant" => strip_tags($_POST["merchant"]),
        );
        if ($GLOBALS['config']['localTest']) {
            $response = file_get_contents("../fixtures/create_transaction_success.json");
            $json_response = json_decode($response, true);
        } else {
            $json_response = $this->fetch("POST", $onwardParameters);
        }

        check_for_misc_errors($json_response["jsonCode"]);
        $transactionList = sanitizeTransactions($json_response["transactionList"]);

        http_response_code(201);
        echo json_encode(
            array(
                "transactions" => $transactionList
            )
        );
    }
}

$transactionsEndpoint = new TransactionsEndpoint();
$transactionsEndpoint->handle();
