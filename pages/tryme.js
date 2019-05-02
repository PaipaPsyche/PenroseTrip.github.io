var acc_keys=["C9UHCO9HO9NOTMC","RrjFdVdthRDfNJb","hK6O9OSBGNVMNSh"];

function check_key(KEY){
	var is = false;
	for(var i = 0;i<acc_keys.length;i++){
		if(acc_keys[i]==KEY){
			is = true;
		}
	}
	return is;

}




function check_user(){
	var keylen=15;
	var master="abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRTSUVWXYZ".split("");
	var ml=master.length;
	var name = document.getElementById("cu_name").value;
	var ctr = document.getElementById("cu_ctr").value;
	var l = ctr.length;

	if(l!=4){
	document.getElementById("cu_output").innerHTML = "La contraseña no es valida.";
	}

	else{

		var NAME=(name.concat(ctr,name,ctr,name,ctr,name,name,ctr)).split("").slice(0,keylen);
		var CTR=ctr.split("");
		var asig=((CTR[0]*CTR[1])+CTR[2]);
		var iter = (((CTR[1]*CTR[3])-CTR[2])%(keylen))+CTR[0];

		var ANS=[];
		var sumaN=0;


		for (var h =0;h<NAME.length;h++){
			NAME[h]=NAME[h].charCodeAt(0)%ml;
			sumaN=sumaN+NAME[h];
		}


		for (var k = 0; k < keylen; k++ )  {
			var esta=NAME[k];
			for (var j = 0;  j<iter; j++) {
				esta=(esta+asig+k+j+name.length+sumaN)%ml;
			}

			ANS.push(master[esta]);
		}
		var ans=ANS.join("");
		console.log(ans,acc_keys);

		if (check_key(ans)){

			setVisible_personal();
			document.getElementById("cu_output").innerHTML = "KEY ***********"+ans.split("").slice(-4).join("")+" for ".concat(name);
		}




}
}






function generar_key_usuario(){
	var keylen=15;
	var master="abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRTSUVWXYZ".split("");
	var ml=master.length;
	var name = document.getElementById("kg_name").value;
	var ctr = document.getElementById("kg_ctr").value;
	var l = ctr.length;
	var ctr2 = document.getElementById("kg_ctr2").value;
	if(ctr!=ctr2){
		document.getElementById("kg_output").innerHTML = "Las contraseñas no coinciden. Intente de nuevo.";
	}
	else if(l!=4){
	document.getElementById("kg_output").innerHTML = "La contraseña no es valida.";
	}

	else{

		var NAME=(name.concat(ctr,name,ctr,name,ctr,name,name,ctr)).split("").slice(0,keylen);
		var CTR=ctr.split("");
		var asig=((CTR[0]*CTR[1])+CTR[2]);
		var iter = (((CTR[1]*CTR[3])-CTR[2])%(keylen))+CTR[0];

		var ANS=[];
		var sumaN=0;


		for (var h =0;h<NAME.length;h++){
			NAME[h]=NAME[h].charCodeAt(0)%ml;
			sumaN=sumaN+NAME[h];
		}


		for (var k = 0; k < keylen; k++ )  {
			var esta=NAME[k];
			for (var j = 0;  j<iter; j++) {
				esta=(esta+asig+k+j+name.length+sumaN)%ml;
			}

			ANS.push(master[esta]);
		}
		var ans=ANS.join("");







		document.getElementById("kg_output").innerHTML = ans;
	}
	// var n = name.charCodeAt(0) - 65 + 17;



}

function setVisible_personal(){

document.getElementById("secret_page").style.visibility="visible";
console.log("a");
}


function setVisible(){
		document.getElementById("secret_t").style.visibility="visible";
		document.getElementById("secret_1").style.visibility="visible";
		document.getElementById("secret_2").style.visibility="visible";
		document.getElementById("secret_3").style.visibility="visible";




}