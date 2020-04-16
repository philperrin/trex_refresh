tableau.extensions.initializeAsync().then(() => { 
  console.log('I have been initialized!!') 
}); 

function refreshAllDataSources() {  
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
} 
