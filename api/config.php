<?php

$GLOBALS['config'] = array(
    'partnerName' => "applicant",
    'partnerPassword' => "d7c3119c6cdab02d68d9",
    'auth_cookie' => array(
        // Actually expires after 2 hours, but shorter here to avoid edge cases
        'expiry' => 60 * 115
    ),
    // Change to true to test without the live Expensify API
    'localTest' => false,
);


/**
 *  Handy function to print variables to the console while debugging
 */
function debug($variable)
{
    file_put_contents('php://stderr', print_r($variable, TRUE) . "\n");
}
