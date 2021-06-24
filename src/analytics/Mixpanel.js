import mixpanel from 'mixpanel-browser';
mixpanel.init('2742f0a859f9fd16638c1e86906497a2');

let env_check = false;

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
