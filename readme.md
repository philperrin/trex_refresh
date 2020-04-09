# Refresh a data source

API: Extensions API\
Difficulty: ⚫⚫⚪⚪\
Requirements: Text editor, Web hosting or local web server

This mini project will show you how to set up an extension that will let an end user refresh a data source used in a dashboard at the same time. Extensions are a way to embed web applications into Tableau dashboards that allow you to extend the features or Tableau and integrate with other applications.

### Set up your environment
In this mini project, we will be utilizing Glitch as our text editor and hosting service.
1. Create your own copy of the starter project by [remixing it](https://glitch.com/edit/#!/remix/datadev-refresh-data-source). 
2. To keep your project and make all your projects easy to find later click **Sign In** to create an account.
3. Click on the **Show live** link at the top to go to your project page.
4. Copy the URL on that page, it should look something like: `https://three-lamb.glitch.me/`.
5. Close the live preview page and go back to the editor. Click on MyAwesomeExtension.trex to open it. Change `YOUR URL HERE` to the URL you copied in the last step.
6. Download the MyAwesomeExtension.trex file by editing and pasting the below link into your browser window.
`<YOUR URL HERE>/MyAwesomeExtension.trex`. The file should download into your downloads folder.

### Start Desktop in debug mode
###### Windows
1. Exit Tableau if it is already running on your computer.
2. Open a Command Prompt window.
3. Start Tableau using the following command. Replace <version> with the version of Tableau you are using (for example, Tableau 2019.1).
```batch
"C:\Program Files\Tableau\Tableau <version>\bin\tableau.exe" --remote-debugging-port=8696
```

###### Mac
1. Open a Terminal window.
2. Start Tableau using the following command. Replace <version> with the version of Tableau you are using (for example,2019.1.app).
```batch
open /Applications/Tableau\ Desktop\ <version>.app --args --remote-debugging-port=8696
```

### Test your extension
1. Download the sample [Orders data set](https://tableau.github.io/datadev-hackathon/Extensions/Refresh/Orders.xlsx)
and [Refresh.twb](https://tableau.github.io/datadev-hackathon/Extensions/Refresh/Refresh.twb). Open the workbook in the Desktop instance you just opened with the debugger. (File > Open, not just double click)
2. Drag and drop a new **Extension** object (bottom left pane) to the bottom of your dashboard.
3. Allow the extension to run.
4. Confirm that you see "This is an extension!".
5. Go back to Glitch and change "This is an extension!" to a different phrase.
6. Reload your extension and make sure you see your phrase in Tableau.

### Start coding!
1. In Glitch, go to your index.html file and before the `</head>` line, add a line to reference the Tableau Extensions API library:
```html
<script src="https://cdn.jsdelivr.net/gh/tableau/extensions-api/lib/tableau-extensions-1.latest.js"></script>
```
2. Next, go to the script.js file (which is already referenced in index.html) and add the following to initialize your extension:
```javascript
tableau.extensions.initializeAsynch().then(() => {
  console.log('I have been initialized!!')
});
```

### Wait! Let's use the debugger
1. In your browser, go to the [debugging homepage](http://localhost:8696) (`http://localhost:8696`).\
_If you are using Desktop 2018.3 or lower please follow the instructions [here](https://tableau.github.io/extensions-api/docs/trex_debugging.html#download-the-chromium-browser) to download the Chromium browser for debugging._
2. Click on your extension in the browser (should be named "My Awesome Extension").
3. If it's not already selected, click the **Console** tab at the top to open the console.
4. Notice we're getting an error saying `Uncaught TypeError: tableau.extensions.initializeAsynch is not a function at script.js:1`. Looks like there is a typo in our call to initialize. Remove the 'h' from the end of the function call initializeAsynch -> initializeAsync in script.js.
```javascript
tableau.extensions.initializeAsync().then(() => {
  console.log('I have been initialized!!')
});
```
5. Reload the extension in Tableau by clicking the down arrow on the extension zone and selecting **Reload** from the menu.
6. In your browser with the debugger, go to `http://localhost:8696` again and click on **My Awesome Extension**. (Note you must reload the page, hitting back alone will not reset the console)
7. You should now see the message "I have been initialized!!" in the console. Use this console to test and debug your extension as you work.

### Add the refresh button
Our goal in this section will be to refresh a data source when a button is clicked.
1. Before we begin, familiarize yourself with the [Extensions API Reference](https://tableau.github.io/extensions-api/docs/index.html). We will be calling [refreshAsync()](https://tableau.github.io/extensions-api/docs/interfaces/datasource.html#refreshasync) on a data source.
2. In your index.html file between the `<body>` tags, remove "This is an extension!" and add a [button](https://www.w3schools.com/tags/tag_button.asp) with an onClick event like this: `<button type="button" onclick="refresh()">Refresh</button>`. We'll create the `refresh()` function in our script.js file later.
3. RefreshAsync() is a method that runs on a data source but first to get a data source we must get a worksheet. In order to get a worksheet, first, we have to get the dashboard. Add a new custom function after initialization with the following line to grab the dashboard:
```javascript
function refresh() {
    [`let dashboard = tableau.extensions.dashboardContent.dashboard;`](https://tableau.github.io/extensions-api/docs/index.html)
}
```
_Note: this is the function that we linked the button to earlier_
4. Then from there, we can get the desired worksheet by adding the following line next: `let selectedWorksheet = dashboard.worksheets.find(w => w.name === 'Sales');`. Here we're using the [**find()**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) function to choose a specific worksheet. _Note: Try console logging **dashboard** and **worksheet** to see their structure._
5. At this point your script.js file should look something like this:
```javascript
tableau.extensions.initializeAsync().then(() => {
  console.log('I have been initialized!!')
});

function refresh() {
    let dashboard = tableau.extensions.dashboardContent.dashboard;
    let selectedWorksheet = dashboard.worksheets.find(w => w.name === 'Sales');
}
```
6. Next, we need to get the specific data source we want to refresh using [getDataSourcesAsync()](https://tableau.github.io/extensions-api/docs/interfaces/worksheet.html#getdatasourcesasync). GetDataSourcesAsync() is an asynchronous function which means code that is written right after will not wait for the data to return. To make sure we are waiting until the call is finished before moving on, we will be adding the next piece of code inside `.then()`. To get a much better explaination of asynchronous calls and promises check out [one](https://getstream.io/blog/javascript-promises-and-why-async-await-wins-the-battle/), [of](https://eloquentjavascript.net/11_async.html) [these](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then). In the next lines of your function add the following:
```javascript
selectedWorksheet.getDataSourcesAsync().then(dataSources => {
    ...
})
```
7. Inside your `.then()` for getting data sources, using find again, get the right data source: `let selectedDataSource = dataSources.find(ds => ds.name === 'Orders');`
8. Your script.js file should now look like this:
```javascript
tableau.extensions.initializeAsync().then(() => {
  console.log('I have been initialized!!')
});

function refresh() {
    let dashboard = tableau.extensions.dashboardContent.dashboard;
    let selectedWorksheet = dashboard.worksheets.find(w => w.name === 'Sales');
    selectedWorksheet.getDataSourcesAsync().then(dataSources => {
        let selectedDataSource = dataSources.find(ds => ds.name === 'Orders');
    })
}
```
9. Now that we have the right data source we can run refreshAsync() on it! Add the following after you get the data source: `selectedDataSource.refreshAsync()`.
10. Your final script.js file should look like this:
```javascript
tableau.extensions.initializeAsync().then(() => {
  console.log('I have been initialized!!')
});

function refresh() {
  let dashboard = tableau.extensions.dashboardContent.dashboard;
  let selectedWorksheet = dashboard.worksheets.find(w => w.name === 'Sales');
  selectedWorksheet.getDataSourcesAsync().then(dataSources => {
    let selectedDataSource = dataSources.find(ds => ds.name === 'Orders');
    selectedDataSource.refreshAsync();
  })
}
```
11. Test your extension by editing the excel file with a new row of data. Then click on the button to see your dashboard update!

### Challenge exercises
Now that you know the basics of refreshing data sources, try implementing the following bonus challenges.
1. Use one button to refresh all data sources on the dashboard at once
2. Add separate unique buttons to refresh each data source found. (You will need to add another data source)
3. Refresh the data source every 30 seconds, or allow for the user to set an interval.
