(function () {
    "use strict";

    angular.module('utilitiesModule').service('deleteService', deleteService);
    deleteService.$inject = ['$injector', 'message', '$q', 'errorHandlingService'];
    function deleteService($injector, message, $q, errorHandlingService) {
        var delete_service = {
            checkDelete: checkDelete,
            deleteRecord: deleteRecord,
            deactivate:deactivate
        };
        return delete_service;

        var service;
        var sentData;
        var sentAttributeId;
        function checkDelete(data, serviceName, serviceFindById, attributeId,editMode,refuseDeletion) {
            service = $injector.get(serviceName)[serviceFindById];
            sentData = data;
            sentAttributeId = attributeId;
            if (Array.isArray(sentData)) {
                return checkArray(service, sentData, attributeId,data).then(successFn, errorFn);
            } else {
                return checkSingle(service, sentData, attributeId,editMode,data);
            }

            function successFn(result) {
                if (result < sentData.length && result > 0) {
                    if(refuseDeletion){
                        return false;
                    }
                    else{
                        message.showMessage('warn',"{{ 'GENERAL_DEL_ERROR' | translate}}");
                        return true;
                    }
                } else if (result === sentData.length) {
                    return true;
                } else {
                    return false;
                }
            }

            function errorFn(reason) {
                return false;
            }

        }

        function checkArray(service, data, attributeId,additionalRow) {
            var deferred = $q.defer();
            var count = 0;
            var index = 0;
            service(data[count]['entity'][attributeId],additionalRow[index]['entity']).then(exist, notExist);
            function exist(result) {
                count++;
                index++;
                itterator(index, count);

            }
            function notExist(reason) {
                index++;
                itterator(index, count);
            }
            function itterator(index, count) {
                if (index < data.length) {
                    service(data[index]['entity'][attributeId],additionalRow[index]['entity']).then(exist, notExist);
                } else {
                    deferred.resolve(count);
                }
            }
            return deferred.promise;
        }

        function checkSingle(service, data, attributeId,editMode,additionalRow) {
            var deferred = $q.defer();
            service(data[attributeId],additionalRow).then(
                    function (res) {
                        if(editMode)
                            deferred.resolve(res.data);
                        else
                            deferred.resolve(true);
                    },
                    function (reason) {
                        if(reason.status==500){
                            errorHandlingService.handleError(reason);
                            deferred.reject(false);
                        }
                        deferred.resolve(false);
                    });

            return deferred.promise;
        }

        function deleteRecord(isArray, row, serviceName, deleteService,sentAttributeId) {
            var i;
            var deferred = $q.defer();
            service = $injector.get(serviceName)[deleteService];
            if (isArray) {
                for (var i = 0; i < row.length; i++) {
                    service(row[i]['entity'][sentAttributeId],row[i]['entity']).then(deleteSuccess, deleteError);
                }
            } else {
                service(row[sentAttributeId],row).then(deleteSuccess, deleteError);
            }
            function deleteSuccess() {
                deferred.resolve(true);
            }
            function deleteError(result) {
                if(result.status==500){
                    errorHandlingService.handleError(result);
                    deferred.reject(false);
                }
                else if(result.status==400){
                    deferred.reject(result);
                }
               else deferred.resolve(false);
            }
            return deferred.promise;
        }
        function deactivate(data,serviceName,deActivateService){
            var promises = [];
            service = $injector.get(serviceName)[deActivateService];
            for(var i in data){
                var promise= service(data[i]['entity']);
                promises.push(promise);
            }
            return $q.all(promises);
        }

    }
}());