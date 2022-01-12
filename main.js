const { performance } = require('perf_hooks')
const fs = require('fs')
const R = require('ramda')

// Set the json inout and outout file names
const input_file_name = 'input.json'
const output_file_name = 'output.json'

// Get the performance start time
const performance_start = performance.now()

// Create the loadJSON function
async function loadJSON(input_file) {
	const raw_data = fs.readFileSync(input_file)
	return await JSON.parse(raw_data)
}

// Create the save output result to a JSON file
function saveJSON(output_file_name, output_events_data) {
	const output_file_data = JSON.stringify(output_events_data, null, 4)
	fs.writeFile(output_file_name, output_file_data, 'utf8', function(err) {
		if ( err ) {
			return console.log(err)
		}
	})
	return null
}

// Sort the array by a couple of fields
function sortArrayByDateTime(events_array) {
	const sorted_array = R.sortWith([
		R.ascend(R.compose(R.prop('uts'), R.prop('event')))
	])
	const result = sorted_array(events_array)
	return result
}

// Call the loadJSON() function and generate the `output.json` file
loadJSON(input_file_name)
	.then(
		data => {
			// Get the Slate Events
			let slate_events = data ? data.data.slate_events : []

			// Update the Slate Events array
			if (slate_events.length > 0) {
				// Add `teams` and `id` properties to slate events
				slate_events = R.map(event => R.assoc('teams', event['szDescriptor'], event), slate_events)
				slate_events = R.map(event => R.assoc('id', event['szDescriptor'].toLowerCase().replace(/\s/g, '_'), event), slate_events)

				const toIndividualKeys = R.pipe(
					R.values,
					R.map(R.objOf('event'))
				)
				slate_events = toIndividualKeys( slate_events )

			}

			// Get the Sporting Events
			let sporting_events = data ? data.data.sporting_events : []

			// Chech if there are sporting events and to the logic
			const sporting_events_length = Object.keys(sporting_events).length

			if (sporting_events_length > 0) {
				const toIndividualKeys = R.pipe(
					R.values,
					R.map(R.objOf('event'))
				)
				sporting_events = toIndividualKeys( sporting_events )
			}

			// Do the union of both `slate_events` and `sporting_events` arrays and sort them by date and time
			const union_events_array = sortArrayByDateTime(R.union(slate_events, sporting_events))

			// Group the events by teams, date & time
			const grouped_events = R.pipe(
				R.groupBy(R.compose(R.prop('teams'), R.prop('event'))), // group object by the event->teams property
				R.values, // get an array of groups
				R.map(
					R.pipe(
						R.groupBy(R.compose(R.prop('uts'), R.prop('event'))),
						R.values,
						R.map(R.applySpec({ // map each group to an object
							event: R.map(R.prop('event')) // collect all event props to an array
						}))
					)
				)
			)

			// Merge the evnts
			const mergeData = R.pipe(
				R.flatten, // flatten to a single array
				R.values, // convert back to array
				R.map( items => ({
					...items,
					isStacked: Object.keys(items.event).length > 1 ? true : false,
					isSlate: false,
					sp: items.event[0]['sp']
				})) // add the static rank property
			)

			const mergedEvents = R.concat([], mergeData(grouped_events(union_events_array)))

			// Finally save the merged Events to `output.json` file
			saveJSON(output_file_name, mergedEvents)

			// Get the performance end time and calculate the total execution time
			const performance_time = (performance.now() - performance_start).toFixed(2)
			console.log('The total execution time of the code took ' + performance_time + ' ms.')
		})
	.catch(error => console.log(error.message))
