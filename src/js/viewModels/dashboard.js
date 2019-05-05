/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtable', 'ojs/ojarraytabledatasource', 'ojs/ojfilepicker'],
 function(oj, ko, $) {
  
    function DashboardViewModel() {
      var self = this;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      //Common request URL
      self.requestURL = "http://10.191.228.169:8080/file/"; 
      
      //Holds list of files obtained from server
      self.array = ko.observableArray([]);
      //To display the results on to the UI
      self.datasource = new oj.ArrayTableDataSource(self.array, {idAttribute: 'index'});
      
      //Ajax call to fetch list of files
      getFiles = function(pSuccessCallback, pFailure){
         var requestPath = self.requestURL + "listFiles";
          
         $.ajax({
        url: requestPath,
        type: "GET",
        dataType: "json",
        success: function(pResult){
            pSuccessCallback(pResult);
         },
         error: function(pError){
             pFailure(pError);
         }
       });
     };
     
     //Success handler used to parse the obtained response and to load the data to UI
     self.successHandler = function(pResponse){
        if(pResponse && pResponse.length > 0){
                    var files = [];
                    for(var i=0; i<pResponse.length;i++){
                        files.push({index:i, path:pResponse[i]});
                    }
                    self.array([]);
                    self.array(files);
    }};
    
    //Used to perform initial load operation.
    self.connected = getFiles(self.successHandler.bind(self), function(pError){console.log(pError)});
       
    //Call to download the file on on-click of the file path link.
    self.onClick = function(pRecord){
        var requestPath = self.requestURL + "download" + "?filePath="+ encodeURI(pRecord.path); 
        window.location.href = requestPath;
    };
    
    //Ajax call to upload the file and to refresh the table on upload success
    self.selectListener = function(event) {
        var files = event.detail.files;
        var documentData = new FormData();
        documentData.append('file', files[0]);
         var requestPath = self.requestURL + "upload"; 
         $.ajax({
            url: requestPath,
            type: "POST",
            enctype: 'multipart/form-data',
            data: documentData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (pResponse) {
                getFiles(self.successHandler.bind(self));
                alert("Document uploaded successfully.");
            },
            error: function(){
                console.log("document failed to upload");
            }
         });
    };
   
  }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
