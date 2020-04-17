tableau.extensions.initializeAsync().then(() => {
    console.log('I have been initialized!!');
});

const values = [];
const list = [];
const paragraph = document.getElementById('p');

function refresh() {
    const { dashboard } = tableau.extensions.dashboardContent;
    const { worksheets } = tableau.extensions.dashboardContent.dashboard;
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
        console.log(values.length);

        paragraph.textContent = 'Data Last Refreshed: \r\n';
        paragraph.textContent += Date();
        paragraph.textContent += '\r\n \r\nPrevious Order Count: ';
        paragraph.textContent += values.length;


        dashboard.worksheets.forEach((worksheet) => {
            dataSourceFetchPromises.push(worksheet.getDataSourcesAsync());
        });
        Promise.all(dataSourceFetchPromises).then((fetchResults) => {
            fetchResults.forEach((dataSourcesForWorksheet) => {
                dataSourcesForWorksheet.forEach((dataSource) => {
                    if (!dashboardDataSources[dataSource.id]) {
                        dashboardDataSources[dataSource.id] = dataSource;
                        dataSource.refreshAsync();

                    }
                })
            })
        })


/*        tableau.extensions.dashboardContent.worksheets.find((w) => w.name === 'records').getUnderlyingDataAsync().then((dataTable) => {
            const field = dataTable.columns.find((column) => column.fieldName === 'Order ID');
            const list = [];
            for (const row of dataTable.data) {
                list.push(row[field.index].value);
            }
            const values = list.filter((el, i, arr) => arr.indexOf(el) === i);
 */           paragraph.textContent += '\r\n \r\nNew Order Count: ';
 //           paragraph.textContent += values.length;


        })
    })
}
