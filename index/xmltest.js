
        //ESCENA... Y VARIABLES...
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xb0b0b0);

        //crea la cámara cuando abre----
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        var controls; //para modificar los controles
        var material; //declara que va a haber un material (en este caso, el material del objeto a mirar)

        //renderer ...
        const renderer = new THREE.WebGLRenderer({antialias:true}); 
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled=true;
        renderer.shadowMap.type= THREE.PCFSoftShadowMap;


        //variables que se van a usar
        //para las diferentes cosas
        //estas son las luces y el plano que es el suelo...
        var sortc; //luz
        var sortb; //luz 
        var light; //luz
        var plane; //plano del piso

        //este bool es el que define si el objeto tiene la rotación encendida o no...
        var rotAuto = true;
       

        //esto tiene que ver con el material (con el material metálico)
        const fisic ={
            transparent:true,
            opacity: 1,
            wireframe: false,
            wireframelinewidth: .1,
            wireframeLinejoin: 'round',
            wireframeLinecap: 'round',

            clearcoat:1.0,
            clearcoatRoughness:0.1,
            metalness:0.9,
            roughness:0.2,       




            };

            //este es el cargador de objetos
        const loader = new THREE.OBJLoader();
        const loader2 = new THREE.OBJLoader();


            //esto es el material del plano del piso
		const material4 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

            //esto carga una textura (no sé cuál ni por qué) pero es para el material metálico
        const textureLoader= new THREE.TextureLoader();
        const textura= textureLoader.load('https://owltes.s3.sa-east-1.amazonaws.com/java/hdr2.jpg');




        var objectLoaded; //este es el OBJETO -> que va a cargarse de la web
        var selectedObject; //este es el STRING con el nombre del objeto, que se decide en la caja
        var selectedMaterial = 'metalizadoMaterial'; //este es el STRING del material que se decide en la caja
        
        // console.log(selectedObject);

        //variables del XML
        var docXML;
        var nodes;

        // FUNCIÓN EN LA QUE ARRANCA... AGREGA LA INTERFAZ VISUAL¬¬¬¬¬¬¬
        // ooooOOOOOoooooooooooOOOOOOOOOOOOoooOOooooOOOoooooOOOOOOOOOooo
        // oOOooooooOOOOOoooooOOOooOOOOOoooooooOOOOOOOOOOooooooOOOoooooo
        // OOOOOOooooooooooooooooOOOOOOOOOOOOOOOoooooooooooooOOOOOOOOOOO
        // ESTA FUNCIÓN ES LLAMADA POR EL INDEX.HTML, DE ACÁ SALE TODO!!
        function addGUI()
        {

            //CARGA EL XML DE LA WEB
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function()
                {
                if (this.readyState==4 && this.status == 200)
                    {
                    cargarXML(this);
                    }
                }

        //funcionando con xml hosteado...
        xhr.open("GET", "https://owltes.s3.sa-east-1.amazonaws.com/send-xml", true); //la dirección del xml
    

        xhr.send();
    
        //acá declara el STRING que..... se va a usar para cargar las cosas en el dropdown
        let xmlList = "";
    


        //y los datos del xml
        function cargarXML(xml)
        {

            docXML = xml.responseXML;
            nodes = docXML.getElementsByTagName("Nodes"); //levanta los NODOS troncales de la weá
            xmlList = nodes[0].getElementsByTagName("Name")[0].textContent + ": '" + nodes[0].getElementsByTagName("OBJName")[0].textContent + "'"; //el principio del string
            
            for (var i = 1; i < nodes.length; i++) //itera entre los nodos para agregar el contenido al string
            {
                var nName = nodes[i].getElementsByTagName("Name")[0].textContent; //el NOMBRE del dropdown
                var nOBJName = nodes[i].getElementsByTagName("OBJName")[0].textContent; //el NOMBRE del archivo

                var string = nName + ": " + "'" + nOBJName + "'";
                xmlList += ", " + string; //le suma el string confeccionado
    
            }              
             

            //para ver que
            //haya funcionado
            //el string y esté correcto... #WoLoLo
        console.log(xmlList);    


        //ACÁ declara los objetos que van a formar parte de la interfaz interactuable
        //o sea el menú y todo eso


        //STOREA LAS VARIABLES...

        //en este caso, aclara que el dropdown del modelo va a empezar con "Zamba";;;;
        var objgui = {
            Modelo: 'torsion_1',
        }

        //y con el material METALIZADO;;;;
        var objmat = {
            Material: 'metalizadoMaterial'
        }

        //acá crea el botón para reiniciar la cámara
        var buttongui = {Ver: function() {

            resetCamera();
        }};



        //y el checkbox de la autorrotación
        var checkRotation = {
            'Rotate': rotAuto
        }
    

        //Y ACÁ CREA LA INTERFAZA
        

        var gui = new dat.GUI();
        gui.remember(objgui);


        //ACÁ ES UN POCO CONFUSO, PERO LA ONDA
        //ES que como había un STRING único con
        //toda la estructura que tenía que tener 
        //el dropdown para que se cree
        //o sea, las variables y toda esa weá
        //para que funcione, es decir, ingresar el 
        //string como si fueran varios parámetros
        //hubo que usar esta función llamada
        //"eval"
        //que convierte un string en texto directo
        //o sea lo "devuelve" de ser una variable
        //........!!
        //básicamente acá se agrega el dropdown de los modelos
        //dinámicamente extraido del xml que leyó anteriormente
        kelotiro(xmlList);

        function kelotiro(frase)
        {
            var aver ="gui.add(objgui, 'Modelo', {" + frase + "}).onChange( function () {selectedObject = objgui.Modelo;loadNewObject();});"
            eval(aver);
        }



        //acá crea el dropdown de los materiales
        //con el método convencional

        gui.add(objmat, 'Material', {Metalizado: 'metalizadoMaterial', Normal: 'normalMaterial', Gris: 'grisMaterial'}).onChange( function () {

            selectedMaterial = objmat.Material;
            changeMaterial();

        });

        //agrega el botón para reiniciar la cámara
        gui.add(buttongui, 'Ver').name('Reiniciar Cámara');
        //agrega el checkbox de la
        gui.add(checkRotation, 'Rotate').listen().onChange(function () {
            if (rotAuto == true)
            {
                rotAuto = false;
            }
            else
            {
                rotAuto = true;
            }
            changeRotation();
            console.log(rotAuto);
            
        });

        
        //esto no entiendo bien cómo funciona ni para qué está
        //pero si lo sacás colapsa todo
        //así que evidentemente sirve
        //aunque sea una variable declarada 
        //que no interactúa con nada
        //CÓMO SABER
        //................“¯\_(ツ)_/¯“
        var guiControls = new function()
        {
            selectedObject = objgui.Modelo;
        }


        //GENERA LA ESCENA((!!!!!!))


            generateScene3D();
            generateLighting();

        }


    
        ///////////////////////////////////
        /////////////////////////////////////
        
        }
        
        document.body.appendChild( renderer.domElement );




        //FUNCIÓN PARA REINICIAR LA CÁMARA !!!!!
        //reinicia la cámara

        function resetCamera()
        {
            scene.remove(camera);
            controls.dispose();

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

            controls = new THREE.OrbitControls( camera, renderer.domElement );

            controls.update();
            camera.position.x = 10;
            camera.position.z = 120;
            camera.position.y = 30;

            const a = new THREE.Vector3( 0, 35, 0 );
            controls.target = a;

            controls.autoRotate = rotAuto;
            controls.autoRotateSpeed = 0.5;
            // controls.enableDamping=true; 

            camera.add(sortb);
            camera.updateProjectionMatrix();

            scene.add(camera);
        }


        //FUNCIÓN PARA
        //APAGAR Y PRENDER LA ROTACIÓN AUTOMÁTICA
        //####°°##°#°#°#°°°°°°°°########°#°#°°°°#


        function changeRotation()
        {
            controls.dispose();

            controls = new THREE.OrbitControls( camera, renderer.domElement );
            controls.update();
            const a = new THREE.Vector3( 0, 35, 0 );
            controls.target = a;
            controls.autoRotate=rotAuto;
            controls.autoRotateSpeed = 0.5;
            controls.enableDamping=false;  

            scene.add(camera);


            
        }





        //función 
        //para
        //cambiar el
        //MATERIAL!!!!
        

        //ESTA FUNCIÓN también es llamada
        //tanto desde el dropdown como cuando carga
        //un objeto nuevo...
        function changeMaterial()
        {
            
            if (selectedMaterial == 'metalizadoMaterial')
            {

            material = new THREE.MeshPhysicalMaterial(fisic);   

            
            textura.mapping = THREE.EquirectangularReflectionMapping;
            textura.encoding = THREE.sRGBEncoding;
            //scene.background=textura;
            material.envMap = textura;

            }

            if (selectedMaterial == 'grisMaterial')
            {
            material = new THREE.MeshPhysicalMaterial( {color: 0xb8b8b8} );            
            }

            if (selectedMaterial == 'normalMaterial')
            {
                material = new THREE.MeshNormalMaterial({
                    transparent: true,
                    opacity: 1,
                    wireframe: false,
                    wireframelinewidth: .1,
                    wireframeLinejoin: 'round',
                    wireframeLinecap: 'round'
                });
            }

            objectLoaded.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material = material;
                 }
             } );

        }



        //ESTA ES LA FUNCIÓN
        //EN LA QUE SE CREA TODO...
        //YEAH!!!!!!!!!!!
        function generateScene3D()
        {


        var getScale;

        for (var ix = 0; ix < nodes.length; ix++)
        {
        var nNode = nodes.item(ix);
        var eElements = nNode.getElementsByTagName("OBJName")[0];
        console.log(eElements.textContent);
            if (eElements.textContent == selectedObject)
            {
                getScale = nNode.getElementsByTagName("Scale")[0].textContent;
                break;
            }

        }
            

            //crea el plano (o sea el piso) 
        const geometry = new THREE.PlaneGeometry( 500, 500 );
        const material3 = new THREE.ShadowMaterial();
        material3.opacity = 0.2;
        plane = new THREE.Mesh( geometry, material3 );
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        scene.add( plane );

        //CARGA el modelo en cuestión...
        //el LOADER es el OBJ loader (ya declarado antes)
        const test = loader.load(
        'https://owltes.s3.sa-east-1.amazonaws.com/java/Models/' + selectedObject + '.obj',
        	function ( object ) {
                        object.traverse( function( child ) {
                        if ( child instanceof THREE.Mesh ) {
                        child.castShadow=true;
                        child.receiveShadow=true;
                        child.scale.set(getScale,getScale,getScale);
                                }});


        objectLoaded = object; //ACÁ declara que el "OBJECT LOADED" es el objeto en cuestión
        objectLoaded.name = selectedObject;
        

        changeMaterial(); //Y LE ASIGNA EL MATERIAL SELECCIONADO    

 
		scene.add( objectLoaded ); //y lo agrega a la escena
        
	},

    
    
    
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}

    
); //ACÁ TERMINA LA GENERACIÓN DEL OBJETO...	


}

controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();

camera.position.x = 10;    
camera.position.z = 120;
camera.position.y = 30;

const a = new THREE.Vector3( 0, 40, 0 );
controls.target = a;

controls.autoRotate = rotAuto;
controls.autoRotateSpeed = 0.5;

//GENERA LAS LUCES!

function generateLighting()
{
    //scene.add( directionalLight );
const size = 100;
const divisions = 10;

    //luces
    light = new THREE.HemisphereLightProbe( 0xe6fffc , 0xd1d1d1, 0.5 ); // soft white light
    scene.add( light );

    //ESTA LUZ NO SE AGREGA
    const directionalLight = new THREE.SpotLight( 0xffffff, .7,700 );
    directionalLight.position.y= 300;
    directionalLight.position.z= -200;
    //directionalLight.castShadow = true;



    //declarada antes
    sortb = directionalLight.clone(true);
    sortb.intensity=1.2;
    sortb.castShadow = true;
    sortb.position.z=10;
    sortb.position.x=30;
    sortb.position.y=150;
    sortb.shadow.mapSize.width=2048;
    sortb.shadow.mapSize.height=2048;
    scene.add(sortb);
    camera.add(sortb);
    scene.add(camera);

    sortc = directionalLight.clone(true);
    sortc.intensity=0.3;
    sortc.position.z=50;
    sortc.position.x=-200;
    sortc.position.y=150;
    scene.add(sortc);

    const gridHelper = new THREE.GridHelper( size, divisions );
    //scene.add( gridHelper );
    const luzhelper = new THREE.SpotLightHelper(sortb);
    //scene.add(luzhelper);

    function animate() {
        requestAnimationFrame( animate );
        controls.update();
        renderer.render( scene, camera );
    }
    
    
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener('webkitfullscreenchange', onWindowResize);
    function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize( width, height );
    
    
    }
    
    
    
    animate();

    

}

//para que tire un RELOAD del objeto
//o sea cuando cambia el objeto en cuestión

function loadNewObject()
{
    material.dispose();
    scene.remove(objectLoaded);
    scene.remove(plane);

    generateScene3D();
}
