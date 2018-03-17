(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "siteName",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "activityId",
            alias: "PermitNumber",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "activityTypeName",
            alias: "ActivityType",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "activitySubtypeName",
            dataType: tableau.dataTypeEnum.string
        }, {
			id: "watershedName",
			dataType: tableau.dataTypeEnum.string
        }, {
			id: "huc8",
			dataType: tableau.dataTypeEnum.string
        }, {
			id: "countyName",
			dataType: tableau.dataTypeEnum.string
        }, {
			id: "active",
			dataType: tableau.dataTypeEnum.string
        }, {
			id: "siteId",
			dataType: tableau.dataTypeEnum.int
		}, {
			id: "lat",
			dataType: tableau.dataTypeEnum.float
        }, {
			id: "long",
			dataType: tableau.dataTypeEnum.float
			
		}];

        var tableSchema = {
            id: "ActiveMunicipalWastewaterPermits",
            alias: "Municipal facility list from WIMN",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://services.pca.state.mn.us/api/v1/wimn/site-activities?stateCode=MN&active=Y&activitySubtypeName=Municipal%20NPDES/SDS%20Permit&format=json", function(resp) {
            var feat = resp.data,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "siteName": feat[i].siteName,
                    "activityId": feat[i].activityId,
                    "activityTypeName": feat[i].activityTypeName,
                    "activitySubtypeName": feat[i].activitySubtypeName,
					"watershedName": feat[i].watershedName,
					"huc8": feat[i].huc8,
					"countyName": feat[i].countyName,
					"active": feat[i].active,
					"siteId":feat[i].siteId,
					"lat": feat[i].lat,
					"long": feat[i].long,
					
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Municipal Wastewater Facilities"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
