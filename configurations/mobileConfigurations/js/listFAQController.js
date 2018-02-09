/* global result */

(function () {
    "use strict";
    angular.module('faq').registerCtrl('ListFAQController', ListFAQController);
    ListFAQController.$inject = ['$scope', 'errorHandlingService', 'popup',
        'faqService', 'uiGridConstants', '$filter','deleteService','message'];
    function ListFAQController($scope, errorHandlingService, popup,
            faqService, uiGridConstants, $filter,deleteService,message) {
        console.log("hello");
        $scope.init = function () {
            $scope.tooltipTrigger = "mouseenter";
            $scope.editRedirection = false;
            $scope.getListCount();
            $scope.firstTime = true;
            if ($scope.firstTime)
                $scope.getFAQs();
            else
                $scope.getFAQs($scope.defaultPageSize);
        };
        $scope.getListCount = function () {
            faqService.getFAQCount().then(
                    getCountSuccess, errorHandlingService.handleError);
            function getCountSuccess(count) {
                $scope.faqRequestOptions.totalItems = count.data.property;
            }
        };
        $scope.getTableHeight = function () {
            var rowHeight = 60; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.faqRequestOptions.data.length * rowHeight + headerHeight) + "px"
            };
        };
        $scope.getFAQs = function (newPageSize) {
            $scope.showSpinner = true;
            faqService.
                    getAllFAQs(60,$scope.faqRequestOptions.paginationCurrentPage, "ASC", newPageSize).then(
                    getSubData, errorHandlingService.handleError).
                    finally(hideSpinner);
            function getSubData(result) {
                result.FAQList.then(successCallBack, errorHandlingService.handleError);
                function successCallBack(result) {
                    $scope.faqRequestOptions.data = result.data;
                }
                $scope.userInfo = result.userInfo;
                if ($scope.firstTime)
                    $scope.defaultPageSize = $scope.userInfo.pageSize;
                $scope.firstTime = false;
                if (newPageSize === undefined || newPageSize === null)
                    $scope.faqRequestOptions.paginationPageSize = $scope.userInfo.pageSize;

                if ($scope.faqRequestOptions.paginationPageSizes.indexOf($scope.userInfo.pageSize) === -1) {
                    $scope.faqRequestOptions.paginationPageSizes.push($scope.userInfo.pageSize);
                    $scope.faqRequestOptions.paginationPageSizes = $filter('orderBy')($scope.faqRequestOptions.paginationPageSizes);
                }
            }
            function hideSpinner() {
                $scope.showSpinner = false;
            }
        };
        $scope.deletePopup = function (entity) {
            deleteService.checkDelete(entity, 'faqService', 'getFAQById', 'id').then(callbackFn);
            function callbackFn(result) {
                if (!result) {
                    message.showMessage('error',"{{ 'ERROR_USERS' | translate}}");
                    okCallBackFn();
                } else {
                    popup.show("sm", 'configurations/mobileConfigurations/html/deleteFAQ.html', 'DeleteFAQController', entity)
                            .then(okCallBackFn);

                }
            }
            function okCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.editPopup = function (entity) {
//            deleteService.checkDelete(entity, 'buildingService', 'getBuildingById', 'buildingId', true).then(callbackFn);
//            function callbackFn(result) {
//                if (!result) {
//                    message.showMessage('error', "{{ 'ERROR_BUILD' | translate}}");
//                    okCallBackFn();
//                } else {
//                    Object.assign(entity, result);
//                    popup.show("lg", 'configuration/html/editFAQ.html', 'EditFAQController', entity)
//                            .then(okCallBackFn);
////                }
////            }
//            function okCallBackFn(result) {
//                $scope.initList();
//            }
            
            
            popup.show("lg", 'configurations/mobileConfigurations/html/editFAQ.html', 'EditFAQController',entity)
                    .then(editCallBackFn);
            function editCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.addPopup = function () {
            popup.show("lg", 'configurations/mobileConfigurations/html/addFAQ.html', 'AddFAQController')
                    .then(addCallBackFn);
            function addCallBackFn(result) {
                $scope.init();
            }
        };
        $scope.faqRequestOptions = {
            rowHeight: 60,
            enableColumnResizing: true,
            paginationCurrentPage: 1,
            enableColumnMenus: false,
            enableSorting: true,
            enableRowHeaderSelection: false,
            enableRowSelection: false,
            paginationPageSize: 0,
            paginationPageSizes: [25, 50, 100],
            useExternalPagination: true,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {field: 'requestStatus', displayName: 'FREQ_ASK_QUES', headerCellFilter: 'translate', minWidth: 130, cellTemplate: '<div class="ui-grid-cell-contents"><p><b>{{ row.entity.question }}</b></p><p>{{ row.entity.answer }}</p></div>'},
                {name: ' ', displayName: 'ACTIONS', headerCellFilter: 'translate', enableColumnResizing: false, enableSorting: false, width: 100, cellTemplate: '<a authorized-block privilege-name="editfaq" class="actions-icons" ng-click="grid.appScope.editPopup(row.entity)">' +
                    '<span class="fa fa-pencil"  popover-append-to-body="true" uib-popover="{{\'EDIT\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>' +
                    ' <a authorized-block privilege-name="editfaq" class="actions-icons" ng-click="grid.appScope.deletePopup(row.entity)">' +
                    '<span class="fa fa-trash" popover-append-to-body="true"  uib-popover="{{\'DELETE\'|translate}}" popover-trigger="grid.appScope.tooltipTrigger" popover-placement="{{ \'LEFT\' | translate}}"></span></a>'}
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.pagination.on.paginationChanged($scope, getNewPage);
                function getNewPage(newPage, pageSize) {
                    console.log(pageSize);
                    if ($scope.faqRequestOptions.paginationPageSize !== $scope.defaultPageSize) {
                        $scope.defaultPageSize = $scope.faqRequestOptions.paginationPageSize;
                        $scope.faqRequestOptions.paginationCurrentPage = 1;
                    } else {
                        $scope.faqRequestOptions.paginationCurrentPage = newPage;
                    }
                    $scope.getFAQs(pageSize);

                }
            }
        };

        $scope.init();
    }
}());