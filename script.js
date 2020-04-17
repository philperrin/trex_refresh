tableau.extensions.initializeAsync().then(() => {
    console.log('I have been initialized!!')
});

var values = [];
var list = [];

function refresh() {
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    //            const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    //            let dataSourceFetchPromises = []; 
    //            let dashboardDataSources = {};
    //            var values = [];
    //            var list = [];

    dashboard.worksheets.find(w => w.name === "records").getUnderlyingDataAsync().then(dataTable => {
        let field = dataTable.columns.find(column => column.fieldName === "Order ID");
        let list = [];
        for (let row of dataTable.data) {
            list.push(row[field.index].value);
        }
        let values = list.filter((el, i, arr) => arr.indexOf(el) === i);
        console.log(values.length)
        document.open();
        document.write("Data Last Refreshed:<br>");
        document.write(Date());
        document.write("<br><button onclick='refresh()'>Update Data</button><br><br>");
        document.write("Previous Order Count: ");
        document.write(values.length);

        /*            dashboard.worksheets.forEach(function (worksheet) { 
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
                    
         
        */
        document.close();
    });
}
