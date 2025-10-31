
    let productosData = {};
    // Cargar productos desde JSON
    fetch('productos.json')
      .then(response => response.json())
      .then(data => {
        productosData = data;
        // 🔹 Al iniciar, mostrar los productos de ofertas
        if (productosData["ofertas"]) {
          mostrarProductos("ofertas");
        }
      })
      .catch(err => console.error("Error al cargar productos.json:", err));

    // Mostrar productos según categoría y subcategoría
    // 🟢 Mostrar productos (1, 2 o 3 niveles)
    function mostrarProductos(categoria, subcategoria = null, region = null, liga = null) {
  const contenedor = document.getElementById('galeria-productos');
  const titulo = document.getElementById('titulo-seccion');
  contenedor.innerHTML = '';

  let productos = [];

  // Soporte para hasta 4 niveles
  if (liga) {
    productos = productosData?.[categoria]?.[subcategoria]?.[region]?.[liga] || [];
  } else if (region) {
    productos = productosData?.[categoria]?.[subcategoria]?.[region] || [];
  } else if (subcategoria) {
    productos = productosData?.[categoria]?.[subcategoria] || [];
  } else {
    productos = productosData?.[categoria] || [];
  }

  // Actualizar título dinámico
  if (titulo) {
    const nuevoTitulo = liga
      ? liga.replace(/-/g, ' ').toUpperCase()
      : region
        ? region.replace(/-/g, ' ').toUpperCase()
        : subcategoria
          ? subcategoria.replace(/-/g, ' ').toUpperCase()
          : categoria.replace(/-/g, ' ').toUpperCase();

    requestAnimationFrame(() => {
      titulo.textContent = nuevoTitulo;
    });
  }

  // Mostrar productos
  if (!productos.length) {
    contenedor.innerHTML = '<p class="text-center mt-4">No hay productos disponibles.</p>';
    return;
  }

  productos.forEach(p => {
    const card = `
      <div class="product-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
        <h5>${p.nombre}</h5>
        <p>₡${p.precio.toLocaleString()}</p>
      </div>`;
    contenedor.insertAdjacentHTML('beforeend', card);
  });
}
    // Escuchar clics en los botones del menú
    document.addEventListener('click', e => {
  const btn = e.target.closest('[data-categoria]');
  if (btn) {
    e.preventDefault();
    const categoria = btn.getAttribute('data-categoria');
    const subcategoria = btn.getAttribute('data-subcategoria');
    const region = btn.getAttribute('data-region');
    const liga = btn.getAttribute('data-liga');

    const sidebar = document.getElementById('sidebar');
    const offcanvas = bootstrap.Offcanvas.getInstance(sidebar);

    if (offcanvas) {
      offcanvas.hide();
      setTimeout(() => mostrarProductos(categoria, subcategoria, region, liga), 350);
    } else {
      mostrarProductos(categoria, subcategoria, region, liga);
    }
  }
});
