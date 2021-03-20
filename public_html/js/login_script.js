var d_div = document.getElementById("demoId");
var error = document.getElementById("demo");

// -----------------function to check all values before redirect to main page ----------
function Validator() {
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    if(email == "" || pass == "")
    {
    d_div.style.display = "block";
    error.innerHTML ="All field are mandatory!! ";
    return false;
    }
    else 
    {
        if(exist(email, pass) == true)
            return true;
        else
            return false;
    }
    }

    // ----------function to check email exist or not in database or file --------
    function exist(email, pass)
    {
        var request = new XMLHttpRequest();    
  request.open("GET","/newCustomer.txt");
  request.send();
  request.addEventListener("load", function(event)
  { 
    var output = JSON.parse(event.target.responseText);
    if (output === null) 
    {
        d_div.style.display = "block";
    error.innerHTML ="User doesn't exist Please SignUp!!";
    return false;
    }
    else{
    for(var i=0; i< output.length;i++)
        {
            if(output[i].email !== email && output[i].password !== pass && i == (output.length)-1)
            {
               
                d_div.style.display = "block";
            error.innerHTML ="User doesn't exist Please SignUp!!";
            return false;
            }
           else if(output[i].email == email && output[i].password != pass)
           {
            d_div.style.display = "block";
            error.innerHTML ="Incorrect Password";
            return false;
           }
           else if(output[i].email != email && output[i].password == pass){
            d_div.style.display = "block";
            error.innerHTML ="Incorrect Email address";
            return false;
           }
           else if(output[i].email == email && output[i].password == pass)
           {
            d_div.style.display = "none";
            var request = new XMLHttpRequest()
            var result = {email: email, pass:pass, name: output[i].fullname};
            request.open("POST","/");
            request.setRequestHeader("Content-type","application/json");
            request.send(JSON.stringify(result));
            window.location.replace("/main");
            return true;
           }
        }
    }
    })
    }
