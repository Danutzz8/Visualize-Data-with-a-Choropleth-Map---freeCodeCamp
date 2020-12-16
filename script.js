let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData      // link the county url to a variable
let educationData   // link the ed. url to a variable

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath()) // this attribute will draw the map/county
            .attr('class', 'county')
                // to color the map 
            .attr('fill', (d) => {
                let id = d['id']
                let county = educationData.find((d) => d['fips'] === id)
                let percentage = county['bachelorsOrHigher']
                
                if (percentage <= 15) {
                    return 'tomato'
                } else if (percentage <= 30) {
                    return 'orange'
                } else if (percentage <= 45) {
                    return 'lightgreen'
                } else 
                    return 'limegreen'
            })
            // we added the data from the 2 objucts with a bridge link id -- fips 
            .attr('data-fips', (d) => d['id'])
            .attr('data-education', (d) => {
                let id = d['id']
                let county = educationData.find((d) => d['fips'] === id)
                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', (d) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                        let id = d['id']
                        let county = educationData.find((d) => d['fips'] === id)

                tooltip.text(county['area_name'] + '  -  ' + county['state'] + ' - ' + county['bachelorsOrHigher'] + '%')  
                
                tooltip.attr('data-education', county['bachelorsOrHigher'])

            })
            .on('mouseout', (d) => {
                tooltip.transition()
                        .style('visibility', 'hidden')
            })
}
// importing data 

d3.json(countyURL).then(
    (data, error) => {
        if (error) {
            console.log(error);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features 
            console.log(countyData);

            d3.json(educationURL).then(
                (data, error) => {
                    if (error) {
                        console.log(error);
                    } else 
                    educationData = data
                    console.log(educationData) 
                    drawMap()
                
                }
            )
        }
    }
)

