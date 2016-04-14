module.exports = {

	mongolab:
	{
	        name: "workbench-locations-map-ec2",
	        url: "mongodb://workbenches1:workbenchlocations@ds013310.mlab.com:13310/workbenches",
	        port: 27017
    },

    local:
    {
        name: "test-app-local",
        url: "mongodb://localhost/testApp",
        port: 27017
    },
     localtest:
    {
        name: "test-app-local",
        url: "mongodb://localhost/testAppTest",
        port: 27017
    }
};