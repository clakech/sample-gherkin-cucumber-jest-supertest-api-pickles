const moment = require("moment");
moment.suppressDeprecationWarnings = true;
const request = require("request");
const {
  clear,
  getHeroes,
  updateHeroes,
  getEvents,
  updateEvents,
  removeHero,
  removeEvent,
  removeHeroByName
} = require("./db");

const getHero = (name, key) => {
  const API = "http://some.url/api/";
  const optionsGetHeros = {
    url: `${API}/search?name=${name}`,
    headers: {
      "Content-Type": "application/json",
      token: "ASuperSecuredToken"
    }
  };

  return new Promise((resolve, reject) => {
    request.get(optionsGetHeros, (error, response, body) => {
      if (error) reject(error);

      if (body) {
        const heroArray = JSON.parse(body);
        for (var i = 0; i < heroArray.length; i++) {
          if (heroArray[i].secret == key) {
            return resolve(heroArray[i]);
          }
        }
      }

      return reject("WTF ? no match for " + name + " key: " + key);
    });
  });
};

const isValid = (hero, key) => {
  return new Promise((resolve, reject) => {
    let isValid = true;
    const conditions = {
      alive: "Living Characters",
      align: ["Neutral Characters", "Good Characters"]
    };

    Object.entries(conditions).forEach(([index, element]) => {
      if (Array.isArray(element)) {
        if (!element.includes(hero[index])) isValid = false;
      } else if (!hero[index] === element) isValid = false;
    });

    if (key && key !== hero.secret) {
      console.log(
        "hero secret: " + hero.secret + " does not match provided key: " + key
      );
      isValid = false;
    }

    return resolve({
      isValid,
      hero
    });
  });
};

const profile = (hero, location) => {
  console.log('[Profile]', hero, location);
  let type;

  // WATER
  const name = hero.name.toLowerCase();
  if (name.includes("water") || name.includes("aqua") || name.includes("ice"))
    type = "water";

  // AIR
  const hair = hero.hair.toLowerCase();
  const firstAppearanceMonth = moment(hero.firstAppearance).format("MMMM");
  if (hair == "bald" && !firstAppearanceMonth.includes("r")) type = "air";

  // FIRE
  const eye = hero.eye.toLowerCase();
  if (eye.includes("red") || eye.includes("yellow")) type = "fire";

  // EARTH
  const asciiCodeLocation = [...location].reduce(
    (acc, current) => acc + current.charCodeAt(0),
    0
  );
  const year = moment(hero.firstAppearance).year();
  const yearPlusAscii = year + asciiCodeLocation;
  const modulo17 = yearPlusAscii % 17 === 0;
  if (modulo17) type = "earth";

  console.log('[Profile] found', type);

  return Object.assign({}, hero, { type });
};

const register = (req, res, next) => {
  if (!req.body || !req.body.name)
    return res.status(404).send("You need to register a named Hero !");

  getHero(req.body.name, req.body.key)
    .then(hero => isValid(hero, req.body.key))
    .then(obj => {
      console.log(obj)
      if (!obj.isValid) {
        return res.send("We can't accept this hero");
      } else {
        updateHeroes(obj.hero);
        return res.send("Welcome to our new Hero !!!");
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Something wrong happened :(");
    });
};

const event = (req, res, next) => {
  if (!req.body || !req.body.location || !req.body.type)
    return res.status(404).send("This event is not valid !");

  const { type, location, strength, name } = req.body;
  if (type === "End Of Mission") {
    clear();
    return res.send("Good job team let have a beer");
  } else {
    updateEvents({ type, location, strength, name });
    return res.send("OK we are on it !!!");
  }
};

const mapHeroPlanTsunami = (hero, heroesInPlan, event) => {
  const { type } = profile(hero, event.location);
  console.log('[mapHeroPlanTsunami]', hero.name, type);
  if (type === "water") {
    return {
      hero: hero.name,
      location: event.location,
      action: "prevent"
    };
  } else if (type === "air") {
    return {
      hero: hero.name,
      location: event.location,
      action: "repair"
    };
  }
};

const mapHeroPlanMetorize = (hero, heroesInPlan, event) => {
  const { type } = profile(hero, event.location);
  console.log('[mapHeroPlanMetorize]', hero.name, type);
  if (type === "fire") {
    return {
      hero: hero.name,
      location: event.location,
      action: "prevent"
    };
  } else if (type === "earth") {
    return {
      hero: hero.name,
      location: event.location,
      action: "repair"
    };
  }
};

const getInterventionPlan = () => {
  console.log('[getInterventionPlan]');

  const heroesInPlan = [];
  const events = getEvents();
  console.log('[getInterventionPlan] Events', events);
  const plan = events
    .map(event => {
      console.log('[getInterventionPlan] map event', event);

      let plans;
      if (event.type.toLowerCase() === "tsunami") {
        plans = getHeroes()
          .filter(hero => !heroesInPlan.includes(hero.name))
          .map(hero => mapHeroPlanTsunami(hero, heroesInPlan, event))
          .filter(plan => plan);
      }
      if (event.type.toLowerCase() === "meteorite") {
        plans = getHeroes()
          .filter(hero => !heroesInPlan.includes(hero.name))
          .map(hero => mapHeroPlanMetorize(hero, heroesInPlan, event))
          .filter(plan => plan);
      }
      console.log('[getInterventionPlan] plans for event', event, plans);

      if (plans && plans.length > 0) {
        heroesInPlan.push(plans[0].hero);
        return plans[0];
      }
    })
    .filter(plan => plan);

  return plan;
};

const intervention = (req, res, next) => {
  res.json(getInterventionPlan());
};

const heroes = (req, res, next) => {
  res.json(getHeroes());
};

const allEvents = (req, res, next) => {
  res.json(getEvents());
};

const clearDB = () => {
  clear();
  res.send(200);
}

module.exports = {
  register,
  getHero,
  isValid,
  allEvents,
  intervention,
  getInterventionPlan,
  heroes,
  event,
  profile,
  clearDB
};
