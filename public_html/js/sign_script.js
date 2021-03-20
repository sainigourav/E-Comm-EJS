
var d_div = document.getElementById("demoId");
var error = document.getElementById("demo");
var pass_div = document.getElementById("passError");
var passRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&]).{8,32}$/;
var submit = document.getElementById("submit");
submit.style.display = "none";
var subprox = document.getElementById("sub-prox");
var divprox = document.getElementById("divprox");
// -----------------function to check all values before adding user into database or file
function Validator() {
    var fname = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    var Cpass = document.getElementById("cpass").value;
    var pic = document.getElementById("picture").value;
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if(email == "" || pass == "" || Cpass == "" || fname == ""  || pic =="")
    {
    d_div.style.display = "block";
    error.innerHTML ="All field are mandatory!! ";
    return false;
    }
    else{
    if (reg.test(email) == false) 
    {
    d_div.style.display = "block";
    error.innerHTML ="Invalid email address!!";
    return false;
    } 
    else{
     if(emailCheck(fname, email, pass, Cpass, pic) === true)
        return true;
    else return false;
    }
    }
    }

// ----------function after checking email then check all other parameter is right or wrong--------
    function check(fname, email, pass, Cpass, pic){
    if (passRegex.test(pass) == false) 
    {
        d_div.style.display = "none";
    pass_div.style.display = "block";
    return false;
    } 
      else  if(pass != Cpass)
    {
        pass_div.style.display = "none";
    d_div.style.display = "block";
    error.innerHTML ="Confirm Password didn't match";
    return false;
    }
    else if(pic == "")
    {
        d_div.style.display = "block";
        error.innerHTML ="Please upload pic!!";
        return false;
    }
    else 
    {
    d_div.style.display = "block";
    d_div.style.color = "#fff";
    d_div.style.paddingLeft = "20px";
    d_div.style.fontWeight = "500";
    d_div.style.backgroundColor = "green";
    d_div.innerHTML = "Click Submit And Login";
    pass_div.style.display = "none";
    console.log(pic);
    pic = extractFilename(pic);
    console.log(pic);
    subprox.style.display = "none";
    divprox.style.display = "none";
    submit.style.display = "block";
    return true;
    }
    }

    // ------------function to check if email already registered
    function emailCheck(fname, email, pass, Cpass, pic)
    {
        var request = new XMLHttpRequest();    
  request.open("GET","/newCustomer.txt");
  request.send();
  request.addEventListener("load", function(event)
  {
    var output = JSON.parse(event.target.responseText);
    if (output !== null) {
    for(var i=0; i< output.length;i++)
        {
           if(output[i].email == email)
           {
            d_div.style.display = "block";
            error.innerHTML ="Email already registered!!";
            return false;
           }
        }
    }
    else
    d_div.style.display = "none";
        check(fname, email, pass, Cpass, pic);
    })
    }

    function extractFilename(file)
    {
        if(file)
        {
            var index = (file.indexOf('\\')>= 0 ? file.lastIndexOf('\\') : file.lastIndexOf('/'));
            var name = file.substring(index);
            if(name.indexOf('\\') === 0 || name.indexOf('/') === 0){
                name = name.substring(1);
            }
        }
        return name;
    }

subprox.addEventListener("click",function()
{
    Validator();
})
    