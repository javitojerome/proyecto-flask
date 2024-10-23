window.onload = (event) => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    console.log('Carrito al cargar:', carrito);

    // Guardar el carrito en una variable global para poder modificarlo
    window.carrito = carrito;

    // Obtener todos los botones con atributo 'value'
    const botonesConValue = document.querySelectorAll('button[value]');
    // Renderizar el carrito al cargar la página
    renderizarCarrito();
    // Mostrar los botones encontrados
    botonesConValue.forEach(boton => {
        boton.addEventListener("click", () => {
            agregarProducto(boton)
        })

    });

    //login formulario
    let loginForm = document.getElementById("login-form")
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault()
        let email = loginForm[0].value
        let pass = loginForm[1].value
        
        iniciarSesion({
            email:email,
            password:pass
        })

    })
};

function agregarProducto(producto) {
    let info = {
        nombre: producto.id,
        precio: producto.value,
        email: "javier@javier.cl"
    }
    // Agregar el nuevo producto al arreglo carrito
    window.carrito.push(info);

    // Actualizar el localStorage con el nuevo arreglo
    localStorage.setItem('carrito', JSON.stringify(window.carrito));

    // Verificar el cambio en consola
    console.log('Carrito actualizado:', window.carrito);
    renderizarCarrito();
}

// Función para renderizar el carrito en el DOM
function renderizarCarrito() {
    // Obtener el div donde se mostrará el carrito
    const carritoDiv = document.getElementById('carrito-div');
    const carritolen1 = document.getElementById('len-1');
    const carritolen0 = document.getElementById('len-0');

    // Limpiar el contenido previo del div
    carritoDiv.innerHTML = '';

    // Si el carrito está vacío, mostrar un mensaje
    if (window.carrito.length === 0) {
        carritoDiv.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    // Recorrer el carrito y crear un nuevo elemento HTML para cada producto
    window.carrito.forEach((producto, index) => {
        console.log(producto)
        const productoDiv = document.createElement('div');
        productoDiv.innerHTML = `
            <p>${producto.nombre}</p>
            <span class="text-body-secondary" >$ ${producto.precio}</span>
            <button  type="button" class="btn-close" onclick="eliminarProducto(${index})">
           

            
            </button>
        `;
        carritoDiv.appendChild(productoDiv);
        carritolen1.innerHTML = carrito.length
        carritolen0.innerHTML = carrito.length
    });
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    // Eliminar el producto del carrito por su índice
    window.carrito.splice(index, 1);

    // Actualizar el localStorage después de eliminar
    localStorage.setItem('carrito', JSON.stringify(window.carrito));

    // Volver a renderizar el carrito
    renderizarCarrito();
}

function pagar() {

    const carritoEncoded = encodeURIComponent(JSON.stringify(window.carrito));
    window.location.href = `cart.html?carrito=${carritoEncoded}`;
}

function iniciarSesion(data){
    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "email": data.email,
  "password": data.password
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://192.168.1.3:3000/login", requestOptions)
  .then((response) => response.json())
  .then((result) => {
    if(result.mensaje=='incorrecto'){
        console.log("error al iniciar sesion")
    }
    else{
        console.log("ok")
        pagar()
    }
})
  .catch((error) => console.error(error));
}