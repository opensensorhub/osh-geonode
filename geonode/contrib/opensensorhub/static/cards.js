let cardTransitionTime = 500;

let $card = $('.js-card')
let switching = false

$('#btn').click(flipCard)

function flipCard () {
    if (switching) {
        return false
    }
    switching = true

    $card.toggleClass('is-switched')
    window.setTimeout(function () {
        $card.children().children().toggleClass('is-active')
        switching = false
    }, cardTransitionTime / 2)
}
