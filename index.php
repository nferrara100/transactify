<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8" />
        <title>Expensify Take-Home Challenge</title>
        <link rel="stylesheet" type="text/css" href="/frontend/styles.css" />
        <link rel="icon" href="/frontend/icon.svg" type="image/svg+xml" />
    </head>

    <body>
        <div id="page"></div>
        <div id="modal" class="modal-background">
            <div class="modal-foreground">
                <hr>
                <span class="close">&times;</span>
                <div id="modal-insert"></div>
            </div>
        </div>
        <script>
            window.statusCode = <?php echo json_encode($_SERVER['REDIRECT_STATUS'] ?? null); ?>;
        </script>
        <script type="module" src="/frontend/js/index.js"></script>
    </body>

</html>
