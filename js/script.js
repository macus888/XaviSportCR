// ==========================
// Xavi Sports - script.js
// ==========================

let productosData = {};

// 🟢 Cargar productos desde JSON
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    productosData = data;
    // Cargar ofertas por defecto al iniciar
    if (productosData["ofertas"]) {
      mostrarProductos("ofertas");
    }
  })
  .catch(err => console.error("Error al cargar productos.json:", err));

// 🟢 Función flexible para mostrar productos (soporta 2, 3 o 4 niveles)
function mostrarProductos(categoria, subcategoria = null, region = null, liga = null) {
  const contenedor = document.getElementById('galeria-productos');
  const titulo = document.getElementById('titulo-seccion');
  contenedor.innerHTML = '';

  let productos = [];

  // Validar categoría principal
  const cat = productosData?.[categoria];
  if (!cat) {
    contenedor.innerHTML = '<p class="text-center mt-4">No se encontró la categoría seleccionada.</p>';
    return;
  }

  // Detección de niveles jerárquicos
  if (liga && region && subcategoria) {
    // 4 niveles
    productos = cat?.[subcategoria]?.[region]?.[liga] || [];
  } else if (region && subcategoria) {
    // 3 niveles
    productos = cat?.[subcategoria]?.[region] || [];
  } else if (subcategoria) {
    // 2 niveles
    productos = cat?.[subcategoria] || [];
  } else {
    // 1 nivel
    productos = cat;
  }

  // 🔹 Si el resultado no es un array, buscar el primer nivel con productos
  if (!Array.isArray(productos)) {
    const nivel = Object.values(productos).find(v => Array.isArray(v));
    if (nivel) productos = nivel;
  }

  // 🔹 Actualizar título dinámico
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

  // 🔹 Mostrar mensaje si no hay productos
  if (!productos || productos.length === 0) {
    contenedor.innerHTML = '<p class="text-center mt-4">No hay productos disponibles en esta categoría.</p>';
    return;
  }

  // 🔹 Renderizar los productos
  productos.forEach(p => {
    const versionTexto = p.version ? `<p class="product-version">${p.version}</p>` : '';
    const card = `
      <div class="product-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="product-img">
        <h5>${p.nombre}</h5>
        ${versionTexto}
        <p>₡${p.precio.toLocaleString()}</p>
      </div>`;
    contenedor.insertAdjacentHTML('beforeend', card);
  });
}
// 🟢 Detectar clics en el menú (hasta 4 niveles)
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

    // Cerrar el menú lateral y luego cargar productos
    if (offcanvas) {
      offcanvas.hide();
      setTimeout(() => mostrarProductos(categoria, subcategoria, region, liga), 350);
    } else {
      mostrarProductos(categoria, subcategoria, region, liga);
    }
  }
});
