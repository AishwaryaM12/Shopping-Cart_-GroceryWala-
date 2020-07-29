function validate() {
  var x = document.forms["myform"]["Firstname"].value;
  var y = document.forms["myform"]["Lastname"].value;
  var email = document.forms["myform"]["email"].value; 
  var pass = document.forms["myform"]["Password"].value;
  var pass1 = document.forms["myform"]["Password1"].value;
  var Mn = document.forms["myform"]["mbno"].value;
  validname(x,y);
  ValidateEmail(email);
  validatenumber(Mn);
  validatepass(pass,pass1);
}
function validname(x,y){
	if (x == "" || y=="") {
    alert("Name must be filled out");
    return false;
  }
}

function validatenumber(Mn){
	if(Mn!==[0-9] && Mn.length<=10){
    alert("number is not correct");
    return false;
	}
}
function validatepass(pass,pass1){
	var passw=  /^[A-Za-z]\w{7,14}$/;
if(pass.match(passw)|| pass1.match(passw)) 
{ 
return true;
}
else if(pass!==pass1){
	alert("entered password is not same");
	return false;
}
else
{ 
alert('incorrect password');
return false;
}
}
function ValidateEmail(email)
{
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
if(email.match(mailformat))
{
return true;
}
else
{
alert("You have entered an invalid email address!");
return false;
}
}