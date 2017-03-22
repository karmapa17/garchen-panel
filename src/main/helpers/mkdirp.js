import mkdirp from 'mkdirp';

export default function recursiveCreateFolder(path) {
  return new Promise(function(resolve, reject) {
    mkdirp(path, function(err) {
      return err ? reject(err) : resolve();
    });
  });
}
