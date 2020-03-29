function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id === sample);
      console.log(resultArray[0]);
      var result = resultArray[0];
  
      var otu_ids = result.otu_ids;
      console.log(otu_ids);
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: {
          t: 0
        },
        hovermode: "closest",
        xaxis: {
          title: "OTU ID"
        },
        margin: {
          t: 30
        }
      };
      var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }];
      Plotly.newPlot("bubbleChart", bubbleData, bubbleLayout);
  
  
      // Draws Bar Chart
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      console.log(`The value of: ${otu_ids} .`)
      var barData = [{
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }];
  
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
          t: 30,
          l: 150
        }
      };
      Plotly.newPlot("barChart", barData, barLayout);
    });
  }

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  

function init() {
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
   
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();