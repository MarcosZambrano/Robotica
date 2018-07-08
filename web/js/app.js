(function(){
    "use strict";

    angular.module('RoboticaApp',[])
        .controller("RoboticaController", ["$scope", function($scope){
            // Maxima Produccion
            $scope.totalMax = 0;
            // Tiempo de iteracion
            $scope.periodo = 2;
            // Incremnto por iteracion
            $scope.incremento = 2;
            // Total de produccion en almacen 1
            $scope.totalAlmacen = 0;
            // Total de cultivos actuales edificio 1
            $scope.edificio_1 = 0;
            // Opciones de menu
            $scope.opciones = ['Parametrización', 'Procesamiento'];
            // Registro de iteracion
            $scope.registros = [
                //{id:1, demanda:10, producir:2, importar:10, paso:0},
                //{id:2, demanda:10, producir:4, importar:10, paso:0},
                //{id:3, demanda:10, producir:6, importar:10, paso:0},
            ];
            // Registro actual
            $scope.robotica = {id: 0, demanda: 10, producir: 5, importar: 10, paso: 3};

            // Mostrar el formulario modal
            $scope.mostrarModal = function(){
                // Incrementar la iteracion
                $scope.robotica.id = $scope.registros.length + 1;

                // Incrementar la producion segun el periodo de iteracion
                if($scope.registros.length > $scope.periodo - 1) {
                  $scope.robotica.producir = parseInt($scope.robotica.producir) + $scope.incremento;
                }

                $('#registroModal').modal('show');
            }

            // Procesar entrada de datos del modal
            $scope.procesar = function(robotica) {
              cosechar();

              // Crear un nuevo registro
              var record = {
                id: robotica.id,
                demanda: robotica.demanda,
                producir: robotica.producir,
                importar: robotica.importar,
                paso: robotica.paso
              }
              // Agregar el nuevo registro a la vista
              $scope.registros.push(record);

              // Incrementa el scrollTop
              $(".table-scroll tbody").scrollTop($(".table-scroll tbody").offset().top);

              // Ocultar la modal
              $('#registroModal').modal('hide');
            };

            // Realizar proceso de cosecha
            function cosechar() {
              angular.forEach($scope.registros, function(value, key) {
                if(value.paso != -1) {
                  value.paso = parseInt(value.paso) - 1;
                  if(value.paso === 0) {
                    $scope.totalAlmacen = parseInt($scope.totalAlmacen) + parseInt(value.producir);
                    value.paso = -1;
                  }
                }
              });
            }
        }])
})()
