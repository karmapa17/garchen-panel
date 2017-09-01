import {cloneDeep, noop} from 'lodash';
import log from 'karmapa-log';

export default class IpcDecorator {

  static bindHandler(fn, params = {}) {

    return (name, event, args) => {

      // ignore electron internal events
      if (name.startsWith('ELECTRON')) {
        return;
      }

      const self = {};

      self.params = {};

      Object.keys(params)
        .forEach((key) => {
          self.params[key] = params[key];
        });

      self.send = (data = {}) => {
        event.sender.send(`${name}::${args._id}`, data);
      };

      self.resolve = self.send;

      self.reject = (data) => {
        data._error = true;
        self.send(data);
      };

      self.broadcast = event.sender.send.bind(event.sender);

      const data = cloneDeep(args);
      delete data._id;

      const promise = fn.call(self, event, data);

      // make the error clearer
      if (promise && ('function' === typeof promise.catch)) {
        promise.catch((err) => {
          const message = `unhandled error in event ${name}: `;
          self.reject({message: message + err.toString()});
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
