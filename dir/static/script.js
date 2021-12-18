const table = document.getElementById("info");
const regex = /[a-zA-Z0-9]/g

let new_name = document.querySelector("#new_name");
let new_OBJname = document.querySelector("#new_OBJname");
let new_scale = document.querySelector("#new_scale");
let edit_name = document.querySelector("#edit_name");
let edit_scale = document.querySelector("#edit_scale");
let delete_name = document.querySelector("#delete_name");

const createNodo_btn = document.querySelector("#createNodo-btn");
const updateNodo_btn = document.querySelector("#updateNodo-btn");
const deleteNode_btn = document.querySelector("#deleteNodo-btn");

const icreateNodo_btn = document.querySelector("#input-newNode-btn");
const ieditNodo_btn = document.querySelector("#input-editNode-btn");
const ideleteNode_btn = document.querySelector("#input-deleteNode-btn");

const sendXml_btn = document.querySelector('#sendFile');

/// Muestra los input \\\
icreateNodo_btn.addEventListener('click', function(){
  showInput(0);
})
ieditNodo_btn.addEventListener('click', function(){
  showInput(1);
})
ideleteNode_btn.addEventListener('click', function(){
  showInput(2);
})

/// Edita y carga los input \\\

function editFunction(name, objname, scale){
  edit_name.value = name;
  document.querySelector('#select-objName').value = objname;
  edit_scale.value = scale;
  showInput(1);
}

function showInput(number){
  let x = document.getElementsByTagName('ul')
  for (let i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
  x[number].style.display = 'block';
}
/////////////////////////

let aXML = new DOMParser();
let xhttp = new XMLHttpRequest();
let newObject;
let nodesId;

function onReadyStateChange(callback) {
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this);

      newObject = xhttp.responseXML;
      nodesId = newObject.getElementsByTagName('Nodes');
    }
  };
};

//// Busca ID disponible dentro del DOM \\\\

function searchId(){
  tbody = document.getElementsByTagName("tr");
  function search(nro) {
    return tbody[nro].getElementsByTagName('td')[1].textContent.split('_')[1];
  }
  cont = 1;
  for (let i = 1; i < tbody.length; i++) {
    if (search(i) != cont) {
    }else cont++, i = 1;
  };
  return cont
};
///////////////////  CARGA LA TABLA DE VALORES  \\\\\\\\\\\\\\\\\\\\\

function loadDoc(callback) {
  onReadyStateChange(callback);
  xhttp.open("GET", "/modelos", true);
  xhttp.send();
};

