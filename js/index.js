const classifier = knnClassifier.create();

const webcamElement = document.getElementById('webcam');

//document.getElementById('add-image').addEventListener('click', () => addImage());

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
    console.log('Loading mobilenet..');

    // Load the model.
    net = await mobilenet.load();
    console.log('Successfully loaded model');

    // Create an object from Tensorflow.js data API which could capture image 
    // from the web camera as Tensor.
    const webcam = await tf.data.webcam(webcamElement);

    // Reads an image from the webcam and associates it with a specific class
    // index.
    const addExample = async classId => {
        // Capture an image from the web camera.
        const img = await webcam.capture();
        //console.log();

        // Get the intermediate activation of MobileNet 'conv_preds' and pass that
        // to the KNN classifier.
        const activation = net.infer(img, 'conv_preds');

        console.log("Added example with classId: "+classId);

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

    document.getElementById('savemodel').addEventListener('click', () => save());

    //document.getElementById('class-c').addEventListener('click', () => addExample(2));

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

app();

function addImage(){
    var dropdown = document.getElementById("drop-down-elem")
    var selectedClass = dropdown.options[dropdown.selectedIndex].value;
    console.log(selectedClass)
}

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
   saveData(jsonStr, 'knnClassifierBarryPotter.json');
 }

 function saveData(text, name) {
  const a = document.createElement('a');
  const type = name.split(".").pop();
  a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
  a.download = name;
  a.click();
}