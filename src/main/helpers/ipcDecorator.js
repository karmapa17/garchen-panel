import NOOP from './../constants/noop';

export default class ipcDecorator {

  static bindHandler(fn) {

    return (name, event, args) => {

      this.send = (data = {}) => {
        event.sender.send(`${name}::${args._id}`, data);
      };

      this.resolve = this.send;

      this.reject = (data) => {
        data._error = true;
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
