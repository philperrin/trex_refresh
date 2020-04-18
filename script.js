tableau.extensions.initializeAsync().then(() => {
  console.log('Initialized!!');
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

  tableau.extensions.dashboardContent.dashboard.worksheets.find((w) => w.name === 'records').getUnderlyingDataAsync().then((dataTable) => {
    const field = dataTable.columns.find((column) => column.fieldName === 'Order ID');
    const list = [];
    for (const row of dataTable.data) {
      list.push(row[field.index].value);
    }
    const values = list.filter((el, i, arr) => arr.indexOf(el) === i);
    console.log("old values: ");
    console.log(values.length);

    paragraph.textContent = '<strong>Data Last Refreshed: </strong>\r\n';
    paragraph.textContent += Date();
    paragraph.textContent += '\r\n \r\n<strong>Previous Order Count: </strong>';
    paragraph.textContent += values.length;

    if (callback) {
      callback(partthree);
    }
  })
}


var parttwo = function(second) {
  setTimeout(function() {

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

    second(partthree);
  }, 0);  //timer for debugging
}

var partthree = function(args) {
  setTimeout(function() {

    const dashboard = tableau.extensions.dashboardContent;
    const worksheets = tableau.extensions.dashboardContent.dashboard;
    const dataSourceFetchPromises = [];
    const dashboardDataSources = {};
    tableau.extensions.initializeAsync().then(() => {
      console.log('Re-initialized');
    });
    tableau.extensions.dashboardContent.dashboard.worksheets.find((w) => w.name === 'records').getUnderlyingDataAsync().then((dataTable) => {
      const field = dataTable.columns.find((column) => column.fieldName === 'Order ID');
      const list = [];
      for (const row of dataTable.data) {
        list.push(row[field.index].value);
      }
      const values = list.filter((el, i, arr) => arr.indexOf(el) === i);
      console.log("new values: ");
      console.log(values.length);
      paragraph.textContent += '\r\n \r\n<strong>New Order Count: </strong>';
      paragraph.textContent += values.length;
    })
  }, 0) //timer for debugging
}