function xmlFunction(xml) {
  var xmlDoc = xml.responseXML;
  var grid = "<tr><th>Name</th><th>OBJName</th><th>Scale</th><th>Option</th></tr>";
  var x = xmlDoc.getElementsByTagName("Nodes");
  for (var i = 0; i < x.length; i++) {
    grid +=
      "<tr><td>" +
      x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("OBJName")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("Scale")[0].childNodes[0].nodeValue +
      "</td><td><a href='javascript:editFunction(\""+ x[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue +
      "\",\""+ x[i].getElementsByTagName("OBJName")[0].childNodes[0].nodeValue +"\",\""+ x[i].getElementsByTagName("Scale")[0].childNodes[0].nodeValue +"\")'>Editar</a></td></tr>";
  }
  table.innerHTML = grid;
};


///////////////////  CREA <OPTIONS> EN EL HTML  \\\\\\\\\\\\\\\\\\\\\

ieditNodo_btn.addEventListener("click", ()=>{
  let editPage = document.getElementsByTagName("ul")[1];
  let selectOption = document.querySelector('#select-objName');

  editPage.removeChild(selectOption);
  let createSelect = document.createElement("select");
  createSelect.id = "select-objName";
  document.getElementsByTagName("ul")[1].insertBefore(createSelect, document.getElementsByTagName("ul")[1].children[2]);

  tbody = table.tBodies[0]

  for (let i = 1; i < tbody.children.length; i++) {
    var createOption = document.createElement("option");

    createOption.innerText = tbody.children[i].children[1].textContent
    createOption.id = `option_${i-1}`;
    createSelect.appendChild(createOption);
  }
})

ieditNodo_btn.addEventListener("click", ()=>{
  let deletePage = document.getElementsByTagName("ul")[2];
  let selectOption2 = document.querySelector('#select-objName2');

  deletePage.removeChild(selectOption2);
  let createSelect = document.createElement("select");
  createSelect.id = "select-objName2";
  document.getElementsByTagName("ul")[2].insertBefore(createSelect, document.getElementsByTagName("ul")[2].children[2]);

  tbody = table.tBodies[0]

  for (let i = 1; i < tbody.children.length; i++) {
    var createOption = document.createElement("option");

    createOption.innerText = tbody.children[i].children[1].textContent
    createOption.id = `option_${i-1}`;
    createSelect.appendChild(createOption);
  }
})


///////////////////  ALGORITMO PARA AGREGAR NUEVOS NODOS  \\\\\\\\\\\\\\\\\\\\\

createNodo_btn.addEventListener("click", () => {

  if ( new_name.value.match(regex) && ! new_scale.value == '') {
    let nuevoNodo;

    var createRow = document.createElement("tr");
    var createName = document.createElement("td");
    var createObjName = document.createElement("td");
    var createScale = document.createElement("td");
    var td4CreateEdit = document.createElement("td");
    var createEdit = document.createElement("a");
  
    let torsionNumber;
    if (searchId()>99){
      torsionNumber = (`0${searchId()}`).slice(-3)
    } else if (searchId()<100){
      torsionNumber = (`0${searchId()}`).slice(-2)
    } else torsionNumber = (`0${searchId()}`).slice(-4)
  
    createName.innerHTML = new_name.value;
    createObjName.innerHTML = `torsion_${searchId()}`;
    createScale.innerHTML = new_scale.value;
    createEdit.innerText = 'Editar';
  
    createEdit.href = `javascript:edit(${createName,createObjName,createScale})`
    
    createRow.appendChild(createName);
    createRow.appendChild(createObjName);
    createRow.appendChild(createScale);
    td4CreateEdit.appendChild(createEdit);
    createRow.appendChild(td4CreateEdit);
    
    document.querySelector("tbody").appendChild(createRow);

  } else window.alert('Completa todos los formularios y asegurate que no haya caracteres especiales (espacios, guiones, etc)');
}, false);

///////////////////  ALGORITMO PARA EDITAR NODOS  \\\\\\\\\\\\\\\\\\\\\

updateNodo_btn.addEventListener("click", () => {
  if (edit_name.value.match(regex) && ! edit_scale.value == '') {
    tbody = table.tBodies[0]
  
    for (let i = 0; i < tbody.children.length; i++) {
      if (tbody.children[i].children[1].textContent ==  document.querySelector('#select-objName').value) {
        tbody.children[i].children[0].textContent = edit_name.value;
        tbody.children[i].children[2].textContent = edit_scale.value;
      }
    };
  } else window.alert('Completa todos los formularios y asegurate que no haya caracteres especiales (espacios, guiones, etc)');
}, false);

///////////////////  ALGORITMO PARA BORRAR NODOS  \\\\\\\\\\\\\\\\\\\\\


deleteNode_btn.addEventListener("click", () => {
  tbody = table.tBodies[0]

  for (let i = 0; i < tbody.children.length; i++) {
    if (tbody.children[i].children[1].textContent ==  document.querySelector('#select-objName2').value) {
      tbody.removeChild(tbody.children[i])
    }
  }
}, false);


///////////////////  CAPTURAR EL DOM DE LA TABLA  \\\\\\\\\\\\\\\\\\\\\

function tableToJson() {
  tbody = table.tBodies[0]
  let data = {
    "Thumbnails": []
  };

  for (let i = 1; i < tbody.children.length; i++) {
    let x = {Name: `${tbody.children[i].children[0].textContent}`, 
    OBJName: `${tbody.children[i].children[1].textContent}`,
    Scale: `${tbody.children[i].children[2].textContent}`};
    data.Thumbnails.push(x);
  }
  return data
}

///////////////////  ENVIAR JSON A NODEJS  \\\\\\\\\\\\\\\\\\\\\

function sendXml(){

  let http = new XMLHttpRequest();

  http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {

      }
  };


  http.open('POST', '/send-xml', true);
  http.setRequestHeader('Content-Type', 'application/json');
  http.send(JSON.stringify(tableToJson()));
}

sendXml_btn.addEventListener("click", ()=>{
  sendXml();
})

/////////////////// EJECUCCION DE FUNCIONES \\\\\\\\\\\\\\\\\\\\\

loadDoc(xmlFunction);
