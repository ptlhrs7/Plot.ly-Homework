

let data = d3.json("samples.json");
//console.log(data);

//function that populates meta data
function demoInfo(sample) {
    //console.log(sample);

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {

        // grab all of metadata

        let metaData = data.metadata;
        //console.log(metaData);

        // filter based on the value of the sample (returns one result based on the dataset)

        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        //console.log(result);

        // access index 0 from the array

        let resultData = result[0];
        //console.log(resultData);

        // clear the meatadata out
        d3.select("#sample-metadata").html(""); // clears the HTML out

        // use object.entries to get the value key pairs

        Object.entries(resultData).forEach(([key, value]) => {

            // add to the sample data /demographic section

            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);

        });

    });


}

//function that builds graphs
function buildBarChart(sample) {
    //console.log(sample);
    //let data = d3.json("samples.json");
    //console.log(data);

    d3.json("samples.json").then((data) => {

        // grab all of samples

        let sampleData = data.samples;

        // filter based on the value of the sample (returns one result based on the dataset)

        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array

        let resultData = result[0];


        // get otus ids, labels and sample values

        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;


        // build the barcharts

        // get the Y Ticks
        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0, 10);
        let textLabels = otu_labels.slice(0, 10);


        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);

    });

}

// function that builds the bubble chart

function buildBubbleChart(sample) {
    //console.log(sample);
    //let data = d3.json("samples.json");
    //console.log(data);

    d3.json("samples.json").then((data) => {

        // grab all of samples

        let sampleData = data.samples;

        // filter based on the value of the sample (returns one result based on the dataset)

        let result = sampleData.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array

        let resultData = result[0];


        // get otus ids, labels and sample values

        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;


        // build the bubblechart


        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }

        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closet",
            xaxis: { title: "OTU ID" }
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);

    });
}


// function that initializes dashboard
function initialize() {
    //let data = d3.json("data/samples.json");
    //console.log(data);

    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // d3.json to get the data
    d3.json("samples.json").then((data) => {

        let sampleNames = data.names; // made an array of just nemes
        //console.log(sampleNames);

        // use a foreach in order to create options for each sample in the 
        // selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);

        });

        // when initialized,pass in the information for the first sample
        let sample1 = sampleNames[0];

        // call function to bild metedata

        demoInfo(sample1);

        // call function to build barchart
        buildBarChart(sample1);

        // call functio to build bubble chart
        buildBubbleChart(sample1);

    });
}

// function that updates dashboard
function optionChanged(item) {
    // call update for the metadata
    demoInfo(item);

    // call function to build the bar chart
    buildBarChart(item);

    // call functio to build bubble chart
    buildBubbleChart(item);

}


// call the intialize function
initialize();

// Reference code used from Dr. A's Video