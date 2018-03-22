const { profile, heroes, getHero, isValid, getInterventionPlan } = require('./middleware');
const { updateHeroes, removeHero, getHeroes, updateEvents, clear } = require("./db");

test("should validate a Hero", () => {
    return isValid({
        align: "Good Characters",
        alive: "Living Characters",
        name: "Dive-Bomber"
    }).then(data => {
        expect(data.isValid).toEqual(true);
    });
});

test("should validate a Hero", () => {
    return isValid({
        align: "Bad Characters",
        alive: "Living Characters",
        name: "Batman"
    }).then(data => {
        expect(data.isValid).toEqual(false);
    });
});

test('should profile water hero', () => {
    const hero = profile({ name: 'Waterwoman', firstAppearance: '', eye: 'blue', hair: 'nope' }, 'Lille');
    expect(hero.type).toEqual('water');
});

test('should profile air hero bald and not firstAppearance with R', () => {
    const hero = profile({ name: 'hero air', firstAppearance: '20 May 18 21:22 UTC', eye: 'blue', hair: 'bald' }, 'Madrid');
    expect(hero.type).toEqual('air');
});

test('should profile fire hero with eye yellow', () => {
    const hero = profile({ name: 'hero fire', firstAppearance: '', eye: 'yellow', hair: 'not bald' }, 'NYC');
    expect(hero.type).toEqual('fire');
});

test('should profile earth hero with modulo 17 thing', () => {
    const hero = profile({ name: 'Alister Hook', firstAppearance: '1988, March', eye: 'idk', hair: 'idk' }, 'Paris');
    expect(hero.type).toEqual('earth');
});

test('should hero be removed after making himself available', () => {
    const hero1 = profile({ name: 'Waterwoman', firstAppearance: '', eye: 'yellow', hair: 'not bald' }, 'Paris');
    const hero2 = profile({ name: 'Batman', firstAppearance: '', eye: 'yellow', hair: 'not bald' }, 'Paris');
    const hero3 = profile({ name: 'Superman', firstAppearance: '', eye: 'yellow', hair: 'not bald' }, 'Paris');

    clear();

    updateHeroes(hero1);
    updateHeroes(hero2);
    updateHeroes(hero3);

    expect(getHeroes().length).toEqual(3);
    removeHero(hero2)
    expect(getHeroes().length).toEqual(2);
});

test('should no plan be returned when no heroes are added', () => {
    clear();
    updateEvents({ type: 'TSUNAMI', location: 'New York' })
    expect(getInterventionPlan().length).toEqual(0);
});

test('should return right hero when there are heroes with similar names', async () => {
    jest.setTimeout(60000);

    clear();
    return getHero('Aquaman', 'c9e414f5-1fde-4432-be11-06c81380d189')
        .then(hero => {
            expect(hero.name).toEqual("Aquaman");
        })
});

test('should plan be returned when heroes matching are available', () => {
    clear();
    updateEvents({ type: 'TSUNAMI', location: 'New York' })
    updateHeroes(profile({ "name": "Aquaman", "eye": "Blue Eyes", "alive": "Living Characters", "appearances": "1121", "firstAppearance": "1941, November", "hair": "Blond Hair", "sex": "Male Characters", "align": "Good Characters", "id": "Public Identity", "secret": "c9e414f5-1fde-4432-be11-06c81380d189" }, 'Paris'));
    expect(getInterventionPlan()[0].hero).toEqual("Aquaman");
});