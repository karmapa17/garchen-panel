import {cloneDeep, noop} from 'lodash';

export default class ipcDecorator {

  static bindHandler(fn, params = {}) {

    return (name, event, args) => {

      this.params = {};

      Object.keys(params)
        .forEach((key) => {
          this.params[key] = params[key];
        });

      this.send = (data = {}) => {
        event.sender.send(`${name}::${args._id}`, data);
      };

      this.resolve = this.send;

      this.reject = (data) => {
        data._error = true;
        this.send(data);
      };

      this.broadcast = event.sender.send.bind(event.sender);

      const data = cloneDeep(args);
      delete data._id;

      fn.call(this, event, data);
    };
  }

  static bindEventName(delegate, models) {

    const on = delegate.on.bind(delegate);

    delegate.on = (name, fn) => {
      const bindedFn = this.bindHandler((fn || noop), models);
      on(name, bindedFn.bind(delegate, name));
    };
    return delegate;
  }

  static decorate(delegate, params) {
    return this.bindEventName(delegate, params);
  }
}
