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

// acsurl = https://www.threedsecurempi.com/EMVTDS/AUT?Action=ProcessCReq creqjson
// = base64(json) //url safe without padding threeDSSessionData = base64(
// ewogICAiYWNzVHJhbnNJRCI6IjA2MTIwNWE3LTExMjQtNDA5YS1hMjRhLTM4MjUwMGE0YzcxYiIsCiAgICJjaGFsbGVuZ2VXaW5kb3dTaXplIjoiMDUiLAogICAibWVzc2FnZUNhdGVnb3J5IjoiMDEiLAogICAibWVzc2FnZVR5cGUiOiJDUmVxIiwKICAgIm1lc3NhZ2VWZXJzaW9uIjoiMi4xLjAiLAogICAidGhyZWVEU1NlcnZlclRyYW5zSUQiOiJjZTkwOGFmYy1lOTI5LTQ4OTQtYjIwZC1kMzQ3ZDE5YTVkZjEiLAp9
// { "acsTransID":"061205a7-1124-409a-a24a-382500a4c71b",
// "challengeWindowSize":"05", "messageCategory":"01", "messageType":"CReq",
// "messageVersion":"2.1.0",
// "threeDSServerTransID":"ce908afc-e929-4894-b20d-d347d19a5df1", }
