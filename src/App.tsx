import AOS from 'aos';
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { ThemeProvider } from 'styled-components';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import './index.css';
import 'aos/dist/aos.css';
import theme from './theme';

import Home from './views/Home';
import Mint from './views/Mint';
import Pools from './views/Pools';
import Stats from './views/Stats';
import Rebase from './views/Rebase';
import Faucet from './views/Faucet';
import Page from './components/Page';
import Genesis from './views/Genesis';
import Farming from './views/Farming';
import Lottery from './views/Lottery';
import TopBar from './components/TopBar';
import Popups from './components/Popups';

import store from './state';
import useCore from './hooks/useCore';
import Updaters from './state/Updaters';
import ModalsProvider from './contexts/Modals';
import BasisCashProvider from './contexts/BasisCashProvider';
import config from './config';
import Button from './components/Button';
import ConnectionNotice from './views/Genesis/ConnectionNotice';
import { Mixpanel } from './analytics/Mixpanel';

const Providers: React.FC = ({ children }) => {
  const currentNetworkId = config.chainId;
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider chainId={currentNetworkId} connectors={{ injected: {} }}>
        <Provider store={store}>
          <Updaters />
          <BasisCashProvider>
            <AppContent>{children}</AppContent>
          </BasisCashProvider>
        </Provider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  // Init animate on scroll
  useEffect(() => {
    AOS.init();

    // @ts-ignore
    window.ethereum.on('chainChanged', (chainId) => {
      // handle the new network
      console.log('change');
    });
  }, []);

  const makeUnPassive = (ev: any) => {
    ev.preventDefault();
  };

  useEffect(() => {
    document.body.addEventListener('touchmove', makeUnPassive, { passive: true });
    return () => document.body.removeEventListener('touchmove', makeUnPassive);
  }, []);

  return (
    <Providers>
      <Router>
        <TopBar />
        <Switch>
          <Route path="/stats">
            <Page availableNetworks={[137, 1337]}>
              <Stats />
            </Page>
          </Route>
          {/*<Route path="/" exact>
            <Home />
          </Route>*/}

          {/* <Route path="/farming">
            <Page availableNetworks={[137, 1337]}>
              <Farming />
            </Page>
          </Route>
          <Route path="/mint/:paramType">
            <Page availableNetworks={[137, 1337]}>
              <Mint />
            </Page>
          </Route>
          <Route path="/trade">
            <Page availableNetworks={[137, 1337]}>
              <TemporaryTrade />
            </Page>
          </Route>
          <Route path="/pools">
            <Page availableNetworks={[137, 1337]}>
              <Pools />
            </Page>
          </Route> */}
          <Route path="/genesis">
            <Page>
              <Genesis />
            </Page>
          </Route>
          {/* <Route path="/faucet">
            <Page availableNetworks={[1337]}>
              <Faucet />
            </Page>
          </Route> */}
          <Route path="/rebase">
            <Page>
              <Rebase />
            </Page>
          </Route>
          <Route path="/lottery">
            <Page>
              <Lottery />
            </Page>
          </Route>
          <Redirect to="/genesis"></Redirect>
        </Switch>
      </Router>
    </Providers>
  );
};

const AppContent: React.FC = ({ children }) => {
  const core = useCore();
  const { account, connect } = useWallet();

  useEffect(() => {
    // @ts-ignore
    if (window.ethereum)
      // @ts-ignore
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
  }, []);

  if (!core) return <div />;

  console.log();

  if (window.location.hostname === 'arthcoin.com') {
    Mixpanel.track(`ScreenView:${window.location.pathname}`);
    return <ConnectionNotice />;
  }

  return (
    <ModalsProvider>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        maxSnack={2}
        autoHideDuration={2500}
      >
        <>
          <Popups />
          {children}
        </>
      </SnackbarProvider>
    </ModalsProvider>
  );
};

export default App;
