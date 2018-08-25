(function(){
    "use strict";

    angular.module('RoboticaApp',[])
        .controller("RoboticaController", ["$scope", function($scope){

    /*****************************************************************
     * Variables Iniciales
    ******************************************************************/
    $scope.paramProduct ={
      name:"Aguacate",     // Nombre del producto
      cultivateInit:"5",   // Cantidad inicial a cutivar
      importInit:"10",     // Cantidad inicial a importar|
      period:"2",          // Tiempo de espera para cosechar
      maximum:"100",       // Maxima Produccion
      unit:"3",            // Unidad base del producto
      color:"2",           // Color que identifica al producto
      potition:8           // paginacion
    };

    /*****************************************************************
     * Ventana Inicial: Variables - metodos
    ******************************************************************/
      // Tab actual
      $scope.tab = 1;

      // Avance de la tabla
      $scope.potition = 8;

      // Mostrar/ocultar boton de procesamiento
      $scope.showButton = true;

      // Bandera para mostrar los legos
      $scope.showProduct = false;

      // Bandera para iniciar procesamiento
      $scope.showInitButton = true;

      // Permite manejo -tabs- de la vista principal
      $scope.setTab = function(newTab){
        $scope.tab = newTab;
      };

      $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
      };

      /*****************************************************************/

      /*****************************************************************
       * Ventana Parametrizacion: Variables - metodos
      ******************************************************************/
      // Lista de colores disponibles
      $scope.colors =[
        {id:0,value:'Seleccione'},
        {id:1,value:'Brown'},
        {id:2,value:'Green'},
        {id:3,value:'Red'},
        {id:4,value:'White'}
      ]

      // Lista de unidades disponibles
      $scope.units =[
        {id:0,value:'Seleccione',abrev:''},
        {id:1,value:'Cajas',abrev:'C'},
        {id:2,value:'Kilos',abrev:'Kg'},
        {id:3,value:'Litros',abrev:'Li'},
        {id:4,value:'Toneladas',abrev:'Ton.'},
        {id:5,value:'Unidades',abrev:'Un.'},
      ]

      $scope.paramProduct.unit  = $scope.units[$scope.paramProduct.unit];
      $scope.paramProduct.color = $scope.colors[$scope.paramProduct.color];
      $scope.labelStore = $scope.paramProduct.unit.value;

      /*****************************************************************/

      /*****************************************************************
       * Ventana Procesamiento: Variables - metodos
      ******************************************************************/

      // Maxima Produccion
      $scope.totalMaximum = 0;

      // Total de produccion en almacen 1
      $scope.totalStore = 0;

      // Total de cultivos actuales edificio 1
      $scope.edificio_1 = 0;

      // Registro de iteracion
      $scope.records = [
        //  {id:1, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:2, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:3, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:4, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:5, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:6, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:7, consume:10, xCultivate:2, xImport:10, step:0},
        //  {id:8, consume:10, xCultivate:2, xImport:10, step:0},
      ];

      // Registro actual
      $scope.iteration = {
        id: 0,
        consume: parseInt(10),
        xCultivate: parseInt($scope.paramProduct.cultivateInit),
        xImport: parseInt($scope.paramProduct.importInit),
        step: parseInt($scope.paramProduct.period)
      };

      // Cantidad de producto a cultivar
      $scope.xCultivate = 0;

      // Cantidad de producto en cultivo
      $scope.cultivating = 0;

      /**
        * Permite mostrar la ventana modal para ingresar datos a procesar
      */
      $scope.showModal = function(){

        // Incrementar la iteracion
        $scope.iteration.id = $scope.records.length + 1;

        // Incrementar la producion segun el periodo de iteracion
        if($scope.records.length > $scope.paramProduct.period - 1) {
          $scope.iteration.xCultivate = parseInt($scope.iteration.xCultivate) + parseInt($scope.paramProduct.period);
        }

        $('#recordModal').modal('show');
      }

      /**
        * Permite procesar entrada de datos del modal
      */
      $scope.process = function(iteration) {
        var totalStoreActual = angular.copy($scope.totalStore);

        // Cosechar el producto
        var totalStoreTemp = produce();

        // Crear un nuevo registro
        var record = {
          id: parseInt(iteration.id),
          consume: parseInt(iteration.consume),
          xCultivate: parseInt(iteration.xCultivate),
          xImport: parseInt(iteration.xImport),
          step: parseInt(iteration.step)
        }

        $scope.labelStore = " => [ " + totalStoreActual +
                            " Almacenado + " + record.xImport +
                            " Importado + " +  totalStoreTemp +
                            " Cosechas - " + record.consume +
                            " Consumos ]";

        // Productos a cultivar
        $scope.xCultivate = parseInt(record.xCultivate);

        // Agregar el nuevo registro a la vista
        $scope.records.push(record);

        // Ocultar la modal
        $('#recordModal').modal('hide');

        lego($scope.paramProduct.color.value);

        $scope.pageAhead();

        $scope.showButton = false;

        cultivate();


      };

      /**
        * Permite realizar proceso de cosechar
      */
      function produce() {
        var totalStoreTemp = 0;
        angular.forEach($scope.records, function(value, key) {
          if(value.step != -1) {
            value.step = parseInt(value.step) - 1;
            if(value.step === 0) {
              totalStoreTemp = parseInt(value.xCultivate)
              $scope.totalStore = parseInt($scope.totalStore) + totalStoreTemp;
              $scope.cultivating -= totalStoreTemp;
              value.paso = -1;
            }
          }
        });
        return totalStoreTemp;
      };

      /**
        * Permite asignar valores de lego-producto, edificios y almacen
      */
      function lego(color) {
        $scope.showProduct = true;
        angular.element('.square').css("background-color", color);
      }

      /**
        * Permite realizar el proceso de mover los robots para cultivar
      */
      function cultivate() {
          var intX = 100;
          var objDiv = document.getElementById('progress');
          objDiv.innerHTML = $scope.xCultivate + " " + $scope.paramProduct.unit.abrev;
          objDiv.style.background = $scope.paramProduct.color.value;
          objDiv.style.color = "black";
          objDiv.style.position = "absolute";
          objDiv.style.width = "10%";
          objDiv.style.height = "5%";
          objDiv.setAttribute("align", "center");

		  if($scope.xCultivate !== 0){
			move();
		  } else {
			  objDiv.innerHTML = "";
                objDiv.style.background ="";
                $scope.cultivating +=  parseInt($scope.xCultivate);
                $scope.xCultivate = 0;
                $scope.labelStore = "";
                $scope.showButton = true;
                $scope.$apply();
		  }

          function move() {
            var objDiv = document.getElementById('progress');
            if ( objDiv != null ) {
                objDiv.style.left = (intX += 3).toString() + 'px';
            } //if
            if ( intX < 650 ) {
                setTimeout(move,30);
            } else {
                objDiv.innerHTML = "";
                objDiv.style.background ="";
                $scope.cultivating +=  parseInt($scope.xCultivate);
                $scope.xCultivate = 0;
                $scope.labelStore = "";
                $scope.showButton = true;
                $scope.$apply();
            }

            return true;
          }
        }

        $scope.pageAhead = function() {
      		if($scope.records.length > $scope.potition) {
      			 $scope.potition +=$scope.paramProduct.potition;
      		}
      	};

      	$scope.pageBehind = function() {
      		if( $scope.potition > $scope.paramProduct.potition ) {
      			 $scope.potition -=$scope.paramProduct.potition;
      		}
      	};


        $scope.initProcess = function() {
          $scope.showInitButton = false;
          $scope.labelStore = $scope.paramProduct.unit.value;
          $scope.iteration.xCultivate = $scope.paramProduct.cultivateInit;
          $scope.iteration.xImport = $scope.paramProduct.importInit;
          $scope.tab = 3;
        }

    }]);
})()
