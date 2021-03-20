
// ------------function to add name on the page------------
var req = new XMLHttpRequest();
req.open("GET","/profile");
req.send();
req.addEventListener("load",function(event){
  var out = event.target.responseText;
  document.getElementById("name").innerHTML = "Welcome "+ (out).toUpperCase()+" !";
})

var req = new XMLHttpRequest();
req.open("GET","/p_pic");
req.send();
req.addEventListener("load",function(event){
  var out = event.target.responseText;
  console.log(out);
  document.getElementById("p_pic").style.backgroundImage = "url("+out+")";
})

var del_text = document.getElementById("add_delete");
const loader = document.getElementById("loader-container");

	const toggleLoader = (val)=>{
		if(val == true){
			loader.style.display = 'block';
		}else if(val == false){
			loader.style.display = 'none';
		}
	}
	toggleLoader(true);
	window.onload = function(){ toggleLoader(false); }

// --------------------------Remove from Cart-----------------------

this.addEventListener("click",function(event){
  if(event.target.id === "delete")
  {
          toggleLoader(true);
      del_text.style.display = "block";
      var delItem = ((((event.target.parentNode).parentNode).parentNode).parentNode);
      var delItemId = ((((event.target.parentNode).parentNode).parentNode).parentNode.id);
      delItem.remove();
      setTimeout(function(){
        var req = new XMLHttpRequest();
req.open("GET","/userEmail");
req.send();
req.addEventListener("load", function(event)
{
  var out = event.target.responseText;
      var request = new XMLHttpRequest();    
request.open("GET","/del");
request.send();
request.addEventListener("load", function(event)
{
  
  var output = JSON.parse(event.target.responseText);
  output.forEach(function(item){
    if(item.emailId == out  && item.id == delItemId){
      output = output.filter((el) => el !== item);
    }
  })
  var request = new XMLHttpRequest();
  request.open("POST","/del");
  request.setRequestHeader("Content-type","application/json");
  request.send(JSON.stringify(output));
})
  })
      
       del_text.style.display = "none";
      toggleLoader(false);
      },1000)
}
})


// ----------cart quantity inc. and dec.-------------
var tempId = 0;
var count=1;
var tempCount;
this.addEventListener("click",function(event){
    if(event.target.parentNode.id === "pl_mi")
    {
        var id = ((event.target.parentNode).parentNode).parentNode.id;
        var temp = document.getElementById("quantity"+id);
        if("plus"+id == event.target.id)
        {
            if(id != tempId)
            {
                count = 1;
                tempId = id;
            }
            if(tempId == id)
            {
                count +=1 ;
                temp.innerHTML = "Quantity: "+count;
            }
  }
}
})

this.addEventListener("click",function(event){
    if(event.target.parentNode.id === "pl_mi")
   { 
       var id = ((event.target.parentNode).parentNode).parentNode.id;
        var temp = document.getElementById("quantity"+id);
if("minus"+id == event.target.id)
        {
                   if(count <=1)
    {
        event.target.disabled = true;
        count = 2;
    }
    if(count > 1)
    {
        event.target.disabled = false;
        count -=1;
    temp.innerHTML= "Quantity: "+count;
    }
  }

    }
    })

// -----------function for logout the user-------------
    logout.addEventListener("click",function(event){
        var request = new XMLHttpRequest();
        request.open("GET","/logout");
        request.send();
        window.location.replace("/");
      })
