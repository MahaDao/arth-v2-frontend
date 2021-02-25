import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BanksProvider from './contexts/Banks';
import BasisCashProvider from './contexts/BasisCashProvider';
import ModalsProvider from './contexts/Modals';
import Banks from './views/Banks';
import Home from './views/Home';
import Bond from './views/Bond';
import Stats from './views/Stats';
import { initMulticallListners, default as store } from './state';
import theme from './theme';
import Updaters from './state/Updaters';
import Distributions from './views/Distributions';
import Popups from './components/Popups';
import config from './config';
import useBasisCash from './hooks/useBasisCash';
import './index.css';
import './App.css';

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <UseWalletProvider chainId={config.chainId} connectors={{ injected: {} }}>
        <Provider store={store}>
          <BasisCashProvider>
            <Updaters />
            <AppContent>{children}</AppContent>
          </BasisCashProvider>
        </Provider>
      </UseWalletProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  // init animate on scroll
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <Providers>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/stats">
            <Stats />
          </Route>
          <Route path="/staking">
            <Banks />
          </Route>
          <Route path="/bonds">
            <Bond />
          </Route>
          <Route path="/distribution">
            <Distributions />
          </Route>
          <Redirect to="/staking" />
        </Switch>
      </Router>
    </Providers>
  );
};

const AppContent: React.FC = ({ children }) => {
  // const { account } = useWallet();
  const basisCash = useBasisCash();

  if (!basisCash) return <div>Loading</div>;
  // if (!!!account) return <UnlockWallet />;

  return (
    <ModalsProvider>
      <BanksProvider>
        <>
          <Popups />
          {children}
        </>
      </BanksProvider>
    </ModalsProvider>
  );
};

export default App;
