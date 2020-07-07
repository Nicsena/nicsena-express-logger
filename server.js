// - NODE STUFF -

process.on('uncaughtException', (error)  => {
    console.log('Node Uncaught Exception: ',  error);
    //process.exit(1); // exit application 
  })
  
  process.on('unhandledRejection', (error, promise) => {
    console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
    console.log(' The error was: ', error );
  });
  
  
  
  //---NODE MOUDLES---
  const express = require('express')
  const bodyParser = require("body-parser"); 
  const fs = require('fs');
  
  // - VARIABLES -
  const app = express()
  const port = 3000 // Changeable Port
  const now = new Date().toLocaleTimeString(); // Time for when node got started. 
  const originalCwd = process.cwd(); // Get the directory that the script is in.
  
  // - Customizable Directories -
  const logs_directory = originalCwd + "Logs/"; // Code/Functon is not finished or not started yet.
  
  // -- LOG MODE VARIABLES --
  const logging = "true" // TRUE, ENABLED, OR 1 - Logging Mode Enabled // FALSE, DISABLED, OR 0 - Logging Mode Disabled
  const showip = "true" // TRUE, ENABLED, OR 1 - IP Addresses are shown in the Logs // FALSE, DISABLED, OR 0 - IP Addresses are not showen in the Logs
  const user_agent_logging = "true" // TRUE, ENABLED, OR 1 - Browser User Agents are shown in the logs // FLASE, DISABLED, OR 0 - Browser User Agents are shown in the logs
  
  
  
  // -- FUNCIONS -- 
  
  function splitStr(str, seperator) { 
        
      // Function to split string 
      var string = str.split(seperator); 
        
      console.log(string); 
  } 
  
  function updateTime() { // Just for updated live time.
    const current_live_time = new Date().toLocaleTimeString();
  
    return current_live_time;
  }
  setInterval(updateTime, 1000);
  
  
  // -- FUNCTIONS VARIABLES --
  
  
  
  
  
  //------------------------------
  
  // - EXPRESS.JS SERVER -
  
  const logger = function (req, res, next) { // Logging

    // -- Browser User Agent Logging --

    function Get_UserAgent() {

    if (user_agent_logging === null || user_agent_logging === undefined || user_agent_logging === "") { 

    Browser_UserAgent = "[USER AGENT ERROR - Logging Mode Variable \"user_agent_logging\" is null or undefined or is blank.]"
    return Browser_UserAgent

    } else {

    if (user_agent_logging.toLowerCase() === "true" || user_agent_logging.toLowerCase() === "enabled" || user_agent_logging === "1") {
    Browser_UserAgent = req.get('User-Agent');

    if (Browser_UserAgent === null || Browser_UserAgent === undefined || Browser_UserAgent === "") {
    Browser_UserAgent = "[USER AGENT ERROR - USER-AGENT IS BLANK OR IS NULL OR IS UNDEFINED]";
    return Browser_UserAgent;
    } else {
    return Browser_UserAgent;    
    };

    } else {

    if (user_agent_logging.toLowerCase() === "false" || user_agent_logging.toLowerCase() === "disabled" || user_agent_logging === "0") {
    Browser_UserAgent = "[USER AGENT HIDDEN]"
    return Browser_UserAgent;
    } else {
    
    Browser_UserAgent = "[USER AGENT HIDDEN]"
    return Browser_UserAgent;
    }

    
}}};



    // -- IP Address Logging --
    
  function Get_IP_Address() {
  
    if (showip === null || showip === undefined || showip === "") {
      const real_ip = "[IP ADDRESS ERROR - Logging Mode Variable \"showip\" is null or is undefined or is blank.]";
      return real_ip;
  
      } else {
  
      if (showip.toLowerCase() === "true" || showip.toLowerCase() === "enabled" || showip === "1") {
      const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];

      function checkIP() {
        if (ip.substr(0, 7) == "::ffff:") {
         const ip_short = ip.substr(7);
         return ip_short;
        }
    };

    const real_ip = checkIP();

        if(real_ip === null || real_ip === undefined || real_ip === "") {
        const real_ip = "[IP ADDRESS ERROR - IP IS BLANK OR IS NULL OR IS UNDEFINED]";
        const real_ip_error = real_ip
        return real_ip_error;
        } else {
        return real_ip;
         }
      } else {
  
      if (showip.toLowerCase === "false" || showip.toLowerCase() === "disabled" || showip === "0") {
      const real_ip = "[IP ADDRESS NOT SHOWN]"
      return real_ip;
  
      } else {
  
      const real_ip = "[IP ADDRESS NOT SHOWN]"
      return real_ip;
  
      };
  }}};
  

    // -- Request Logging --

    if (logging.toLowerCase() === null || logging === undefined || logging === "") { // First check if the logging mode variable is null or undefined. Let the hoster know about this.
      console.log("[EXPRESS LOGGING ERROR] Node Variable \"Logging\" is null or is undefined or is blank. Setting Logging Mode to disabled. ")
      next()
  
    } else {
      
    if (logging.toLowerCase() === "true" || logging.toLowerCase() === "enabled" || logging.toLowerCase() === "1") { //When logging mode is true -- Log.
    console.log(" "); // Space
    console.log('[EXPRESS LOGGING] ' + updateTime() +' - ' +Get_IP_Address() + ' - Protocol: ' +req.protocol +' - Domain URL: ' +req.headers.host +' - URL: ' +req.originalUrl + "");

    if (user_agent_logging === "true" || user_agent_logging === "enabled" || user_agent_logging === "1") {
    console.log(" "); // Space
    console.log("[EXPRESS USER AGENT LOGGING] " + updateTime() + " - "+Get_IP_Address() + " --- " +Get_UserAgent() +" ")
    next();
    
    } else {
    
    next();
    
    };

    } else {
  
    if (logging.toLowerCase() === "false" || logging.toLowerCase() === "disabled" || logging.toLowerCase() === "0") { //When logging mode is false -- Don't log.
    next();
  
    } else { //If the logging mode variable is not null, or undefined, or true, or false. Don't Log.
  
       // console.log("[EXPRESS LOGGING NOTICE] Logging Mode is not \"true\", or \"false\". Disabled Logging.")
        next();
  
       };
  
      };
    };

  };
  



  app.use(logger);
  
  app.set("view engine", "ejs"); 
  
  app.set("views", __dirname + "/htdocs/"); 
  
  app.use(bodyParser.urlencoded({ extended: false })); 
  






  app.get('*', function(req, res, next) { 

        if (req.protocol === "https") {
            res.redirect('http://' +req.headers.host + "/" +req.url +"");
            //next();
       } else {
           //res.redirect('https://' +req.headers.host + "/" +req.url +"");
           next();
       };
    
})

app.get("/", (req, res) => { 

    res.render("index"); 

  }); 


  app.get("/whatismyip", (req, res) => { 
    const real_ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    
    function checkIP() {
      if (real_ip.substr(0, 7) == "::ffff:") {
       const ip_short = real_ip.substr(7);
       return ip_short;
      }
  };

    if (checkIP() === null || checkIP() === undefined || checkIP() === "" ) {
      res.render("ip/index", {realip:"[ERROR] Unable to get your IP Address!"});
    } else {
    res.render("ip/index", {realip:`${checkIP()}`});
    };

  }); 
  
  //Error Pages
  app.get("*", (req, res) => { //This is here just in case.
    res.render("errors/404"); //This page is in htdocs/errors/
  }); 
  
  
  
  // This workaround has been found at https://cmsdk.com/javascript/failed-to-decode-param-in-express.html
  app.use(function(err, req, res, next) { // This helps with Failed to decode problem.
    res.redirect('/404');
    next(err); 
  });
  
  
  
  
  app.listen(port, () => 
  console.log(`[EXPRESS] ` +updateTime() + ` - Server is now listening at http://127.0.0.1:${port}`)
  );