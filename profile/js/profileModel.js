(function () {
    "use strict";

    angular.module('profile', ['passwordStrength']).factory('profileService', profileService);
    profileService.$inject = ['$http', 'absoluteURL', 'downloadURL'];
    function profileService($http, absoluteURL, downloadURL) {

        var profile_service = {
            getProfileDetails: getProfileDetails,
            getImageById: getImageById,
            editProfile: editProfile,
            changePassword: changePassword,
            getPrivileges: getPrivileges,
            getAllPrivileges: getAllPrivileges,
            verify: verify,
            updateEmail: updateEmail
        };
        return profile_service;

        function verify(tokenObj) {
            return $http.post(absoluteURL + '/employee/verifyUpdatedEmail', {"code":tokenObj});
        }
        function updateEmail(email) {
            return $http.post(absoluteURL + '/employee/updateEmail', {"email": email});
        }
        function editProfile(profileObj) {
            return $http.post(absoluteURL + '/employee/updateprofile', profileObj);
        }
        function getProfileDetails() {
            return $http.post(absoluteURL + '/employee/profile');
        }
        function getImageById(imageId) {
            return $http.get(downloadURL + "/file/find/" + imageId);
        }
        function changePassword(passwordObj) {
            return $http.post(absoluteURL + '/employee/updateuserpassword', passwordObj);
        }
        function getPrivileges(employeeId) {
            return $http.post(absoluteURL + "/privilege/role/findByUserId", {userId: employeeId});
        }
        function getAllPrivileges() {
            return $http.post(absoluteURL + '/privilege/privilege/findAll');
        }
    }
}());