const express = require('express');
const formidable = require('formidable');
const path = require('path');
const serveIndex = require('serve-index');

const PORT = 8080;
const app = express();

app.post('/api/upload', (req, res, next) => {
  const form = formidable({ multiples: true, uploadDir: path.join(__dirname, 'public', 'uploads') });

  form.parse(req, (err, fields, files) => {
    if (Array.isArray(files.someExpressFiles)) {
      console.log('Upload multiple files')
    }

    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });

  form.on('fileBegin', function (name, file) {
    const dir = path.dirname(file.path)
    //file.path += path.extname(file.name);
    file.path = path.join(dir, `${new Date().getTime()}-${file.name}`) 
  });

  form.on('file', function (name, file) {
    console.log('Uploaded ' + file.name + ' -> ' + path.basename(file.path));
  });

});

app.use(express.static('public'), serveIndex('public', { icons: true, view: 'details' }));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT} ...`);
});