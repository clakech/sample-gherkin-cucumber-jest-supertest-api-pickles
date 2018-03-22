let heroes = [];
let events = [];

const getHeroes = () => heroes;

const removeHero = hero => {
  heroes = heroes.filter(item => {
    return item.name !== hero.name;
  });
};

const removeHeroByName = name => {
  heroes = heroes.filter(item => {
    return item.name !== name;
  });
};

const updateHeroes = hero => {
  removeHero(hero);
  heroes.push(hero);
};

const getEvents = () => events;

const updateEvents = event => {
  removeEvent(event);
  events.push(event);
  console.log('event updated', events)
};

const removeEvent = event => {
  events = events.filter(item => item.type !== event.type || item.location !== event.location);
};

const clear = () => {
  heroes = [];
  events = [];
};

module.exports = {
  getHeroes,
  updateHeroes,
  removeHero,
  getEvents,
  updateEvents,
  removeEvent,
  removeHeroByName,
  clear
};
