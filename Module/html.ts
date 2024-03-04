export const html = `<!DOCTYPE html>
<html>
    <head>
        <title>ACS Authentication Page</title>
        <script src="https://eu1.threedsecurempi.com/EMVTDS/jsp/resources/PostForm.js"></script>
        <meta charset="utf-8" />
    </head>

    <body>
        <form name="Payer" id="Payer" action="[acsurl]" method="POST">
            <input type="hidden" name="creq" value="[creqjson]" />
            <input
                type="hidden"
                name="threeDSSessionData"
                value="" />

            <script language="JavaScript">
                document.forms[0].submit();
            </script>
        </form>
    </body>
</html>
`;
