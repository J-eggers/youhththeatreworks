
const UISelectors = {
    itemList: '#item-group'
};
//Remove 


//User interface 
const http = new EasyHTTP

const itemAddClick = function(e){
    if(e.target.classList.contains('add-item')){
        //Get the id of the list item
        const listID = e.target.parentNode.parentNode.id;
        const listID2 = e.target.parentNode.parentNode.id;
        console.log(listID);
        console.log('1');
        onclick="form.submit();"
    
        
        //Updating Users
       // http.put(`/users/register/${listID}`, listID)
           // .then(data => console.log(data))
           // .catch(err =>console.log(err));

        //Updating Cast
        //http.put(`/shows/register/${show.id}`, listID)
           // .then(data => console.log(shows))
            //.catch(err =>console.log(err))

        //Contiune if it went right 

            //Remove the add-item class and add the remove-item Class

        //Change the color by adding class


    }
    e.preventDefault();
}
const itemcRemoveClick = function(e){
    if(e.target.classList.contains('remove-item')){
        //Get the id of the list item
        const listID = e.target.parentNode.parentNode.id;
        

        //Make http Request to Update User Registred and Cast
        //if err something went wrond 
        //Contiune if it went right 

        //Remove the add-item class and add the remove-item Class

        //Change the color of back by removing class


    }
    e.preventDefault();
}

document.querySelector(UISelectors.itemList).addEventListener('click', itemAddClick);


//