<?php
session_start();
$_SESSION['csrfToken'] = bin2hex(random_bytes(32));
?>
<!DOCTYPE html>
<html lang="en">

    <head>
        <title>Expensify Take-Home Challenge</title>
        <link rel="icon" href="/frontend/icon.svg" type="image/svg+xml" />
        <link rel="stylesheet" type="text/css" href="/frontend/styles.css" />
        <meta charset="UTF-8" />
        <meta name=" description" content="Nicholas Ferrara's submission for the
        Expensify Take Home Challenge.">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preload" href="/frontend/icon.svg" as="image" type="image/svg+xml" />
        <?php
        require_once 'api/util.php';
        $root = dirname(__FILE__);
        $directory = $root . "/frontend/js";
        preloadDirectory($directory, $root);
        ?>
    </head>

    <body>
        <div id="page"></div>
        <div id="modal"></div>
        <script>
            window.ajaxStatus = <?php echo json_encode($_SERVER['REDIRECT_STATUS'] ?? null); ?>;
            window.csrfToken = "<?php echo $_SESSION['csrfToken']; ?>";
        </script>
        <script type="module" src="/frontend/js/index.js"></script>
    </body>

</html>
