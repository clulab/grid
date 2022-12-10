import {useEffect, useState} from "react";


export default function InputBox({text, onKeyPress, apiUrl}){
    const [textInput, setTextInput] = useState([]);


    function toHex(string) {
        var array = [];
        for (var i = 0; i < string.length; i++)
            array[i] = ("000" + string.charCodeAt(i).toString(16)).slice(-4);
        return array.join("");
    }

	  return (
	    <div className={"InputBox"}>
	      <input style={{height:"3em", width:"100%", fontSize:'20px', border: '1.5px solid #90c5e1'}}
	      onKeyPress={
      	     (evt) => {
     	        if (evt.key === "Enter") {
     	        	let text = toHex(evt.target.value);
     	        	if (evt.target.value.length > 0){
				        fetch(`${apiUrl}/textInput/${text}`)
				            .then( response => response.json())
				            .then( response => {console.log(response);
				                console.log(response);
				                onKeyPress(response);
				                        })
				            .then(evt.target.value = '')
				            .then(evt.target.blur())
		               }
	           }
	           }
           } 
           placeholder=" Create new column "
           />
	    </div>
	  );
}