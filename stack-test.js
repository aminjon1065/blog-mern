const a = 5;
function b() {
  return c();
}

function c() {
  return d();
}

function d() {
  return a();
}

b();
