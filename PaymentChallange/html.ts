export const html = `<!DOCTYPE html>






<html lang="en">
<head>
<title>3D-Secure Client Authentication</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<style type="text/css">
    
body { text-align: center; background-color: white; }

h1.intro { color: blue; }

    .menutables { width: 30%; font-size: 15pt; font-family: 'Arial'; letter-spacing: 1px; 
                  border-bottom:10px; border-collapse: separate; border-spacing: 5pt; border: 1px solid black;
                  padding: 10px; padding-left: 20pt; padding-top: 8pt; padding-bottom: 2pt; 
                  text-align: left;  
    }
    .menutables p { border: 1px solid black; } 
    .menutables div { padding: 1px 1px 1px 1px; text-align: justify; padding-left: 5px; padding-right: 5px; font-size: 10pt; display: 'block'; }
    .menutables input { padding-top: 20px; width: 100%; size: 300px; font-size: 15pt; text-align: center; } 
    .menutables tr { border: 0px solid black;  } 
    .menutables td { border: 0px solid black; padding-top: 12px; } 
    .menutables a { text-decoration: none; font-size: 10pt; color: lightslategrey; }
    
    .submit { color: white; background-color: green; text-align: center; } 
    .resend { color: white; background-color: lightgrey; text-align: center; } 
    .center { text-align: center; } 
    .help { font-size: 10pt; color: lightslategrey; } 
    .left { text-align: left; } 
    .right { text-align: right; } 

</style>

<script src="/EMVTDS/jsp/CardHolder/sweetalert2.all.min.js"></script>

<script language="JavaScript">

function checkData(tid)
{ switch(tid) 
  { case "submit_accept":
         document.forms[0].AcceptCancel.value = "Accept";
         if (checkblanks(document.getElementById("password"),"value or select cancel")==false) return false;
         if(document.forms[0].password.value=="") return false;;
         break;
         
    case "submit_resend":
         document.forms[0].AcceptCancel.value = "Resend";
         break;
         
    case "submit_cancel":
         document.forms[0].AcceptCancel.value = "Cancel";
         //document.getElementById("AcceptCancel").value = "Cancel";
         break;     
  }
  
  document.forms[0].submit();
}

function checkblanks(obj,string)
{ if (obj==null) { alert("Undefined "+string+"."); return false; }
  if (obj.value=="") { alert("Please enter "+string+"."); return false; }
  
  return true;
}

function displayhelp() 
{ var x = document.getElementById("helpDIV");
  if (x.style.display === "none") { x.style.display = "block"; } else { x.style.display = "none"; }
}

function openAlert() 
{ //swal('A text message has been sent with a code to your registered mobile number ending 555.' );
    
  swal({
  position: 'center-start',    
  title: 'Code Resend!',
  text: 'A text message has been sent with a code to your registered mobile number ending 555.',
  imageWidth: 200,
  imageHeight: 100,
  confirmButtonColor: '#009933',
  animation: false
  })  

    
}

window.addEventListener("message", function(event) { if(event.data === "openAlert") { openAlert(); } } );
    
function foo()
{ parent.postMessage("openAlert", "*"); return false; }    

</script>
</head>

<BODY>
    
<table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">    
    <tr> 
      <td style="width: 30%;" ></td>
      <td style="width: 30%;" >
          
<form action="https://www.threedsecurempi.com/EMVTDS/AUT?Action=ChallengeReply" method="POST">    
<table width="100%" border="0" cellspacing="0" cellpadding="0" class="menutables">
    
    <tr> 
      <td class="help left"></td>
      <td class="help right"><a href="javascript:checkData('submit_cancel')">Cancel</a></td>
    </tr>    
    
    <tr> 
      <td align="left"><img src="/EMVTDS/jsp/ACS/images/Poseidon.png" width="214" height="61" alt="Bank Logo"></td>
      <td align="right"><img src="/EMVTDS/jsp/ACS/images/schemes/vbv248x140.jpg" width="111" height="62" alt="Card Type"></td>
    </tr>
    
    <tr><td colspan="2" class="center"><b>Verify your Payment</b></td></tr>
    <tr><td colspan="2">We have sent you a text message with a code to your registered mobile number.</td></tr>
    <tr><td colspan="2">Sent to number ending in 555</td></tr>

    <tr><td colspan="2"><input type="password" id="password" name="password" placeholder="Enter Code here"></td></tr>

    <tr><td colspan="2"><input class="submit" type="submit" name="SUBMIT" onClick="return checkData(id);" id="submit_accept" value="SUBMIT"></td></tr>
    <tr><td colspan="2" class="showcase sweet"><input class="resend" type="submit" name="RESEND" onClick="return foo();" id="submit_resend" value="RESEND"></td></tr>
    
    <tr> 
      <td class="help left"><a href="javascript:displayhelp()">Need some help ?</a></td>
      <td class="help right"><a href="javascript:displayhelp()"><b>? </b></a></td>
    </tr>
    
    <tr><td colspan="2"><div style="display: none;" id="helpDIV">You are being requested to authenticate yourself as the card holder. If you have further questions please contact the bank's support desk at: 1-888-5555-4444 and select option 5.</div></td></tr>
    
    <tr align="center" valign="bottom"> 
      <td colspan="2" height="20"><font face="Arial, Helvetica, sans-serif" size="1" color="#666666">&copy;2003-2021 3DSecureMPI/Endeavour. All rights reserved.</font></td>
    </tr>
   
</table>

<input type="hidden" name="acsTransID" value="d334e11b-7a5a-4d1d-8011-3d1fddc029ae">
<input type="hidden" name="threeDSSessionData" value="NUNDNjJFMjRFQkQ1OUM2OTQyNjIxOTA0MDRGN0YxM0Iud29ya2VyODc">
<input type="hidden" id="AcceptCancel" name="AcceptCancel" value="Cancel">

</form>
      </td>
      <td style="width: 30%;" ></td>
    </tr>    
</table>
</body>
</html>
`;