(function () {
    "use strict";
    angular.module('app').config(routing);
    routing.$inject = ['$stateProvider', '$urlRouterProvider'];
    function routing($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise(otherWise);
        function otherWise($injector, $location) {
            $injector.invoke(['$state', '$cookies', function ($state, $cookies) {
                    var token = $cookies.get('refreshToken');
                    if (token === null || token === undefined || token === {}) {
                        $state.go('login');
                    } else {
                        $state.go("404");
                    }
                }]);
        }

        $stateProvider
                .state('admin', {
                    url: '',
                    abstract: true,
                    views: {
                        'header': {
                            templateUrl: 'commons/html/header.html',
                            controller: 'HeaderController'
                        },
                        'nav': {
                            templateUrl: 'commons/html/nav.html',
                            controller: 'MenuController'
                        },
                        'footer': {
                            templateUrl: 'commons/html/footer.html',
                            controller: 'FooterController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.listemployee', {
                    url: "/listemployee",
                    views: {
                        'container@': {
                            templateUrl: 'employee/html/listEmployee.html',
                            controller: 'ListEmployeeController'
                        }
                    },
                    privilege: 'listemployee'
                })
                .state('admin.faq', {
                    url: "/FAQ",
                    views: {
                        'container@': {
                            templateUrl: 'faq/html/listFAQ.html',
                            controller: 'ListFAQController'
                        }
                    },
                    privilege: 'listfaq'
                })
                .state('admin.dashboard', {
                    url: "/dashboard",
                    views: {
                        'container@': {
                            templateUrl: 'dashboard/html/mainDashboard.html',
                            controller: 'DashboardController'
                        }
                    },
                    privilege: 'dashboard'
                })
                .state('admin.start', {
                    url: "",
                    views: {
                        'container@': {
                            templateUrl: 'dashboard/html/mainDashboard.html',
                            controller: 'DashboardController'
                        }
                    },
                    privilege: 'dashboard'
                })
                .state('admin.viewprofile', {
                    url: "/viewprofile",
                    views: {
                        'container@': {
                            templateUrl: 'profile/html/viewProfile.html',
                            controller: 'ViewProfileController'
                        }
                    },
                    privilege: 'profile'
                })
                .state('admin.listpackages', {
                    url: "/listpackages",
                    views: {
                        'container@': {
                            templateUrl: 'package/html/listPackages.html',
                            controller: 'ListPackagesController'
                        }
                    },
                    privilege: 'listpackages'
                })
                .state('admin.listpackages.packagedetails', {
                    url: "/packagedetails/:requestId",
                    views: {
                        'container@': {
                            templateUrl: 'package/html/packageDetails.html',
                            controller: 'PackageDetailsController'
                        }
                    },
                    privilege: 'listpackages'
                })
                .state('admin.listvehicle', {
                    url: "/listvehicle",
                    views: {
                        'container@': {
                            templateUrl: 'vehicle/html/listVehicle.html',
                            controller: 'ListVehicleController'
                        }
                    },
                    privilege: 'listvehicle'
                })
                .state('admin.listbuilding', {
                    url: "/listbuilding",
                    views: {
                        'container@': {
                            templateUrl: 'building/html/listBuilding.html',
                            controller: 'ListBuildingController'
                        }
                    },
                    privilege: 'listbuilding'
                })
                .state('admin.listondemand', {
                    url: "/listondemand",
                    views: {
                        'container@': {
                            templateUrl: 'request/html/listOnDemand.html',
                            controller: 'ListOnDemandController'
                        }
                    },
                    privilege: 'listondemand'
                })
                .state('admin.listonschedule', {
                    url: "/listonschedule",
                    views: {
                        'container@': {
                            templateUrl: 'request/html/listOnSchedule.html',
                            controller: 'ListOnScheduleController'
                        }
                    },
                    privilege: 'listonschedule'
                })
                .state('admin.config', {
                    url: "/config",
                    views: {
                        'container@': {
                            templateUrl: 'configuration/html/configuration.html',
                            controller: 'ConfigurationController'
                        }
                    },
                    privilege: 'config'
                })
                .state('admin.calendar', {
                    url: "/calendar",
                    views: {
                        'container@': {
                            templateUrl: 'configuration/html/calendar.html',
                            controller: 'CalendarController'
                        }
                    },
                    privilege: 'viewcalendar'
                })
                .state('admin.vehicleview', {
                    url: "/vehicleview",
                    views: {
                        'container@': {
                            templateUrl: 'maps/html/vehicleView.html',
                            controller: 'VehicleViewController'
                        }
                    },
                    privilege: 'vehicleview'
                })
                .state('admin.operationcenter', {
                    url: "/operationcenter",
                    views: {
                        'container@': {
                            templateUrl: 'maps/html/operationCenter.html',
                            controller: 'OperationCenterController'
                        }
                    },
                    privilege: 'operationcenter'
                })
                .state('login', {
                    url: "/login",
                    views: {
                        'container@': {
                            templateUrl: 'login/html/login.html',
                            controller: 'LoginController'
                        }
                    },
                    privilege: ''
                })
                .state('forgotPassword', {
                    url: "/forgotPassword",
                    views: {
                        'container@': {
                            templateUrl: 'forgotPassword/html/forgotPassword.html',
                            controller: 'ForgotPasswordController'
                        }
                    },
                    privilege: ''
                })
                .state('resetForgottenPassword', {
                    url: "/resetForgottenPassword/:code",
                    views: {
                        'container@': {
                            templateUrl: 'forgotPassword/html/resetForgottenPassword.html',
                            controller: 'ResetForgottenPasswordController'
                        }
                    },
                    privilege: ''
                })
                .state('404', {
                    url: "/404",
                    views: {
                        'container@': {
                            templateUrl: 'commons/html/404.html'
                        }
                    }
                })
                .state('admin.401', {
                    url: "/401",
                    views: {
                        'container@': {
                            templateUrl: 'commons/html/401.html'
                        }
                    },
                    privilege: ''
                })
                .state('admin.listonschedule.scheduledetails', {
                    url: "/scheduledetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'request/html/scheduleDetails.html',
                            controller: 'ScheduleDetailsController'
                        }
                    },
                    privilege: 'listonschedule'
                })
                .state('admin.listondemand.ondemanddetails', {
                    url: "/ondemanddetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'request/html/onDemandDetails.html',
                            controller: 'OnDemandDetailsController'
                        }
                    },
                    privilege: 'listondemand'
                })
                .state('admin.requestdetails', {
                    url: "/requestdetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'request/html/requestDetails.html',
                            controller: 'RequestDetailsController'
                        }
                    },
                    privilege: 'listonschedule'
                })
                .state('admin.listcustomer', {
                    url: "/listcustomer",
                    views: {
                        'container@': {
                            templateUrl: 'customer/html/listCustomer.html',
                            controller: 'ListCustomerController'
                        }
                    },
                    privilege: 'listcustomer'
                })
                .state('admin.listcustomer.customerdetails', {
                    url: "/customerdetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'customer/html/customerDetails.html',
                            controller: 'CustomerDetailsController'
                        }
                    },
                    privilege: 'listcustomer'
                })
                .state('admin.historyrequest', {
                    url: "/listarchivedpickups",
                    views: {
                        'container@': {
                            templateUrl: 'archived/html/archivedPickups.html',
                            controller: 'ArchivedPickupsController'
                        }
                    },
                    privilege: 'viewarchivedpickuprequests'
                })
                .state('admin.historyrequestdetails', {
                    url: "/archivedpickupsdetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'archived/html/archivedPickupsDetails.html',
                            controller: 'archivedPickupsDetailsController'
                        }
                    },
                    privilege: 'viewarchivedpickuprequests'
                })
                .state('admin.listroles', {
                    url: "/listroles",
                    views: {
                        'container@': {
                            templateUrl: 'roles/html/listRoles.html',
                            controller: 'ListRoleController'
                        }
                    },
                    privilege: 'listroles'
                })
                .state('admin.listroles.addroles', {
                    url: "/addroles",
                    views: {
                        'container@': {
                            templateUrl: 'roles/html/addRole.html',
                            controller: 'AddRoleController'
                        }
                    },
                    privilege: 'addeditroles'
                })
                .state('admin.listroles.editroles', {
                    url: "/editroles/:roleid",
                    views: {
                        'container@': {
                            templateUrl: 'roles/html/editRole.html',
                            controller: 'EditRoleController'
                        }
                    },
                    privilege: 'addeditroles'
                })
                .state('admin.listdevices', {
                    url: "/listdevices",
                    views: {
                        'container@': {
                            templateUrl: 'devices/html/listDevices.html',
                            controller: 'ListDeviceController'
                        }
                    },
                    privilege: 'listdevices'
                })
                .state('admin.assignvehicles', {
                    url: "/listactivevehicles",
                    views: {
                        'container@': {
                            templateUrl: 'activeVehicles/html/listActiveVehicles.html',
                            controller: 'ListActiveVehiclesController'
                        }
                    },
                    privilege: 'listactivevehicles'
                })
                .state('admin.distribute', {
                    url: "/distribute",
                    views: {
                        'container@': {
                            templateProvider: ['$templateFactory', 'distributionMode', 'isTodaysPlanExist', 'isHubExists', 'userInfoService',
                                function ($templateFactory, distributionMode, isTodaysPlanExist, isHubExists, userInfoService) {
                                    var finalPath;
                                    var baseFilePath = 'distribution/html/';
                                    if (isHubExists) {
                                        finalPath = path(distributionMode, isTodaysPlanExist);
                                    } else {
                                        if (userInfoService.isSuperUser()) {
                                            finalPath = baseFilePath.concat("hubSelection.html");
                                        } else {
                                            finalPath = path(distributionMode, isTodaysPlanExist);
                                        }
                                    }

                                    function path(distributionMode, isTodaysPlanExist) {
                                        if (distributionMode.value === 1) {
                                            return baseFilePath.concat("viewPlan.html");
                                        } else {
                                            if (isTodaysPlanExist.checkPlanExist) {
                                                return baseFilePath.concat("viewPlan.html");
                                            } else {
                                                return baseFilePath.concat("jobDistribution.html");
                                            }
                                        }
                                    }

                                    return $templateFactory.fromUrl(finalPath);
                                }],
                            controllerProvider: ['isTodaysPlanExist', 'distributionMode', 'isHubExists', 'userInfoService',
                                function (isTodaysPlanExist, distributionMode, isHubExists, userInfoService) {

                                    if (isHubExists) {
                                        return returnedController();
                                    } else {
                                        if (userInfoService.isSuperUser()) {
                                            return "HubSelectionController";
                                        } else {
                                            return returnedController();
                                        }
                                    }

                                    function returnedController() {
                                        if (distributionMode.value === 1) {
                                            return "ViewPlanController";
                                        } else {
                                            if (isTodaysPlanExist.checkPlanExist) {
                                                return "ViewPlanController";
                                            } else {
                                                return "JobDistributionController";
                                            }
                                        }
                                    }

                                }]
                        }
                    },
                    resolve: {
                        isHubExists: ['$stateParams', function ($stateParams) {
                                if ($stateParams.hubId) {
                                    return true;
                                }
                                return false;
                            }],
                        isTodaysPlanExist: ['distributionService', '$stateParams', 'userInfoService', function (distributionService, $stateParams, userInfoService) {
                                if ($stateParams.hubId || !userInfoService.isSuperUser()) {
                                    return distributionService.checkPlanForToday($stateParams.hubId).then(planForTodayCallBack);
                                }
                                function planForTodayCallBack(result) {
                                    return result.data;
                                }

                            }],
                        distributionMode: ['configurationService', '$stateParams', 'userInfoService', function (configurationService, $stateParams, userInfoService) {
                                if ($stateParams.hubId || !userInfoService.isSuperUser()) {
                                    return configurationService.getConfigById(14, $stateParams.hubId).then(configCallBack);
                                }
                                function configCallBack(result) {
                                    return result.data;
                                }
                            }]

                    },
                    params: {hubId: ""},
                    privilege: 'listactiveorders'
                })
                .state('admin.loading', {
                    url: "/loading",
                    views: {
                        'container@': {
                            templateUrl: 'distribution/html/loadingJobs.html',
                            controller: 'LoadingJobsController'
                        }
                    },
                    privilege: 'viewloading'
                })
                .state('admin.listactiveorders', {
                    url: "/listactiveorders",
                    views: {
                        'container@': {
                            templateUrl: 'activeOrders/html/listActiveOrders.html',
                            controller: 'ListActiveOrderController'
                        }
                    },
                    privilege: 'listactiveorders'
                })
                .state('admin.listactiveorders.orderdetails', {
                    url: "/orderdetails/:id/:type",
                    views: {
                        'container@': {
                            templateUrl: 'activeOrders/html/activeOrderDetails.html',
                            controller: 'ActiveOrderDetailsController'
                        }
                    },
                    privilege: 'listactiveorders'
                })
                .state('admin.deliveryrequests', {
                    url: "/deliveryrequests",
                    views: {
                        'container@': {
                            templateUrl: 'deliveryRequests/html/listDeliveryRequests.html',
                            controller: 'ListDeliveryRequestController'
                        }
                    },
                    privilege: 'listdeliveries'
                })
                .state('admin.deliveryrequests.deliverydetails', {
                    url: "/deliverydetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'deliveryRequests/html/deliveryDetails.html',
                            controller: 'DeliveryDetailsController'
                        }
                    },
                    privilege: 'listdeliveries'
                })
                .state('admin.listoffloading', {
                    url: "/listoffloading",
                    views: {
                        'container@': {
                            templateUrl: 'offloading/html/listOffloading.html',
                            controller: 'ListOffloadingController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.listreturns', {
                    url: "/listreturnrequests",
                    views: {
                        'container@': {
                            templateUrl: 'returnRequest/html/listReturnRequest.html',
                            controller: 'ListReturnRequestController'
                        }
                    },
                    privilege: 'listreturns'
                })
                .state('admin.listreturns.returndetails', {
                    url: "/returndetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'returnRequest/html/returnRequestDetails.html',
                            controller: 'ReturnRequestDetailsController'
                        }
                    },
                    privilege: 'listreturns'
                })
                .state('admin.deliveryrequests.rescheduledeliverydetails', {
                    url: "/rescheduledeliverydetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'deliveryRequests/html/rescheduleDeliveryDetails.html',
                            controller: 'RescheduleDeliveryDetailsController'
                        }
                    },
                    privilege: 'editdeliveries'
                })
                .state('verifyEmail', {
                    url: "/verifyEmail?token",
                    views: {
                        'container@': {
                            templateUrl: 'profile/html/verifiedEmail.html',
                            controller: 'VerifiedEmailController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.listfreelancers', {
                    url: "/listfreelancers",
                    views: {
                        'container@': {
                            templateUrl: 'freelancer/html/listFreelancerRequests.html',
                            controller: 'ListFreelancerRequestsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.listfreelancers.freelancerdetails', {
                    url: "/freelancerdetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'freelancer/html/freelancerDetails.html',
                            controller: 'FreelancerDetailsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.buildingconfig', {
                    url: "/buildingconfigurations",
                    views: {
                        'container@': {
                            templateUrl: 'configurations/buildingConfigurations/html/buildingConfigurations.html',
                            controller: 'buildingConfigurationsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.systemconfig', {
                    url: "/systemconfigurations",
                    views: {
                        'container@': {
                            templateUrl: 'configurations/systemConfigurations/html/systemConfigurations.html',
                            controller: 'systemConfigurationsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.mobileconfig', {
                    url: "/mobileconfigurations",
                    views: {
                        'container@': {
                            templateUrl: 'configurations/mobileConfigurations/html/mobileConfigurations.html',
                            controller: 'mobileConfigurationsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.archiveddelivery', {
                    url: "/listarchiveddelivery",
                    views: {
                        'container@': {
                            templateUrl: 'archived/html/archivedDelivery.html',
                            controller: 'archivedDeliveryController'
                        }
                    },
                    privilege: 'viewarchieveddeliveryrequests'
                })
                .state('admin.archiveddelivery.archiveddeliverydetails', {
                    url: "/archiveddeliverydetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'archived/html/archivedDeliveryDetails.html',
                            controller: 'archivedDeliveryDetailsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.archivedreturn', {
                    url: "/listarchivedreturn",
                    views: {
                        'container@': {
                            templateUrl: 'archived/html/archivedReturns.html',
                            controller: 'archivedReturnsController'
                        }
                    },
                    privilege: 'viewarchievedreturnrequests'
                })
                .state('admin.archivedreturn.archivedreturndetails', {
                    url: "/archivedreturndetails/:id",
                    views: {
                        'container@': {
                            templateUrl: 'archived/html/archivedReturnsDetails.html',
                            controller: 'archivedReturnsDetailsController'
                        }
                    },
                    privilege: ''
                })
                .state('admin.500', {
                    url: "/500",
                    views: {
                        'container@': {
                            templateUrl: 'commons/html/500.html'
                        }
                    },
                    privilege: ''
                });


    }
}());
