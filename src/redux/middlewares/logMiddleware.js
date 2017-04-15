export default function logMiddleware() {

  return (next) => (action) => {
    console.info(action);
    return next(action);
  };
}
