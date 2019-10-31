const Swal = require('sweetalert2')

let classes = []
const haveAlert = false;
//Variable para mobilnet
let net;
let products = []
let carrito = {}
// CommonJS
//Variable para webcam
const webcamElement = document.getElementById('webcam');

//Variable para el KNN
const classifier = knnClassifier.create();

//Variable Total para el precio
let total = 0.0;
let time = new Date(99, 11, 24)

let flag = true;
var wait = ms => new Promise((r, j) => setTimeout(r, ms))



//Esta función cargara al elemento knn los pesos previamente obtenidos en el trainer. hint: usar función setClassifierDataset
function knnLoad() {
  //can be change to other source
  console.log("Initiation of KNN Load");
  /*let json = localStorage.getItem("knnClassifier_BarryPotter");
  console.log(json);*/

  console.log("try to get json");
  $.getJSON("recognizer/json/knnClassifier_BarryPotter.json", function (data) {
    console.log(data);

    // let tensorObj = JSON.parse(localStorage.getItem("knnClassifier_BarryPotter"));
    let empty = localStorage.getItem("asdasdasdasdddsa");
    let tensorObj = data;
    Object.keys(tensorObj).forEach((key) => {
      tensorObj[key] = tf.tensor(tensorObj[key], [Math.floor(tensorObj[key].length / 1000), 1024]);
    });
    //covert back to tensor
    console.log(tensorObj);
    classifier.setClassifierDataset(tensorObj)
    /*Swal.fire(
      {
        Title: 'Bien',
        type: 'success',
        html: "Cargó el KNN!"
      }
    )*/
  });

  $.getJSON("recognizer/json/products.json", function (data) {
    products = data.products;
    Object.keys(products).forEach((key) => {
      classes.push(products[key].name)
    });
    console.log(products)
  });



}


function addClass(classNum) {
  console.log(products[classNum])
  console.log(classNum);
  alerta2(products[classNum].name, classNum, products[classNum].price)
}


async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  //document.getElementById('class-coca').addEventListener('click', () => addClass(0));
  //document.getElementById('class-andatti').addEventListener('click', () => addClass(1));

  console.log('Sucessfully loaded model');

  console.log('Loading Knn-classifier');
  knnLoad();

  console.log('Knn loaded');
  const webcam = await tf.data.webcam(webcamElement);

  //Esto se agrego para predecir en cada frame
  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation, 5);
      console.log(classes);
      document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${result.confidences[result.label]}
        `;
      await wait(200);
      if (result.confidences[result.label] > 0.7 && classes[result.label] != "Background") {
        addClass(result.label);
        await wait(2500);
      }

      // Dispose the tensor to release the memory.
      img.dispose();
    }

    await tf.nextFrame();
  }
}


function predict() {
  console.log('Predict');
}
/* Esto es por si se quiere predecir por boton
async function predict() {
  console.log('Entro al evento del boton')
  const activation = net.infer(webcamElement, 'conv_preds');
  console.log('despues de activación');
  const result = await classifier.predictClass(activation);
  const classes = ['HEINEKEN', 'HEINEKEN LIGHT','HEINEKEN LATA','TERMO ADIDAS'];
  document.getElementById('console').innerText = `
    prediction: ${classes[result.label]}\n
    probability: ${result.confidences[result.label]}
  `;
}*/
function toFixed(num, fixed) {
  fixed = fixed || 0;
  fixed = Math.pow(10, fixed);
  return Math.floor(num * fixed) / fixed;
}

//función para agregar oferta a un producto
function oferta(nombre) {
  swal.fire('Product ' + ' 2 for 1 sale!');
}


//función para lanzar la alerta
function alerta(nombre, producto, precio) {
  //se agrego este if para agregar oferta
  Swal.fire({
    title: nombre,
    text: "¿Desea añadir este producto a su carrito?",
    type: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Ok!',
        'Your product has been added!',
        'success'
      )
      document.getElementById('total').innerText = `
      Total: $${total}`;
      var node = document.createElement("li");                 // Create a <li> node
      var textnode = document.createTextNode(nombre);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      document.getElementById("items").appendChild(node);     // Append <li> to <ul> with id="myList"
    }
  })
}

//función para lanzar la alerta
function alerta2(nombre, producto, precio) {
  //se agrego este if para agregar oferta
  console.log("Leyó un producto de nombre: " + nombre);
  if (haveAlert) {
    Swal.fire({
      title: nombre,
      text: "¿Desea añadir este producto a su carrito?",
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Ok!',
          'Your product has been added!',
          'success'
        )
        if (!carrito[producto]) {
          carrito[producto] = { name: nombre, price: precio, quantity: 1 }
        }
        else {
          carrito[producto].quantity++;
        }
        generateTable();
      }
    })
  }
  else {
    console.log("No hay alert, pero se encontró el producto: "+nombre);
    if (!carrito[producto]) {
      carrito[producto] = { name: nombre, price: precio, quantity: 1 }
    }
    else {
      carrito[producto].quantity++;
    }
    generateTable();
  }
}


function generateTable() {
  let newTableRows = "";
  console.log("Carrito:");
  console.log(carrito);
  total = 0;
  table = document.getElementById('productId').innerHTML = ""
  Object.keys(carrito).forEach((key) => {
    total += carrito[key].price * carrito[key].quantity;
    newTableRows += "<tr><th>" + parseInt((parseInt(key) + 1)) + "</th><td>" + carrito[key].name + "</td><td>$ " + carrito[key].price.toFixed(2) + "</td><td>" + carrito[key].quantity + "</td><td><button type=\"button\" class=\"btn btn-secondary\" id=\"increase-" + key + "\">+</button><button type=\"button\" class=\"btn btn-secondary\" id=\"decrease-" + key + "\">-</button>" + "</td><td><button type=\"button\" class=\"btn btn-danger\" id=\"delete-" + key + "\">X</button></td></tr>";
  });
  console.log(newTableRows);
  //table.innerHTML = newTableRows;
  newTableRows += "<tr><th></th><td>Total de la orden:</td><td></td><td></td><td>$" + total.toFixed(2) + "</td><td></td></tr>";
  $("#productId").append(newTableRows);

  Object.keys(carrito).forEach((key) => {
    document.getElementById('increase-' + key).addEventListener('click', () => changeQuantity(key, true));
    document.getElementById('decrease-' + key).addEventListener('click', () => changeQuantity(key, false));
    document.getElementById('delete-' + key).addEventListener('click', () => deleteCarrito(key));
  });
}

function recalculateTotal() {

}

function deleteCarrito(key) {
  delete carrito[key]
  generateTable();
}
function changeQuantity(key, DecIn) {
  if (DecIn) {
    carrito[key].quantity++;
    generateTable();
  }
  else if (!DecIn && carrito[key].quantity > 1) {
    carrito[key].quantity--;
    generateTable()
  }
}
app();
