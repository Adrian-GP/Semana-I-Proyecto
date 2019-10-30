const classifier = knnClassifier.create();

const webcamElement = document.getElementById('webcam');

let net;


// Función de app para predicción de imágenes.
/*
async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const imgEl = document.getElementById('img');
  const result = await net.classify(imgEl);
  console.log(result);
}*/

// Función de app para predicciones únicamente con MobileNet
/*
async function app() {
    console.log('Loading mobilenet..');

    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    // Create an object from Tensorflow.js data API which could capture image
    // from the web camera as Tensor.
    const webcam = await tf.data.webcam(webcamElement);
    while (true) {
      const img = await webcam.capture();
      const result = await net.classify(img);

      document.getElementById('console').innerText = `
        prediction: ${result[0].className}\n
        probability: ${result[0].probability}
      `;
      // Dispose the tensor to release the memory.
      img.dispose();

      // Give some breathing room by waiting for the next animation frame to
      // fire.
      await tf.nextFrame();
    }
  }*/

async function app() {
  const webcam = await tf.data.webcam(webcamElement);

  console.log('Loading mobilenet..');
  // Load the model.
  net = await mobilenet.load({
    version: 1,
    alpha: 1.0
  })
  console.log('Loading KNN..');
  if(localStorage.getItem("knnClassifier_BarryPotter")!=null){
    let tensorObj = JSON.parse(localStorage.getItem("knnClassifier_BarryPotter"));
    Object.keys(tensorObj).forEach((key) => {
      tensorObj[key] = tf.tensor(tensorObj[key], [Math.floor(tensorObj[key].length / 1000), 1024]);
    });
    //covert back to tensor
    classifier.setClassifierDataset(tensorObj)
    console.log("Retrieved something.");
  }
  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API which could capture image
  // from the web camera as Tensor.

  var picReader = new FileReader();

  if (window.File && window.FileList && window.FileReader) {
    console.log("Entro");
    $('#add-images').on("change", function (event) {
      console.log("Entro2");
      var files = event.target.files; //FileList object
      var output = document.getElementById("result");
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.match('image.*')) {
          if (this.files[i].size < 2097152) {
            picReader = new FileReader();
            picReader.readAsDataURL(file);
            //var arrayBufferView = new Uint8Array(picReader.readas);
            //var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
            console.log(typeof (picReader));
            //addExampleFromFile("0",picReader.result)
            picReader.onloadend = function () {
              var image = new Image();
              image.src = picReader.result;
              image.width = 1280;
              image.height = 720;
              processedImage = tf.browser.fromPixels(image);
              var dropdown = document.getElementById("drop-down-elem")
              var selectedClass = dropdown.options[dropdown.selectedIndex].value;
              addExampleFromFile(selectedClass, processedImage)
              //console.log(picReader.result);
            }
          }
          else {
            alert("Image Size is too big. Minimum size is 2MB.");
          }
        }
        else {
          alert("You can only upload image file.");
        }
      }
    });
  }
  else {
    console.log("Your browser does not support File API");
  }

  const addExampleFromFile = async (classId, img) => {
    // Capture an image from the web camera.


    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(img, 'conv_preds');
    console.log(classId, img);
    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
  };
  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = async classId => {
    // Capture an image from the web camera.
    const img = await webcam.capture();
    //console.log();

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = net.infer(img, 'conv_preds');

    console.log("Added example with classId: " + classId);
    //console.log(img);

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId);

    // Dispose the tensor to release the memory.
    img.dispose();
  };

  // When clicking a button, add an example for that class.
  //document.getElementById('class-b').addEventListener('click', () => addExample(1));
  document.getElementById('class-coca').addEventListener('click', () => addExample(0));
  document.getElementById('class-andatti').addEventListener('click', () => addExample(1));
  document.getElementById('class-coca-zero').addEventListener('click', () => addExample(2));
  document.getElementById('class-sabritas').addEventListener('click', () => addExample(3));
  document.getElementById('class-emperador').addEventListener('click', () => addExample(4));
  document.getElementById('class-hersheys').addEventListener('click', () => addExample(5));
  document.getElementById('class-panditas').addEventListener('click', () => addExample(6));
  document.getElementById('class-donitas').addEventListener('click', () => addExample(7));
  document.getElementById('class-maruchan').addEventListener('click', () => addExample(8));
  document.getElementById('class-jumex').addEventListener('click', () => addExample(9));
  document.getElementById('class-background').addEventListener('click', () => addExample(10));

  document.getElementById('savemodel').addEventListener('click', () => save());

  //document.getElementById('class-c').addEventListener('click', () => addExample(2));

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidences from the classifier module.
      const result = await classifier.predictClass(activation);

      const classes = ['Coca Cola', 'Andatti', 'Coca Cola Zero', 'Sabritas', 'Emperador', 'Hersheys', 'Panditas', 'Donitas', 'Maruchan', 'Jumex de Mango', 'Background'];
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

app();




function save() {
  //Aqui va tu codigo
  dataset = classifier.getClassifierDataset();
  //
  var datasetObj = {}
  Object.keys(dataset).forEach((key) => {
    let data = dataset[key].dataSync();
    datasetObj[key] = Array.from(data);
  });
  let jsonStr = JSON.stringify(datasetObj);
  localStorage.setItem("knnClassifier_BarryPotter", jsonStr);
  saveData(jsonStr, 'knnClassifier_BarryPotter.json');
}

function saveData(text, name) {
  const a = document.createElement('a');
  const type = name.split(".").pop();
  a.href = URL.createObjectURL(new Blob([text], { type: `text/${type === "txt" ? "plain" : type}` }));
  a.download = name;
  a.click();
}

function resizeImage(image){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    img = new Image();
    img.addEventListener('load', function () {
      ctx.drawImage(this, 0, 0, 600, 400);
      return ctx.getImageData();
    });
}
