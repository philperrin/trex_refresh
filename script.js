/*global tableau*/
tableau.extensions.initializeAsync().then(() => {
  console.log('I have been initialized!!')
});

function refresh() {
    let dashboard = tableau.extensions.dashboardContent.dashboard;
    let selectedWorksheet = dashboard.worksheets.find(w => w.name === 'Sales');
}
