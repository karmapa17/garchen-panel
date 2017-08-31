import mkdirp from 'mkdirp';

export default function recursiveCreateFolder(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      return err ? reject(err) : resolve();
    });
  });
}
