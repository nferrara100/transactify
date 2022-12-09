<?php

$GLOBALS['config'] = array(
    'partnerName' => getenv('partnerName'),
    'partnerPassword' => getenv('partnerPassword'),
    'auth_cookie' => array(
        // Actually expires after 2 hours, but shorter here to avoid edge cases
        'expiry' => 60 * 115
    ),
    'localTest' => false,
);
