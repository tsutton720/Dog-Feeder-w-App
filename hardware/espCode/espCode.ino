#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266mDNS.h>
#include <Arduino_JSON.h>
#include <Servo.h>
#include <ds3231.h>
#include <Wire.h>

#ifndef STASSID
//#define STASSID "WIFINETWORK"
//#define STAPSK  "WIFIPASSWORD"
#endif

Servo servo;
struct ts t;
JSONVar myObject; 

const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer server(80);


String httpGETRequest(const char* serverName) {
  HTTPClient http;
    
  // Your IP address with path or Domain name with URL path 
  http.begin(serverName);
  
  // Send HTTP POST request
  int httpResponseCode = http.GET();
  
  String payload = "{}"; 
  
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;
}


void moveServo(){
  servo.write(140);
  delay(2000);
  servo.write(180);
  delay(1000);
}

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);
}

void setup(void) {
  Serial.begin(115200);

  servo.write(180);
  servo.attach(D7);

  Wire.begin();
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }

  server.on("/", [](){
    server.send(200, "text/plain", "home page");
    
    //when ever this endpoint is hit, send a get to backend server and update times list
    String timeData = httpGETRequest("http://192.168.0.14:5000/api/times");
    myObject = JSON.parse(timeData);
    Serial.println(myObject);
   
  });
  

  server.on("/servo", []() {
    server.send(200, "text/plain", "moving servo");
    Serial.println("Servo route hit");
    moveServo();
  });



  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");


  String timeData = httpGETRequest("http://192.168.0.14:5000/api/times");
  myObject = JSON.parse(timeData);
}

void loop(void) {
  server.handleClient();
  MDNS.update();

  DS3231_get(&t);
//
//  Serial.print(t.hour);
//  Serial.print(" ");
//  Serial.println(t.min);

  for(int i = 0; i < myObject.length(); i++){

     
     JSONVar keys = myObject[i].keys();
   
     JSONVar hourData = myObject[i][keys[1]];
     JSONVar minuteData = myObject[i][keys[2]];
     
//     Serial.print(hour);
//     Serial.print(" ");
//     Serial.println(minute);

     int hour = int(hourData);
     int minute = int(minuteData);

    if(hour == t.hour && minute == t.min && t.sec == 0){
      Serial.println("It works");
      moveServo();
      delay(1000);
      
      
    }

    
     
  }

  
}
