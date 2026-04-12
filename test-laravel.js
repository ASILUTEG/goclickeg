fetch("http://127.0.0.1:8000/api/products")
  .then(r => r.text())
  .then(r => console.log('Response:', r))
  .catch(console.error);
