
//Realizado el 5/31/2019

//Variable para mobilnet
let net;

//Variable para webcam
const webcamElement = document.getElementById('webcam');

//Variable para el KNN
const classifier = knnClassifier.create();

//Variable Total para el precio
let total = 0.0;


let flag = true;
var wait = ms => new Promise((r, j) => setTimeout(r, ms))

//Rutina para inicializar webcam
async function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator;
    navigator.getUserMedia = navigator.getUserMedia ||
      navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
      navigatorAny.msGetUserMedia;
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true },
        stream => {
          console.log(webcamElement)
          webcamElement.srcObject = stream;
          webcamElement.addEventListener('loadeddata', () => resolve(), false);
        },
        error => reject());
    } else {
      reject();
    }
  });
}

//Esta función cargara al elemento knn los pesos previamente obtenidos en el trainer. hint: usar función setClassifierDataset
function knnLoad() {
  //can be change to other source
  console.log("Initiation of KNN Load");
  console.log(json);
 
  
}





async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Sucessfully loaded model');

  console.log('Loading Knn-classifier');
  knnLoad();

  console.log('Knn loaded');
  await setupWebcam();

  //Esto se agrego para predecir en cada frame
  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      let k = 10;
      const result = await classifier.predictClass(activation, k);

      //*************************

      //Modifica este bloque de acuerdo a tus productos esto se puso como ejemplo
      // AQUI EMPIEZA
      const classes = ['Heineken', 'Heineken-Light', 'Heineken can', 'Adidas thermos flask', 'Coca-cola', 'Cafe Andatti', 'Background'];
      let precio = 0.0;
      if (result.label == "0") {
        precio = 1.55;
      } else if (result.label == "1") {
        precio = 1.68;
      } else if (result.label == "2") {
        precio = 2.83;
      } else if (result.label == "3") {
        precio = 19.20;
      } else if (result.label == "4") {
        precio = 1.8;
      } else if (result.label == "5") {
        precio = 17.50;
      } else {
        //console.log('Nada');
      }

      if ((result.label == "0") && (result.confidences[result.label] >= 0.7)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image1\" src=\"img/heineken.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/heineken.jpg';
        oferta('Heineken');
        await wait(3000);
        alerta('Heineken', producto, precio);
        await wait(2000);
      } else if ((result.label == "1") && (result.confidences[result.label] >= 0.7)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image2\" src=\"img/light.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/light.jpg';
        alerta('Heineken Light', producto, precio);
        await wait(2000);
      } else if ((result.label == "2") && (result.confidences[result.label] >= 0.7)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image3\" src=\"img/lata.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/lata.jpg';
        alerta('Heineken can', producto, precio);
        await wait(2000);
      } else if ((result.label == "3") && (result.confidences[result.label] >= 0.9)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image4\" src=\"img/adidas.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/adidas.jpg';
        alerta('Adidas thermos flask', producto, precio);
        await wait(2000);
      } else if ((result.label == "4") && (result.confidences[result.label] >= 0.7)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image5\" src=\"img/cocacola.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/cocacola.jpg';
        alerta('Coca-cola', producto, precio);
        await wait(2000);
      } else if ((result.label == "5") && (result.confidences[result.label] >= 0.9)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image5\" src=\"img/andatti.jpg\" />";
        //alert('Producto detectado');
        let producto = 'img/andatti.jpg';
        alerta('Cafe Andatti', producto, precio);
        await wait(2000);
      } else if ((result.label == "6") && (result.confidences[result.label] >= 0.3)) {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${Math.floor(result.confidences[result.label] * 100)}\n
          price:$     ${precio}`;
        document.getElementById("fotos").innerHTML = "<img id=\"image5\" src=\"img/fondo.jpg\" />";
        document.getElementById('total').innerText = `
            Total: $ ${total}`;
      }
      else {
        //console.log('nada');
      }
    }
    // AQUI TERMINA
    //*************************
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
  Swal.fire('Product ' + ' 2 for 1 sale!');
}


//función para lanzar la alerta
function alerta(nombre, producto, precio) {
  //se agrego este if para agregar oferta
  Swal.fire({
    title: 'Item',
    text: "Add this item to your shopping cart?",
    imageUrl: producto,
    imageWidth: 100,
    imageHeight: 120,
    type: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.value) {
      Swal.fire(
        'Ok!',
        'Your product has been added!',
        'success'
      )
      total = total + precio;
      total = toFixed(total, 2);
      document.getElementById('total').innerText = `
      Total: $${total}`;
      var node = document.createElement("li");                 // Create a <li> node
      var textnode = document.createTextNode(nombre);         // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      document.getElementById("items").appendChild(node);     // Append <li> to <ul> with id="myList"
    }
  })
}

app();