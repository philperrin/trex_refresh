tableau.extensions.initializeAsync().then(() => {
	console.log('I have been initialized!!');
});

const values = [];
const list = [];
const paragraph = document.getElementById('p');

function refresh(callback) {
	const {
		dashboard
	} = tableau.extensions.dashboardContent;
	const {
		worksheets
	} = tableau.extensions.dashboardContent.dashboard;
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
		/*        tableau.extensions.dashboardContent.worksheets.forEach((worksheet) => {
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
		  */
		  callback();
	})

	paragraph.textContent += '\r\n \r\nNew Order Count: ';
	paragraph.textContent += '';


function newcount() {
	{
		const {
			dashboard
		} = tableau.extensions.dashboardContent;
		const {
			worksheets
		} = tableau.extensions.dashboardContent.dashboard;
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
			const values2 = list.filter((el, i, arr) => arr.indexOf(el) === i);
			console.log("new count: ");
			console.log(values2.length);
			paragraph.textContent += '\r\n \r\nNew Order Count: ';
			paragraph.textContent += values2.length;
		});
	}
}

	};
