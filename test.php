<html>

<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
        $.ajax({
            type: "POST",
            url: "https://api.particle.io/oauth/token",
            data: {
                username: "test@user.com",
                password: "testpassword",
                expires_in: 0,
                grant_type: "password"
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic" + bota("particle:particle"));
            },
            complete: function (jqXHR, textStatus) {
                console.log("jqXHR", jqXHR);
                console.log("textStatus", textStatus);
            }
        });
    </script>
    <style>
    </style>
</head>

<body>
    HEELO WORLD
</body>

</html>
