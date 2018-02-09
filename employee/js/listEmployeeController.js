(function () {
    "use strict";

    angular.module('employee').registerCtrl('ListEmployeeController', ListEmployeeController);
    ListEmployeeController.$inject = ['$scope', 'employeeService', 'uiGridConstants', 'popup', '$filter', 'message',
        'deleteService', '$window', 'errorHandlingService', 'authorizationService','userInfoService'];

    function ListEmployeeController($scope, employeeService, uiGridConstants, popup, $filter, message,
            deleteService, $window, errorHandlingService, authorizationService,userInfoService) {

        $window.onfocus = function () {
            // if ($scope.gridApi.selection.getSelectedGridRows().length === 0)
                $scope.initList();
        };
        $scope.firstTime = true;
        //popup events***************************
        $scope.filterValue = "";
        $scope.addPopup = function () {
            $scope.popupOpened = true;
            popup.show("lg", 'employee/html/addEmployee.html', 'AddEmployeeController', {})
                    .then(okCallBackFn);

            function okCallBackFn(result) {
                $scope.popupOpened = false;
                $scope.initList();
            }
        };

        $scope.editPopup = function (row) {
            var record = {employee:row};
            deleteService.checkDelete(record, 'employeeService', 'getEmployeeById', 'employee', true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error', "{{ 'ERROR_USER' | translate}}");
                    okCallBackFn();
                } else {
                    console.log(result);
                    Object.assign(row, result);
                    $scope.popupOpened = true;
                    popup.show("lg", 'employee/html/editEmployee.html', 'EditEmployeeController', row)
                            .then(okCallBackFn);

                }
            }
            function okCallBackFn(result) {
                $scope.popupOpened = false;
                $scope.initList();
            }
        };

        // $scope.deletePopup = function (row) {
        //     deleteService.checkDelete(row, 'employeeService', 'getEmployeeById', 'userId').then(callbackFn);
        //     function callbackFn(result) {
        //         if (!result) {
        //             message.showMessage('error', "{{ 'ERROR_USERS' | translate}}");
        //             okCallBackFn();
        //         } else {
        //             $scope.popupOpened = true;
        //             popup.show("sm", 'employee/html/deleteEmployee.html', 'DeleteEmployeeController', row)
        //                     .then(okCallBackFn);
        //
        //         }
        //     }
        //     function okCallBackFn(result) {
        //         $scope.initList();
        //         $scope.popupOpened = false;
        //     }
        // };

        $scope.changeActiveStatus = function(row){
            var record = {employee : row};
            if(row.enabled){
                row.userEntityStatus="ACTIVE";
            }else{
                row.userEntityStatus="INACTIVE";
            }
            deleteService.checkDelete(record, 'employeeService',
                'getEmployeeById', 'employee',"",true).then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    $scope.initList();
                    message.showMessage('error', "{{ 'ERROR_USERS' | translate}}");
                } else {
                    deleteService.checkDelete(record, 'employeeService', 'checkDriverRelation', 'employee',"",true).then(callbackFn);
                }
                function callbackFn(result) {
                    if (!result) {
                        message.showMessage('error', "{{ 'ERROR_DRIVER_WITH_VEH' | translate}}");
                        $scope.cancel();
                    } else {
                        var request = deleteService.deleteRecord(false, record, 'employeeService', 'deleteEmployee', 'employee');
                        request.then(successFn, errorHandlingService.handleError)
                    }
                    function successFn(result) {
                        message.showMessage('success', "{{ 'EMP_STATUS_CHAN_SUCC' | translate}}");
                        $scope.initList();
                    }
                    function errorFn(error) {
                        message.showMessage('error', "{{ 'EMP_STATUS_NOT_CHAN_SUCC' | translate}}");
                        errorHandlingService.handleError(error);
                        $scope.initList();
                    }
                }


            }

        };

        // $scope.setRolePopup = function (row) {
        //     if ($scope.checkDriverAssignRole(row)) {
        //         $scope.popupOpened = true;
        //         popup.show("md", 'employee/html/setRoleEmployee.html', 'SetRoleController', row)
        //                 .then(okCallBackFn);
        //     } else {
        //         $scope.clearAll();
        //     }
        //     function okCallBackFn(result) {
        //         $scope.popupOpened = false;
        //         $scope.initList();
        //     }
        // };
        //end popup events**************************
        $scope.checkDriverAssignRole = function (row) {
            for (var i in row) {
                if (row[i].entity.userType == "DRIVER") {
                    message.showMessage('error', "{{ 'ERR_ASSIGN_DRI' | translate}}");
                    return false;
                }
            }
            return true;
        };
        $scope.initList = function () {
            $scope.popupOpened = false;
            $scope.tooltipTrigger = "mouseenter";
            $scope.getListCount();
            if ($scope.firstTime)
                $scope.getListData();
            else
                $scope.getListData($scope.defaultPageSize);
            $scope.show = false;
        };

        $scope.getListCount = function () {
            employeeService.getEmployeeCount($scope.filterValue).then(getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.count = count.data.property;
                $scope.empListOptions.totalItems = $scope.count;
            }
        };
        $scope.getListData = function (newPageSize) {
            $scope.showSpinner = true;
            employeeService.listEmployees($scope.empListOptions.paginationCurrentPage, "DESC", newPageSize, $scope.filterValue)
                    .then(getDataSub, errorHandlingService.handleError).finally(hideSpinner);
            function getDataSub(data)
            {
                if (data) {
                    if (data.hasOwnProperty('employees')) {
                        data.employees.then(getEmployeeSuccess, errorHandlingService.handleError);
                    }
                    $scope.userInfo = data.userInfo;
                    if ($scope.firstTime)
                        $scope.defaultPageSize = $scope.userInfo.pageSize;
                    $scope.firstTime = false;
                    if (newPageSize === undefined || newPageSize === null)
                        $scope.empListOptions.paginationPageSize = $scope.userInfo.pageSize;
                    if ($scope.empListOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                        $scope.empListOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                        $scope.empListOptions.paginationPageSizes = $filter('orderBy')($scope.empListOptions.paginationPageSizes);
                    }
                }
                function getEmployeeSuccess(employees) {
                    $scope.empListOptions.data = employees.data;
                }

            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.getTableHeight = function () {
            var rowHeight = 40; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.empListOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        // $scope.setRole = function () {
        //     if ($scope.gridApi.selection.getSelectedGridRows().length > 0)
        //         $scope.setRolePopup($scope.gridApi.selection.getSelectedGridRows());
        // };
        // $scope.clearAll = function () {
        //     $scope.gridApi.selection.clearSelectedRows();
        //     $scope.selectionStatus();
        // };
        // $scope.deleteSelected = function () {
        //     if ($scope.gridApi.selection.getSelectedGridRows().length > 0)
        //         $scope.deletePopup($scope.gridApi.selection.getSelectedGridRows());
        // };
        // $scope.selectionStatus = function () {
        //     $scope.show = $scope.gridApi.selection.getSelectedGridRows().length > 0;
        //     if ($scope.gridApi.selection.getSelectedGridRows().length === 0)
        //         $scope.initList();
        // };
        $scope.filter = function (temp) {
            $scope.filterValue = temp;
            console.log($scope.empListOptions);
            $scope.initList();
            // $scope.gridApi.grid.refresh();
        };
        $scope.empListOptions = {
            rowHeight: 40,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableRowSelection: false,
            enableSelectAll: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'userId', displayName: 'UDER_ID', headerCellFilter: 'translate', minWidth: 113, maxWidth: 500},
                {field: 'hubNames', displayName: 'BUILDING_NAME', headerCellFilter: 'translate', minWidth: 150, maxWidth: 300,visible:userInfoService.isSuperUser()},
                {field: 'username', displayName: 'FULL_NAME', headerCellFilter: 'translate', minWidth: 350, maxWidth: 500},
                {field: 'phone', displayName: ' MOBILE_NUMBER', headerCellFilter: 'translate', minWidth: 110, maxWidth: 500},
                {field: 'email', displayName: 'EMAIL_ADDRESS', headerCellFilter: 'translate', minWidth: 250, maxWidth: 500},
                {field: 'userType', displayName: 'USER_TYPE', headerCellFilter: 'translate', minWidth: 85, maxWidth: 500,cellFilter:'translate'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', minWidth: 100, enableColumnResizing: false, enableSorting: false, width: 100, enableFiltering: false,
                    cellTemplate: '<a class="actions-icons" id="editInListEmployeeBtn" ng-click="grid.appScope.editPopup(row.entity)" ng-if="row.entity.enabled"  authorized-block privilege-name="addeditemployee">' +
                            '<span class="fa fa-pencil" popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a> '
                },
                {name: 'enabled', displayName: 'ACTIVATION', headerCellFilter: 'translate', minWidth: 100, width: 100, enableSorting: false, cellTemplate: '<div authorized-block privilege-name="deleteemployee" class="switch"><input  id="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}" ng-model="row.entity.enabled" ng-change="grid.appScope.changeActiveStatus(row.entity)" ng-checked="{{row.entity.enabled}}" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="{{grid.renderContainers.body.visibleRowCache.indexOf(row)}}"></label></div>'}

                            // '<a class="actions-icons" id="deleteInListEmployeeBtn" ng-click="grid.appScope.deletePopup(row.entity)" authorized-block privilege-name="deleteemployee">' +
                            // '<span class="fa fa-trash" popover-append-to-body="true" uib-popover="{{\'DELETE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    if ($scope.empListOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.empListOptions.paginationPageSize;
                        $scope.empListOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.empListOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getListData(pageSize);
                    // $scope.clearAll();
                }
                // gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);
                // gridApi.selection.on.rowSelectionChanged($scope, $scope.selectionStatus);
            },
            // isRowSelectable: function (row) {
            //     return authorizationService.hasRole('deleteemployee');
            // }
        };
        $scope.initList();
    }
}());