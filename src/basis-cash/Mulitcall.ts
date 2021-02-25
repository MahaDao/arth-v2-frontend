import { EventEmitter } from 'events';
const multicall = require('@makerdao/multicall');

export interface IMulticallInput {
  key: string;
  target: string;
  call: (string | number)[];
  convertResult: (val: any) => any;
}

export default class Multicall extends EventEmitter {
  calls: IMulticallInput[] = [];
  watcher: any;
  rpcUrl: string;
  address: string;

  constructor(rpcUrl: string, address: string) {
    super();
    this.rpcUrl = rpcUrl;
    this.address = address;
    this.calls = [];
    this.recreateWatcher();
  }

  addCall = (data: IMulticallInput): string => {
    this.calls.push(data);
    this.recreateWatcher();
    this.watcher.tap(() => this.getMutlicallCalls([data]));
    return data.key;
  };

  addCalls = (data: IMulticallInput[]): string[] => {
    data.forEach((d) => {
      const call = this.calls.filter((call) => call.key == d.key);
      if (!call.length) {
        this.calls.push(d);
      }
    });
    this.recreateWatcher();

    this.watcher.tap(() => this.getMutlicallCalls(data))
    return data.map((d) => d.key);
  };

  private getMutlicallCalls = (calls: IMulticallInput[]) => {
    return calls.map((c) => ({
      target: c.target,
      call: c.call,
      returns: [[c.key, c.convertResult]],
    }));
  };

  private processUpdates = (update: { type: any; value: any }) => {
    this.emit(update.type, update.value);
  };

  private recreateWatcher = () => {
    if (this.watcher) this.watcher.stop();

    const config = {
      rpcUrl: this.rpcUrl,
      multicallAddress: this.address,
    };

    console.log(this.calls);
    this.watcher = multicall.createWatcher(this.getMutlicallCalls(this.calls), config);
    this.watcher.subscribe(this.processUpdates);

    // Start the watcher polling
    this.watcher.start();
  };
}
