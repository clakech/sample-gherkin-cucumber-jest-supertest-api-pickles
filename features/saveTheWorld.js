const { cucumber } = require('gherkin-jest');
const request = require('supertest');
const assert = require('assert');
const app = request(require('../app'));

cucumber.defineCreateWorld(async () => {
    return { plan: [] };
});

cucumber.defineRule('A hero named {string} with key {word}', (world, name, key) => {
    return app.post('/registration').send({ name, key }).expect(200);
});

cucumber.defineRule('An event {word} in {word}', (world, type, location) => {
    return app.post('/event').send({ location, type }).expect(200);
});

cucumber.defineRule('An intervention plan is claimed', (world) => {
    return app.get('/interventionPlan').expect(res => { world.plan = res.body).expect(200);
});

cucumber.defineRule('The hero {string} in {word} has action {word}', (world, hero, location, action) => {
    if (!world.plan.some(plan => plan.hero === hero && plan.location === location && plan.action === action))
        throw Error(`The plan should have hero ${hero} in ${location} with action ${action} but was ${JSON.stringify(world.plan)}`);
});

cucumber.defineRule('The intervention plan is empty', function (world, type, location, action) {
    if (!world.plan || world.plan.length !== 0)
        throw new Error('plan should be empty');
});