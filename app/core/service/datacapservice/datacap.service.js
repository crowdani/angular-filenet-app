angular.module('core.service.datacap').factory('dataCapService', function ($http,$q) {
   var baseUrl = 'http://5.10.112.142:8070/servicewtm.svc', self = this,
    callback = '?callback=JSON_CALLBACK';
    var dcapAction = {
      //return {
    }
          
        dcapAction.startTransaction = function () {
           
            $http.defaults.headers.common = {"Accept" : "application/json"}
            return $http.get(baseUrl +  "/Transaction/Start");
        };
    
    
        dcapAction.uploadBatchFile = function (transactionID,fileName){
            $http.defaults.headers.post = {"Accept" : "application/json"};
            $http.defaults.headers.post =  {"Access-Control-Request-Headers": "x-requested-with"};
            //Setup batch file
            var formData = new FormData();
            var xml = "<B id=\"Transaction\"><V n=\"TYPE\">Transaction</V><P id=\"TM000001\"><V n=\"TYPE\">Page</V>";
          //  xml +="<V n=\"IMAGEFILE\">tm000001." + fileName.substr(fileName.lastIndexOf('.')+1) +"</V><V n=\"DATAFILE\">tm000001.xml</V><V n=\"STATUS\">0</V></P></B>";
            
              xml +="<V n=\"IMAGEFILE\">tm000001.jpg</V><V n=\"DATAFILE\">tm000001.xml</V><V n=\"STATUS\">0</V></P></B>";
            formData.append("XML",  new Blob([ xml ], { type: "text/xml" }));
            return $http.post(baseUrl +  "/Transaction/SetFile/" + transactionID + "/scan/xml",formData); 
        };
          dcapAction.fetchFile = function (transactionID,fileName){
            //$http.defaults.headers.post = {"Accept" : "application/json"};
            $http.defaults.headers.post =  {"Access-Control-Request-Headers": "x-requested-with"};
            return $http.get(baseUrl +  "/Transaction/GetFile/" + transactionID + "/tm000001/xml"); 
        };
          
        dcapAction.checkDigit = function(value,checkDigit){
           var strg= 'This is my string';
            for(indx in value){
                console.log(value[indx]);
                
            } 
        };
    
       dcapAction.setFieldsConfiguration= function(docType,image){
            var fieldsConfig="";
            if(docType=="Passport"){
                postion = "64," + (img.naturalHeight - 400) + "," + (img.naturalWidth - 64) + "," + img.naturalHeight;
                console.log(postion);
                 fieldsConfig =  "<F id=\"MRZ\"><V n=\"hr_RecogEngine\">OCR/A</V><V n=\"TYPE\">MRZ</V><V n=\"Position\">"+ postion +"</V><V n=\"STATUS\">0</V><V n=\"c_ft\">E13B</V></F>";  
            }else if(docType=="DrivingLicense"){
                console.log(img.naturalHeight );
                //766,330,2186,1598
                    var widthSegMents = img.naturalWidth / 4;
                    postion = (widthSegMents)+ "," + (0) + "," + (widthSegMents *3) + "," + img.naturalHeight;
                    fieldsConfig =  "<F id=\"MRZ\"><V n=\"hr_RecogEngine\">OCR/A</V><V n=\"TYPE\">DRIVINGLICENSE</V><V n=\"Position\">" + postion + "</V><V n=\"STATUS\">0</V><V n=\"c_ft\">E13B</V></F>";  
            }else if(docType=="Cheques"){
                
                    //var micrBox = "10,900,1600,1110"
                
                
                      fieldsConfig =  "<F id=\"MCR\"><V n=\"hr_RecogEngine\">ICR/C</V><V n=\"TYPE\">MCR</V><V n=\"Position\">71,829,1831,954</V><V n=\"STATUS\">0</V><V n=\"c_ft\">E13B</V></F>";  
            }else{
                      fieldsConfig =  "<F id=\"MRZ\"><V n=\"hr_RecogEngine\">OCR/A</V><V n=\"TYPE\">DRIVINGLICENSE</V><V n=\"Position\">64,1205,2564,1526</V><V n=\"STATUS\">0</V><V n=\"c_ft\">E13B</V></F>";  
                     }
            return fieldsConfig;
        };
    
    
        dcapAction.uploadPageDataFile =function (transactionID,fileName,image,docType){
            $http.defaults.headers.post = {"Accept" : "application/json"};
            $http.defaults.headers.post =  {"Access-Control-Request-Headers": "x-requested-with"};
            
            var fieldsConfig = this.setFieldsConfiguration(docType,image);
    
            //Setup batch file
            
            var xml="<?xml-stylesheet type=\"text/xsl\" href=\"..\..\dco.xsl\"?><P id=\"TM000001\"><V n=\"hr_CheckCountry\">UK</V>" +  fieldsConfig + "</P>"
            var formData = new FormData();
            formData.append("XML",  new Blob([ xml ], { type: "text/xml" }));
            //return $http.post(baseUrl +  "/Transaction/SetFile/"+ transactionID + "/"+ fileName.substr(0,fileName.lastIndexOf('.')) + "/xml",formData); 
            return $http.post(baseUrl +  "/Transaction/SetFile/"+ transactionID + "/tm000001/xml",formData); 
        };
          
        dcapAction.convertToText = function(xml){
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml,"text/xml");
            var fieldNames = xmlDoc.getElementsByTagName("F");
            
            for(var y=0;y<fieldNames.length;y++){
                var fieldName = xmlDoc.getElementsByTagName("F")[y];
                var characterVals = fieldName.getElementsByTagName("C")
                var fieldValue = "";
                
                for(var x=0;x<characterVals.length;x++){
                    var characterVal = characterVals[x].innerHTML;
                    fieldValue = fieldValue + String.fromCharCode(characterVal)
                }
            console.log(fieldValue);
            }
            
            return fieldValue;
        };  
          
        dcapAction.base64toBlob = function (base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        },
                                               
        dcapAction.uploadDocument = function(transactionID,image,fileName){
            $http.defaults.headers.post = {"Accept" : "application/json"};
            $http.defaults.headers.post =  {"Access-Control-Request-Headers": "x-requested-with"};
            var formData = new FormData();
            
            var imageBase64= image.replace(/^data:image\/(png|jpeg|tif|tiff);base64,/, "");
            //var testing = file_get_contents(image);
            //console.log("Me testing : " + testing);
            var fullyCoverted = this.base64toBlob(imageBase64)
            
            console.log(fullyCoverted);
            formData.append('file', fullyCoverted);
            
            //return $http.post(baseUrl +  "/Transaction/SetFile/" + transactionID + "/tm000001/"+fileName.substr(fileName.lastIndexOf('.')+1),formData,{  transformRequest: angular.identity,
            return $http.post(baseUrl +  "/Transaction/SetFile/" + transactionID + "/tm000001/jpg",formData,{  transformRequest: angular.identity,
            
            headers: {'Content-Type': undefined}
            }
                             ); 
        };
        dcapAction.executeRules = function(transactionID,rules){
            $http.defaults.headers.post = {"Accept" : "application/json"};
            $http.defaults.headers.post =  {"Access-Control-Request-Headers": "x-requested-with"};
           // $http.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
            $http.defaults.headers.post =  {"content-type": "text/json; charset=utf-8"};
            
            var payload = "<Properties><TransactionId>String content</TransactionId><Application>String content</Application><Workflow>String content</Workflow><PageFile>String content</PageFile><Rulesets>String content</Rulesets><TaskProfile>String content</TaskProfile></Properties>"
            console.log(rules);
            var message = JSON.stringify({
	           "TransactionId": transactionID,
	           "Application": "Transaction",
	           "Workflow": "Transaction",
	           "PageFile":"scan.xml",
	           "Rulesets":rules,
            });
            
            
            var burl = "http://localhost:1337/" + "5.10.112.142:8070/servicewtm.svc"
            return $http.post(burl +  "/Transaction/Execute" ,message); 
            
        };
          
        dcapAction.doPassport = function(results){
            var arr = results.split(/\r\n|\r|\n/g);
            var line1 = arr[0];
            var line2 = arr[1];
            //lets do line 1
            var documentType = line1.substring(0,1);
            var type = line1.substring(1,2);
            var issuingCountry = line1.substring(2,5);
            var namePart = line1.substring(5,line1.length-5)
            line1split = namePart.split("<<")
            var Surname = line1split[0];
            var GivenName = line1split[1].replace("<"," ");

            //lets do line 2
            var passportNumber = line2.substring(0,9);
            var pNumberPassportCheckDigit = line2.substring(9,10);
            var Nationality = line2.substring(10,13);
            var dob = line2.substring(13,19);
           // var dob = new Date(dob);
            var dobCheckDigit = line2.substring(19,20);
            var Sex = line2.substring(20,21);
            var expireDate = line2.substring(21,27);
            var expDateCheckDigit = line2.substring(27,28);
            var PersonalNumber = line2.substring(28,42);
            var checkDigitPersonalNumber =  line2.substring(42,43);
            var checkDigitAll =  line2.substring(43,44);



            message = JSON.stringify({"type" : "Passport","props":{"MRZ" : results,"DocumentType": documentType, "subType": type, "IssuingCountry": issuingCountry, "Surname" : Surname,"GivenName" : GivenName,"PassportNumber" : passportNumber,"pNumberPassportCheckDigit": pNumberPassportCheckDigit,"Nationality": Nationality,"DOB": dob,"dobCheckDigit":dobCheckDigit, "Sex": Sex,"expireDate":expireDate,"expDateCheckDigit": expDateCheckDigit,"PersonalNumber": PersonalNumber,"checkDigitPersonalNumber": checkDigitPersonalNumber,"checkDigitAll": checkDigitAll}});  
            return message;
        };
    
        dcapAction.doDrivingLicense = function(results){
            results = results.match("\\w{16}")[0];
            var day = results.substring(8, 10);
            var decade =  results.substring(5, 6);
            var month = results.substring(6, 8);
            var sexMonth = month.substring(0,1);
            var sex;
            if(sexMonth==0 || sexMonth==1){
                sex = "Male";
            }else{
                sex = "Female";
            }
            var year = results.substring(10, 11);
            var Surname = results.substring(0, 5);
            var dateOfBirth = day + "-" + month + "-" + decade + year;

            message = JSON.stringify({"type" : "DrivingLicense","props":{"Number" : results,"DateOfBirth" : dateOfBirth, "Surname5Characters" : Surname,"Initials":results.substring(11, 13),"CheckDigit" : results.substring(14, 15), "LicenseIssue" : results.substring(15, 17), "Sex" : sex}}); 
            return message;
        }
        
        dcapAction.doCheques = function(results){
            
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(results,"text/xml");
            var fieldNames = xmlDoc.getElementsByTagName("F");
            var message = {"type" : "Cheque", "props":{}}
            //message = JSON.stringify(message);
           console.log(message);
            
            for(var y=0;y<fieldNames.length;y++){
                var fieldName = xmlDoc.getElementsByTagName("F")[y];
                var characterVals = fieldName.getElementsByTagName("C")
                var fieldValue = "";
                 
                
                for(var x=0;x<characterVals.length;x++){
                    var characterVal = characterVals[x].innerHTML;
                    if(characterVal !=32){
                    fieldValue = fieldValue + String.fromCharCode(characterVal)
                    }
           
                }
                
                  if(typeof(fieldValue) != "undefined"){
                    message.props[fieldName.attributes.getNamedItem("id").value] = fieldValue;
                }
            }
            message = JSON.stringify(message);
        return message;
        };
    
        dcapAction.readDocument= function(docType,image, imageFileName,rules,progressbar,contentsOfFile){
            var results;
            var rtnField;
              var message;
            
            var deferObject =  deferObject || $q.defer();
            this.startTransaction().then(function (response) {
                console.log(response);
                progressbar.set(20);    
                var transId = response.data;
                dcapAction.uploadBatchFile(transId,imageFileName).then(function (response) {
                    progressbar.set(40);    
                    dcapAction.uploadPageDataFile(transId,imageFileName,image,docType).then(function(response){
                        console.log(response.data);
                        progressbar.set(50);    
                        dcapAction.uploadDocument(transId,image,imageFileName).then(function(response){
                            console.log(response);
                            progressbar.set(60);    
                            dcapAction.executeRules(transId,rules).then(function(response){
                               console.log(response);
                                progressbar.set(90);    
                                dcapAction.fetchFile(transId,"tm000001.xml").then(function(response){
                                    progressbar.set(100);    
                                    
                                    if(docType=="DrivingLicense"){
                                        results = dcapAction.convertToText(response.data);
                                        
                                       
                                        message = dcapAction.doDrivingLicense(results);
                                      
                                    }
                                    if(docType=="Passport"){
                                        results = dcapAction.convertToText(response.data);
                                       
                                       
                                        message = dcapAction.doPassport(results);
                                        
                                    }  
                                   
                                    if(docType=="Cheques"){
                                        message = dcapAction.doCheques(response.data);
                                        results = message;  
                                        
                                        console.log(message);
                                    }  
                                    
                                    var obj = JSON.parse(message);
                                    contentsOfFile.dcapResults = obj;
                                     deferObject.resolve(results);
                          
                        
                                })
                           })
                        
                        })
                    })
                });
            })
         return deferObject.promise;
        }  
          
      

                                               return dcapAction
});