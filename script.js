tableau.extensions.initializeAsync().then(() => { 
  console.log('I have been initialized!!') 
}); 

function refresh() {
            const dashboard = tableau.extensions.dashboardContent.dashboard; 
            let dataSourceFetchPromises = []; 
            let dashboardDataSources = {};
            let Rcount = tableau.DataTable.totalRowCount();
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
  document.write(Date());
  document.write("<br><button onclick='refresh()'>Update Data</button><br><br>");
  document.write("Previous Row Count: ");
  document.write(Rcount);
  document.close();
} 

