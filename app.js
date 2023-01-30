const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { request } = require("http");

const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const { setTimeout } = require("timers/promises");

const{ setInterval } = require('timers/promises')

const apiKeys = require("./apiKeys");



var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));  //**this public will use tht css html csss folder to show on borwser otherwise inly html will be seen without css  */

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signUp.html");
})

app.post("/",function(req,res){
    var firstName = req.body.firstName;
    var lastName =  req.body.lastName;
    var email = req.body.email;

    // console.log(firstName,lastName,email);


/** the contact information on mailchimp server is added by PUT method add or update list member refer below link to understand the refernce/documentation by mailchimp  
 * https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/  */
    
    
    // const  listId = listID;
    const listId = apiKeys.listID;
    const subscriberHash = md5(email.toLowerCase());

    mailchimp.setConfig({
        apikey: apiKeys.ApiKey,
        server: "us21"
    });

    const response = mailchimp.lists.setListMember(listId,subscriberHash,
        {
          email_address: email,
          status : "subscribed",
          merge_fields: {
              FNAME: firstName,
              LNAME: lastName
              }
        }

        
    );

    // console.log(response);   
    // console.log(response.status);  subscribed or unsubscribed
 
    


    // async function run() {
    //     try {
    //       const response = await mailchimp.lists.getListMember(
    //         listId,
    //         subscriberHash
    //       );
      
    //       console.log(`This user's subscription status is ${response.status}.`);

    //         if (response.status === "subscribed") {
    //           res.sendFile(__dirname+"/success.html");
    //         } else {
    //           res.sendFile(__dirname+"/failure.html");
    //         }

    //     } catch (e) {
    //       if (e.status === 404) {
    //         console.error(`This email is not subscribed to this list`, e);
    //       }
    //     }
    // }
    
    
    
    // setTimeout(run , 5000);     

  

    res.sendFile(__dirname+"/success.html");
    // res.end();

})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen( process.env.PORT ||  3000,function(){
   console.log("server is running on port 3000") ;

})




 

 




