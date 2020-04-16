tableau.extensions.initializeAsync().then(() => { 
  console.log('I have been initialized!!') 
}); 

function refresh() {
  var date = new Date();
  var dateString = new Date(date.getTime() - date.getTimezoneOffset() *60000 )).toISOString().split("T")[0];
            const dashboard = tableau.extensions.dashboardContent.dashboard; 
            let dataSourceFetchPromises = []; 
            let dashboardDataSources = {};
            dashboard.worksheets.forEach(function (worksheet) { 
                dataSourceFetchPromises.push(worksheet.getDataSourcesAsync()); 
            }); 
            Promise.all(dataSourceFetchPromises).then(function (fetchResults) { 
                fetchResults.forEach(function (dataSourcesForWorksheet) { 
                    dataSourcesForWorksheet.forEach(function (dataSource) { 
                        if (!dashboardDataSources[dataSource.id]) { 
                            dashboardDataSources[dataSource.id] = dataSource; 
                            dataSource.refreshAsync(); 
                        } 
                    }); 
                }); 
            }); 
  document.open();
  document.write("Data Last Refreshed:<br>");
  document.write(dateString);
  document.write("<br><button onclick='refresh()'>Update Data</button>");
  document.close();
} 

