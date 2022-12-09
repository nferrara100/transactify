<?php
require_once 'config.php';
require_once 'ProxyEndpoint.php';

class LoginEndpoint extends ProxyEndpoint
{
    protected function post()
    {
        $requiredParameters = array(
            'username',
            'password',
        );
        $this->requirePOSTParameters($requiredParameters);

        $onwardParameters = array(
            "command" => "Authenticate",
            "partnerName" => $GLOBALS['config']['partnerName'],
            "partnerPassword" => $GLOBALS['config']['partnerPassword'],
            "partnerUserID" => filter_input(INPUT_POST, 'username', FILTER_SANITIZE_EMAIL),
            "partnerUserSecret" => $_POST["password"],
        );
        $json_response = $this->fetch("POST", $onwardParameters);

        // Return the same error regardless of why the login failed for security reasons
        // https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
        if ($json_response["jsonCode"] === 401 || $json_response["jsonCode"] === 404) {
            http_response_code(401);
            echo json_encode(
                array(
                    "error" => "Login failed",
                    "message" => "The provided username and password combination was not recognized."
                )
            );
            exit();
        }

        http_response_code(200);
    }
}

$endpoint = new LoginEndpoint();
$endpoint->handle();
