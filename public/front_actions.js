$(document.readyState(function(){
    $('email-form').on('submit',function(e){
        console.log('hi')
        e.preventDefault();
    })
}))