const formTemplates = new Map();
formTemplates.set('chart', '../wizards/chart');
formTemplates.set('video', '../wizards/video');
formTemplates.set('locationmarker', '../wizards/locationmarker');
formTemplates.set('text', '../wizards/text');
formTemplates.set('map', '../wizards/map');


window.onload = function () {
    console.log("URL: " + window.location.href);
};

function directToViewWizard(event) {
    console.log('Button Clicked');
    let selector = document.getElementById('view-selector');
    let selectedView = selector.options[selector.selectedIndex].value;
    console.log(selectedView);


    console.log("URL Relative: " + (window.location.href = formTemplates.get(selectedView)));
}