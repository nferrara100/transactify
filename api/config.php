<?php

$GLOBALS['config'] = array(
    'partnerName' => getenv('partnerName'),
    'partnerPassword' => getenv('partnerPassword'),
    'auth_cookie' => array(
        'expiry' => 86400 * 30
    ),
);
