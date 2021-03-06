# Search with Results List and Detail

This is an example of how to wire the attribute search form to a results list, and the results list to a entity detail viewer. You submit the search, it sends it to the api server, returns the results, then those results are fed in to the result list component. 

When the user clicks on a individual result in the list the `resultClick` event is emitted, in the handler for this event the code grabs the `entityId` property from the json and sets the `entity-id` attribute on the detail viewer tag.

![screen shot of Search By Attribute example](../../../images/ss-search-by-attributes.png)
<br/><br/><br/><br/>

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>@senzing/sdk-components-web (Search by Attribute with Details)</title>
  <base href="/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <script>
    // wire up senzing web components to event handlers
    window.onload = function() {
      var searchBoxEle    = document.querySelector('sz-wc-search');
      var searchResEle    = document.querySelector('sz-wc-search-results');
      var entityDetailEle = document.querySelector('sz-wc-entity-detail');
      var noResultsEle    = document.querySelector('#no-results');
      var prefsIntf       = document.querySelector('#prefs-intf');
      var localStoreKey   = 'senzing-web-app';

      document.getElementById('api-config').addEventListener('parametersChanged', function(event){
        console.log('a value in the config tag has emitted a change: ', event);
        searchBoxEle.updateAttributeTypes();
      });


      searchBoxEle.addEventListener('searchException', function(evt) {
        console.log('search error', evt);
        searchBoxEle.updateAttributeTypes();
      });


      searchBoxEle.addEventListener('resultsChange', function(evt) {
        if(evt.detail){
          // has payload
          var searchResults = evt.detail;
          console.log('results from search: ',searchResults);
          if(searchResults.length <= 0){
            noResultsEle.removeAttribute('class');
            searchResEle.setAttribute('class','hidden');
            entityDetailEle.setAttribute('class','hidden');
          } else {
            noResultsEle.setAttribute('class','hidden');
            searchResEle.removeAttribute('class');
            entityDetailEle.setAttribute('class','hidden');
          }
          searchResEle.setAttribute('results', JSON.stringify(searchResults));
        }
      });
      searchResEle.addEventListener('resultClick', function(evt){
        if(evt.detail && evt.detail.entityId){
          //has payload
          showDetailView(evt.detail.entityId);
        }
      });
      function showDetailView(entityId) {
        entityDetailEle.setAttribute('entity-id', entityId);
        searchResEle.setAttribute('class','hidden');
        entityDetailEle.removeAttribute('class');
      }
      function onError(err){
        console.log('something weird happened: ', err);
      }
      function setPref(prefName, prefVal){
        console.log('setPref: '+ prefName +' = "'+ prefVal +'"', prefsIntf);
      }

      // ------------------- event/prefs bus --------------

      // initialize prefs from local storage value
      prefsIntf.prefsFromJSONString = localStorage.getItem(localStoreKey);
      // listen for prefs changes
      prefsIntf.addEventListener('prefsChange', function(payload) {
        localStorage.setItem(localStoreKey, JSON.stringify( payload.detail ));
        //console.info('updated local storage: ', localStorage.getItem(localStoreKey));
      });
      // toggle prefs interface when button is clicked
      document.getElementById('btn-toggle-prefs').addEventListener('click', function(event){
        prefsIntf.showControls = !prefsIntf.showControls;
      });

      // ------------------- spinner related ----
      var spinner = document.getElementById('spinner');
      function showSpinner(){
        spinner.style.display = 'block';
      }
      function hideSpinner(){
        spinner.style.display = 'none';
      }
      searchBoxEle.addEventListener('searchStart', function(event){
        console.time('search');
        showSpinner();
      })
      searchBoxEle.addEventListener('searchEnd', function(event){
        hideSpinner();
        console.timeEnd('search');
      })
      entityDetailEle.addEventListener('requestStart', function(event){
        console.time('entityInit');
        showSpinner();
      });
      entityDetailEle.addEventListener('dataChanged', function(event){
        hideSpinner();
        console.timeEnd('entityInit');
      });
    };
  </script>
  <link rel="stylesheet" href="/node_modules/\@senzing/sdk-components-web/senzing-components-web.css">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: rgb(46, 46, 46);
    }
    .no-results, .hidden {
      display: none !important;
    }
    .loader,
    .loader:after {
      border-radius: 50%;
      width: 10em;
      height: 10em;
    }
    .loader {
      margin: 60px auto;
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border-top: 1.1em solid rgba(60,60,60, 0.2);
      border-right: 1.1em solid rgba(60,60,60, 0.2);
      border-bottom: 1.1em solid rgba(60,60,60, 0.2);
      border-left: 1.1em solid #3c3c3c;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation: load8 1.1s infinite linear;
      animation: load8 1.1s infinite linear;
    }
    @-webkit-keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes load8 {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }

  </style>
</head>
<body>
  <sz-wc-configuration id="api-config"></sz-wc-configuration>
  <div class="prefs-control-gui">
    <button id="btn-toggle-prefs"> show/hide preferences </button>
  </div>
  <sz-wc-preferences id="prefs-intf"></sz-wc-preferences>
  <hr/>
  <sz-wc-search></sz-wc-search>
  <h2 id="no-results">No Results Found</h2>
  <div id="spinner" class="loader">Loading...</div>

  <sz-wc-search-results class="hidden"></sz-wc-search-results>
  <sz-wc-entity-detail
    entity-id="1002"
  ></sz-wc-entity-detail>
  <script src="/node_modules/\@senzing/sdk-components-web/senzing-components-web.js" defer></script>
</body>
</html>

```