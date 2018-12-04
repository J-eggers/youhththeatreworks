/**
* EasyHTTP Library
* Library for making HTTP requests 
*
* @version 2.0.0
* @author Brad Traversy
* @license MIT
*
**/

class EasyHTTP {
	//Make an HTTP Get Request
	async get(url) {
		const response = await fetch(url);
		const resData = await response.json();
		return resData;
	}

	//make and HTTP POST Request
	 async post(url, data) {

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const resData = await response.json();
		return resData;
	}

	//make and HTTP PUT Request
	async put(url, data) {

		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		const resData = await response.json();
		return resData;

	}
			

	//Make an HTTP DElELTE Requeset 
	async delete(url) {
		const response = await fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json'
			}
		});
		const resData = await 'Resource Deleted...';
		return resData;

	}

}