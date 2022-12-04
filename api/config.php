<?php

$GLOBALS['config'] = array(
    'password_algorithm' => PASSWORD_DEFAULT,
    'user' => array(
        'email' => getenv('exampleUserEmail'),
        'password_hash' => getenv('exampleUserPasswordHash'),
    ),
    'auth_cookie' => array(
        'name' => 'authToken',
        'expiry' => 86400 * 30
    ),
);
