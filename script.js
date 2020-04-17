tableau.extensions.initializeAsync().then(() => {
    console.log('I have been initialized!!');
});

const values = [];
const list = [];
const paragraph = document.getElementById('p');


//part 1: how many orders are in the dataset and report that, use callback to 


function refresh(callback) {
    const dashboard = tableau.extensions.dashboardContent;
    const worksheets = tableau.extensions.dashboardContent.dashboard;
    const dataSourceFetchPromises = [];
    const dashboardDataSources = {};


    tableau.extensions.initializeAsync().then(() => {
        console.log('Re-initialized');
    });
    worksheets.find((w) => w.name === 'records').getUnderlyingDataAsync().then((dataTable) => {
        const field = dataTable.columns.find((column) => column.fieldName === 'Order ID');
        const list = [];
        for (const row of dataTable.data) {
            list.push(row[field.index].value);
        }
        const values = list.filter((el, i, arr) => arr.indexOf(el) === i);
        console.log("old values: ");
        console.log(values.length);

        paragraph.textContent = 'Data Last Refreshed: \r\n';
        paragraph.textContent += Date();
        paragraph.textContent += '\r\n \r\nPrevious Order Count: ';
        paragraph.textContent += values.length;
        callback();



        refresh(function(callback) {

            const dashboard = tableau.extensions.dashboardContent.dashboard;
            let dataSourceFetchPromises = [];
            let dashboardDataSources = {};
            dashboard.worksheets.forEach(function(worksheet) {
                dataSourceFetchPromises.push(worksheet.getDataSourcesAsync());
            });
            Promise.all(dataSourceFetchPromises).then(function(fetchResults) {
                fetchResults.forEach(function(dataSourcesForWorksheet) {
                    dataSourcesForWorksheet.forEach(function(dataSource) {
                        if (!dashboardDataSources[dataSource.id]) {
                            dashboardDataSources[dataSource.id] = dataSource;
                            dataSource.refreshAsync();
                        }
                    });
                });
            });
            callback();

        })




        refresh(function() {
            const dashboard = tableau.extensions.dashboardContent;
            const worksheets = tableau.extensions.dashboardContent.dashboard;
            const dataSourceFetchPromises = [];
            const dashboardDataSources = {};


            tableau.extensions.initializeAsync().then(() => {
                console.log('Re-initialized');
            });
            dashboard.worksheets.find((w) => w.name === 'records').getUnderlyingDataAsync().then((dataTable) => {
                const field = dataTable.columns.find((column) => column.fieldName === 'Order ID');
                const list = [];
                for (const row of dataTable.data) {
                    list.push(row[field.index].value);
                }
                const values = list.filter((el, i, arr) => arr.indexOf(el) === i);


                paragraph.textContent += '\r\n \r\nNew Order Count: ';
                paragraph.textContent += values.length;
            })
        })
    })
}
