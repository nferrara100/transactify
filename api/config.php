<?php

$GLOBALS['config'] = array(
    'partnerName' => "applicant",
    'partnerPassword' => "d7c3119c6cdab02d68d9",
    'auth_cookie' => array(
        // Actually expires after 2 hours, but shorter here to avoid edge cases
        'expiry' => 6900 // 1 hour 55 minutes
    ),
    'session_duration' => 7200, // 2 hours
);


/**
 *  Handy function to print variables to the console while debugging
 */
function debug($variable)
{
    file_put_contents('php://stderr', print_r($variable, TRUE) . "\n");
}
