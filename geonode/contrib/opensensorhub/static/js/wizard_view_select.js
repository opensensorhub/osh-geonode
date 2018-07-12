const formTemplates = new Map();
formTemplates.set('chart', '../osh/wizards/chart');
formTemplates.set('video', '../osh/wizards/video');
formTemplates.set('locationmarker', '../osh/wizards/locationmarker');
formTemplates.set('text', '../osh/wizards/text');
formTemplates.set('map', '../osh/wizards/map');


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