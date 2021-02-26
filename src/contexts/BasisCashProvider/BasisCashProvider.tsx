import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from 'use-wallet';
import BasisCash from '../../basis-cash';
import config from '../../config';
import { initMulticallListners } from '../../state';

export interface BasisCashContext {
  basisCash: BasisCash;
}

export const Context = createContext<BasisCashContext>({ basisCash: null });

export const BasisCashProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [basisCash, setBasisCash] = useState<BasisCash>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!basisCash) {
      const basis = new BasisCash(config);
      if (account) {
        // wallet was unlocked at initialization
        basis.unlockWallet(ethereum, account);
      }
      setBasisCash(basis);
    } else {
      initMulticallListners(basisCash, dispatch, account);
    }

    if (account) {
      basisCash.unlockWallet(ethereum, account);
    }

  }, [account, basisCash, ethereum]);

  return <Context.Provider value={{ basisCash }}>{children}</Context.Provider>;
};
