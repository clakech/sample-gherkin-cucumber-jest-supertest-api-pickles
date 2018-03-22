# Kaizen

## Development

Run `npm run devstart` for development enviromnent. It starts [nodemon](https://github.com/remy/nodemon) and restart servers on changes.

## Tests

We are using [JEST](https://facebook.github.io/jest/) depending of the situation you can run the following commands `npm run testDev` (has the `--watch` option) or `npm run test`

## Endpoints

### `/heroes`

Get the list of the validated and profiled heroes

### `/allEvents`

Get the list of all events

### generate gherkin scenarios web site

mono /path/to/Pickles.exe --feature-directory=./features --link-results-file=./reports/test-report.xml --output-directory=./doc