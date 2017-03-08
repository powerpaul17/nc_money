angular.module('moneyApp')
.service('ModalDialogService', function($uibModal) {

  var ctrl = this;

  var modalDefaults = {
    backdrop: true,
    keyboard: true,
    modalFade: true,
    templateUrl: ''
  };

  var modalOptions = {
    closeButtonText: 'Close',
    actionButtonText: 'Ok',
    headerText: 'Proceed?'
  };

  ctrl.showModal = function(customModalDefaults, customModalOptions) {
    if(!customModalDefaults) {
      customModalDefaults = {};
    }
    customModalDefaults.backdrop = 'static';
    return ctrl.show(customModalDefaults, customModalOptions);
  }

  ctrl.show = function(customModalDefaults, customModalOptions) {
    var tempModalDefaults = {};
    var tempModalOptions = {};
    angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
    angular.extend(tempModalOptions, modalOptions, customModalOptions);
    if(!tempModalDefaults.controller) {
      tempModalDefaults.controller = function($scope, $uibModalInstance) {
        $scope.modalOptions = tempModalOptions;
        $scope.modalOptions.ok = function(result) {
          $uibModalInstance.close(result);
        };
        $scope.modalOptions.close = function(result) {
          $uibModalInstance.dismiss('cancel');
        };
      }
    }
    return $uibModal.open(tempModalDefaults).result;
  };

});
