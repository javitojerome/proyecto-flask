

// Ejecutar la función cuando la página cargue
window.onload = ()=>{
    
    const params = new URLSearchParams(window.location.search); // Obtener los parámetros de la URL
    const carrito = params.get('carrito'); // Obtener el parámetro 'carrito'
    // Decodificar el carrito y mostrarlo en el DOM
    console.log(carrito)
    if (carrito) {
        const carritoDecodificado = JSON.parse(decodeURIComponent(carrito));
        let productos = document.getElementById('productos')

        carritoDecodificado.forEach(producto => {
            // Creamos un nuevo elemento <tr>
            const nuevaFila = document.createElement('tr');
            
            // Creamos el contenido HTML que irá dentro de <tr> para este producto
            nuevaFila.innerHTML = `
              <td scope="row" class="py-4">
                <div class="cart-info d-flex flex-wrap align-items-center ">
                  <div class="col-lg-9">
                    <div class="card-detail ps-3">
                      <h5 class="card-title">
                        <a href="#" class="text-decoration-none">${producto.nombre}</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-4 align-middle">
                <div class="total-price">
                  <span class="secondary-font fw-medium">${producto.precio}</span>
                </div>
              </td>
            `;
            
            // Añadimos la nueva fila al <tbody>
            productos.appendChild(nuevaFila);

        let total = document.getElementById("total")
        let sumaprecio=0;
        for(let i=0; i<carritoDecodificado.length;i++){
            let valor =  parseInt(carritoDecodificado[i].precio)
            sumaprecio+=valor
        }
        total.innerHTML = sumaprecio
        window.sumaprecios=sumaprecio
        });
    }

    document.getElementById("purchase").addEventListener("click", ()=>{
        crearCompra("javier@javier.cl",window.sumaprecios)
    })

}


function crearCompra(email, precio){
    console.log(email,precio)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      "total_price": precio,
      "person_email": email,
      "address": "ismael tocornal 9570 san ramon"
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    fetch("http://192.168.1.3:3000/purchase", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        alert(result.mensaje)
        const data = encodeURIComponent(JSON.stringify(result.data));
        window.location.href = `perfil.html?ddata=${data}`;
    
    })
      .catch((error) => console.error(error));
}