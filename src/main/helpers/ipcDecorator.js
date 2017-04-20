import {cloneDeep, noop} from 'lodash';
import log from 'karmapa-log';

export default class IpcDecorator {

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

      const promise = fn.call(this, event, data);

      // make the error clearer
      if (promise && ('function' === typeof promise.catch)) {
        promise.catch((err) => {
          const message = `unhandled error in event ${name}: `;
          this.reject({message: message + err.toString()});
          log.error(message, err);
        });
      }
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
