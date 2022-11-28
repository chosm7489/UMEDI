//---------------------------------------------------
// Loads the parts of skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('../text/nav.html'));
    console.log($('#footerPlaceholder').load('../text/footer.html'));
}
loadSkeleton();  //invoke the function
