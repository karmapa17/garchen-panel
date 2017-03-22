import {NOOP} from './../constants';

export default class ipcDecorator {

  static bindHandler(fn) {

    return (name, event, args) => {

      this.send = (data = {}) => {
        event.sender.send(`${name}::${args._id}`, data);
      };

      this.reject = (data) => {
        data.error = true;
        this.send(data);
      };

      this.broadcast = event.sender.send.bind(event.sender);

      fn.call(this, event, args);
    };
  }

  static bindEventName(delegate) {

    const on = delegate.on.bind(delegate);

    delegate.on = (name, fn) => {
      const bindedFn = this.bindHandler(fn || NOOP);
      on(name, bindedFn.bind(delegate, name));
    };
    return delegate;
  }

  static decorate(delegate) {
    return this.bindEventName(delegate);
  }
}
