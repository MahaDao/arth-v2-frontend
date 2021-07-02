import mixpanel from 'mixpanel-browser';

let key = '';
if (process.env.NODE_ENV === "development" || window.location.hostname === 'staging.arthcoin.com') {
  key = '84c19ce0c48dff4b147960872628919a' //Staging Key
} else if (window.location.hostname === 'arthcoin.com') {
  key = '2742f0a859f9fd16638c1e86906497a2' //arthcoin Key
} else if (process.env.REACT_APP_NETWORK === "matic") {
  key = 'b646039d2dd5e1e09deebb592cd041b1' //Polygon key
} else if (process.env.REACT_APP_NETWORK === "ethereum") {
  key = '66a957f18e2f2cb7cbb235d8bb6823b1' //ethereum key
} else {
  key = '84c19ce0c48dff4b147960872628919a' //staging key
}

mixpanel.init(key);
let env_check = true;

let actions = {
  identify: (id) => {
    if (env_check) {
      console.log('env_check', id);
      mixpanel.identify(id);
    }
  },
  alias: (id) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name, props) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export let Mixpanel = actions;
