//= wrapped

angular.module('streama').controller('adminCertificationsCtrl', [
  'apiService', '$state', '$rootScope', '$filter', 'modalService', function (apiService, $state, $rootScope, $filter, modalService) {
    var vm = this;

    vm.addCertification = addCertification;
    vm.importCertifications = importCertifications;
    vm.deleteCertification = deleteCertification;
    vm.editCertification = editCertification;

    apiService.certifications.list().then(function (response){
      vm.certifications = response.data;
    });


    function addCertification(){
      modalService.certificationModal().then(function (data){
        apiService.certifications.create(data).then(function (response) {
          alertify.success('The Certification was created.');
          vm.certifications.push(response.data);
        });
      });
    }
    function editCertification(certification){
      modalService.certificationModal(certification).then(function (data){
        apiService.certifications.update(data).then(function (response) {
          alertify.success('The Certification was updated.');
          angular.extend(certification, response.data);
        });
      });
    }

    function importCertifications(type){
      apiService.certifications.import(type).then(function (response) {
        alertify.success(response.data.length + 'Certifications were imported.');
        $state.reload();
        // vm.certifications.push(response.data);
      });
    }

    function deleteCertification(id){
      alertify.set({ buttonReverse: true, labels: {ok: "Yes", cancel : "Cancel"}});
      alertify.confirm("Are you sure, you want to delete this Certification?", function (confirmed) {
        if(confirmed){
          apiService.certifications.delete(id).then(function () {
            _.remove(vm.certifications, {id: id});
          }, function (){
            alertify.error('Certification is probably used in a video / tvShow or liked by a user. Delete all usages first, then try again.')
          });
        }
      })
    }

  }]);


