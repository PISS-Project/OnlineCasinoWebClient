
// Buttons
var btnDeposit = $("#btnDeposit");
var btnDeleteAccount = $("#btnDeleteAccount");
var btnEditProfile = $("#btnEditProfile");
var btnDelete = $("#btnDelete");
var btnEditCancel = $("#btnEditCancel");
var btnChangeCancel = $("#btnChangeCancel");
var btnDeleteCancel = $("#btnDeleteCancel");
var btnDepositCancel = $("#btnDepositCancel");
var btnUpdate = $("#btnUpdate");
var btnAddMoney = $("#btnAddMoney");

// Containers
var profileInfoContainer = $("#profile_info");
var editContainer = $("#edit_profile");
var deleteContainer = $("#delete_profile");
var depositContainer = $("#deposit");

$(document).ready(function () {
    positionDeleteContainer();
    hideAdditionalContainers();
});

function positionDeleteContainer() {
    var profileInfoContainerPosition = profileInfoContainer.position();
    editContainer.css(
        {
            "top": profileInfoContainerPosition.top,
            "left": profileInfoContainerPosition.left
        }
    );

    deleteContainer.css(
        {
            "top": profileInfoContainerPosition.top,
            "left": profileInfoContainerPosition.left
        }
    );

    depositContainer.css(
        {
            "top": profileInfoContainerPosition.top,
            "left": profileInfoContainerPosition.left
        }
    );
}

btnDeposit.click(function () {
    depositContainer.css("visibility", "visible");
    hideUserInfo();
});

btnEditProfile.click(function () {
    editContainer.css("visibility", "visible");
    hideUserInfo();
});

btnDeleteAccount.click(function () {
    deleteContainer.css("visibility", "visible");
    hideUserInfo();
});

btnEditCancel.click(function () {
    editContainer.css("visibility", "hidden");
    showUserInfo();
});

btnChangeCancel.click(function () {
    editContainer.css("visibility", "hidden");
    showUserInfo();
});

btnDeleteCancel.click(function () {
    deleteContainer.css("visibility", "hidden");
    showUserInfo();
});

btnDepositCancel.click(function () {
    depositContainer.css("visibility", "hidden");
    showUserInfo();
});

function showUserInfo() {
    profileInfoContainer.css("visibility", "visible");
}

function hideUserInfo() {
    profileInfoContainer.css("visibility", "hidden");
}

function hideAdditionalContainers() {
    deleteContainer.css("visibility", "hidden");
    editContainer.css("visibility", "hidden");
    depositContainer.css("visibility", "hidden");
}
