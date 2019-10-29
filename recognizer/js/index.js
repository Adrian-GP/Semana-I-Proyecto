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
  /*let json = localStorage.getItem("knnClassifier_BarryPotter");
  console.log(json);*/

  console.log("try to get json");
  $.getJSON("recognizer/json/knnClassifierBarryPotter.json", function (data) {
    console.log(data);

    let tensorObj = data
    //covert back to tensor
    classifier.setClassifierDataset((tensorObj))


  });


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
      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['Coca Cola', 'Andatti', 'Coca Cola Zero', 'Sabritas', 'Emperador', 'Hersheys', 'Panditas', 'Donitas', 'Maruchan', 'Jumex de Mango'];
      document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${result.confidences[result.label]}
        `;

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